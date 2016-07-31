var createFile = require('./create-file');
var sqlTypes = require('./sql-types');

module.exports = {
  createFunction : function(object) {
    var name = object.name;
    var modelOrParams = object.input_params.length <= 3;

    var input_params = modelOrParams ? (object.input_params.map(function(param) {
      return param.name.replace('@', '');
    }).reduce(function(curr, next) {
      return (curr == "" ? curr : (curr + ', ')) + next;
    }, '')) : "params";


    var sql_input_params =
      object.input_params.filter(function(row) {
        return !row.is_output; /* todo - filter input/output*/
      }).map(function(param) {
        var param_name = param.name.replace('@', '');
        var target = modelOrParams ? param_name : `params.${param_name}`;
        return `request.input('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) }, ${target})`;
      }).reduce(function(curr, next) {
        return (curr == "" ? curr : (curr + '\n    ')) + next;
      }, '');

    var sql_output_params =
      object.input_params.filter(function(row) {
        return row.is_output; /* todo - filter input/output*/
      }).map(function(param) {
        var param_name = param.name.replace('@', '');
        var target = modelOrParams ? param_name : `params.${param_name}`;
        return `request.output('${param_name}', ${ sqlTypes(param.sql_type, param.max_length, param.precision, param.scale) })`;
      }).reduce(function(curr, next) {
        return (curr == "" ? curr : (curr + '\n    ')) + next;
      }, '');

    var procedure_name = object.schema_name + '.' + object.name;

    var content =
`
    var request = new sql.Request(self.connection);

    ${sql_input_params}

    ${sql_output_params}

    request.execute('${procedure_name}', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });
`;

    var func = `

  this.${name} = function(${input_params}, done) {
    ${content}
  }

  `;


    return func;
  },
  createClass(schema, functions) {
    var content = functions.reduce(function(curr, prev) {
      return curr + prev + '\n'
    });
    var func = `
const sql = require('mssql');

function ${schema}(connection) {

  var self = this;

  this.connection = connection;

  ${content}
}

modules.export = ${schema};
    `
    return func;
  },
  createFile(fileName, content) {
    return createFile(fileName, content);
  }
};
