const createFile = require('./create-file');
const sqlTypes = require('./sql-types');
const camelCase = require('camelcase');
const upperCamelCase = require('uppercamelcase');

const max_params_size = 3;

const getTableColumns = (object) => {
  const input_params  = object.input_params.filter((row) => {
    return row.isTableColumn;
  });

  return input_params.reduce((curr, next) => {
    let name = next.name.replace('@', '') + '';

    let table_columns = object.table_columns.filter(tc => tc.object_id == next.object_id);

    let table_columns_string = table_columns.map(param => {
        const param_name = param.name.replace('@', '');
        return `${name}.columns.add('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) })`;
      })
      .reduce((curr, next) => {
        return (curr == "" ? curr : (curr + '\n    ')) + next;
      }, '');

      let table_rows_add = table_columns.map(param => {
          return `${name}Data[i].${param.name}`
        }).reduce((curr, next) => {
          return (curr == "" ? curr : (curr + ', ')) + next;
      }, '')

      let table_rows = `${name}.rows.add(${table_rows_add})`

      return `
    const ${name} = new sql.Table()
    ${table_columns_string}
      for (var i = 0; i < UpdateStockData.length; i++) {
        ${table_rows}
      }`;
  }, '');
}

const getInputParams = (object)  => {
  const input_params  = object.input_params.filter((row) => {
    return row.isParam;
  });
  const modelOrParams = input_params.length <= max_params_size;
  return modelOrParams ? (
    input_params.map((param) => {
      return param.name;
    }).reduce((curr, next) => {
      return (curr == "" ? curr : (curr + ', ')) + next;
    }, '')) : "params";
}

const getFuncInputParams = (object)  => {
  const input_params  = object.input_params.filter((row) => {
    return row.isParam;
  });
  const modelOrParams = input_params.length <= max_params_size;
  return modelOrParams ? (
    input_params.map((param) => {
      return param.isTableColumn ? param.name + "Data" : param.name;
    }).reduce((curr, next) => {
      return (curr == "" ? curr : (curr + ', ')) + next;
    }, '')) : "params";
}

const getReturnColumns = (object)  => {
  const return_columns = object.input_params.filter((row) => {
    return row.isColumn;
  });
  const modelOrParams = return_columns.length <= max_params_size;
  return modelOrParams ? (
    return_columns.map((param) => {
      return param.name;
    }).reduce((curr, next) => {
      return (curr == "" ? curr : (curr + ', ')) + next;
    }, '')) : "params";
}

const getSqlInputParams = (object) => {
  const sql_input_params = object.input_params.filter((row) => {
      return !row.is_output && row.isParam;
  });
  const modelOrParams = sql_input_params.length <= max_params_size;
  return sql_input_params.map(function(param) {
      const param_name = param.name.replace('@', '');
      const target = param.isTableColumn ? "" : modelOrParams ? param_name : `params.${param_name}`;
      return `request.input('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) }${target == "" ? "" : ", "}${target})`;
    }).reduce((curr, next) => {
      return (curr == "" ? curr : (curr + '\n    ')) + next;
    }, '');
}

const getSqlOutputParams = (object) => {
  const input_params = object.input_params.filter((row) => {
      return row.is_output  && row.isParam;
  });
  const modelOrParams = input_params.length <= max_params_size;
  return input_params.map(function(param) {
      const param_name = param.name.replace('@', '');
      const target = modelOrParams ? param_name : `params.${param_name}`;
      return `request.output('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) })`;
    }).reduce(function(curr, next) {
      return (curr == "" ? curr : (curr + '\n    ')) + next;
    }, '');
}

const getFunctionName = (object) => {
  return object.schema_name + '.' + object.name;
}

module.exports = {
  createFunction(type, object) {
    const name = object.name;

    const input_params       = getInputParams(object).replace(/@/g, '');
    const func_input_params  = getFuncInputParams(object).replace(/@/g, '');
    const at_input_params    = getInputParams(object);
    const sql_table_columns  = getTableColumns(object);
    const sql_input_params   = getSqlInputParams(object);
    const sql_output_params  = getSqlOutputParams(object);
    const sql_return_columns = getReturnColumns(object);
    let   type_name          = getFunctionName(object);

    var exec_or_select = "";

    switch(type) {
      case "U ":
        type_name = type_name.split('.').reduce((curr, next) => {
          return `[${curr}].[${next}]`;
        });
        console.log(type_name);
        exec_or_select = `request.query('SELECT ${sql_return_columns} FROM ${type_name} WITH(NOLOCK)', done);`
        break;
      case "TF":
        exec_or_select = `request.query('SELECT ${sql_return_columns} FROM ${type_name}(${at_input_params})', done);`
        break;
      case "P ":
        exec_or_select = `request.execute('${type_name}', done);`
        break;
    }

    console.log(type, type_name, exec_or_select, object.input_params.length <= max_params_size);

    const content =
`
    const request = new sql.Request(this.transaction || this.connection);
    ${sql_table_columns}
    ${sql_input_params}
    ${sql_output_params}
    ${exec_or_select}
`;

    const args = func_input_params === '' ? 'done' : func_input_params + ', done';

    const func =
`
  ${camelCase(name)}(${args}) {
    ${content}
  }
`;

    return func;
  },

  createClass(schema, functions) {
    var content = functions.reduce(function(curr, prev) {
      return curr + prev
    });
    var className = upperCamelCase(schema);
    var func =
`const sql = require('mssql');

class ${className} {

  constructor(connection) {
    this.connection = connection;
  }

  startTransaction() {
      this.transaction = new sql.Transaction(this.connection);
      return this.transaction;
  }

  rollbackTransaction(done) {
      if(this.transaction) {
          this.transaction.rollback(done);
      }
  }

  commitTransaction(done) {
      if(this.transaction) {
          this.transaction.commit(done);
      }
  }

  ${content}
}
module.exports = ${className};
    `
    return func;
  },
  createFile(fileName, content) {
    return createFile(upperCamelCase(fileName), content);
  }
};
