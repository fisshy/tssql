const createFile = require('./create-file');
const sqlTypes = require('./sql-types');
const camelCase = require('camelcase');
const upperCamelCase = require('uppercamelcase');

module.exports = {
  createFunction : function(object) {
    const name = object.name;
    const modelOrParams = object.input_params.length <= 3;

    var input_params = modelOrParams ? (object.input_params.map(function(param) {
      return param.name.replace('@', '');
    }).reduce(function(curr, next) {
      return (curr == "" ? curr : (curr + ', ')) + next;
    }, '')) : "params";


    var sql_input_params =
      object.input_params.filter(function(row) {
        return !row.is_output; /* todo - filter input/output*/
      }).map(function(param) {
        const param_name = param.name.replace('@', '');
        const target = modelOrParams ? param_name : `params.${param_name}`;
        return `request.input('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) }, ${target})`;
      }).reduce(function(curr, next) {
        return (curr == "" ? curr : (curr + '\n    ')) + next;
      }, '');

    var sql_output_params =
      object.input_params.filter(function(row) {
        return row.is_output; /* todo - filter input/output*/
      }).map(function(param) {
        const param_name = param.name.replace('@', '');
        const target = modelOrParams ? param_name : `params.${param_name}`;
        return `request.output('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) })`;
      }).reduce(function(curr, next) {
        return (curr == "" ? curr : (curr + '\n    ')) + next;
      }, '');

    const procedure_name = object.schema_name + '.' + object.name;

    const content =
`
    const request = new sql.Request(this.connection);
    ${sql_input_params}
    ${sql_output_params}
    request.execute('${procedure_name}', done);
`;

    const func =
`
  ${camelCase(name)}(${input_params}, done) {
    ${content}
  }
`;


    return func;
  },
  createClass(schema, functions) {
    var content = functions.reduce(function(curr, prev) {
      return curr + prev
    });
    var func =
`const sql = require('mssql');

export class ${upperCamelCase(schema)}(connection) {

  constructor(connection) {
    this.connection = connection;
  }

  ${content}
}
    `
    return func;
  },
  createFile(fileName, content) {
    return createFile(fileName, content);
  }
};
