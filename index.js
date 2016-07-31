#! /usr/bin/env node
const sql = require('mssql');
const argv = require('minimist')(process.argv.slice(2));
const _ = require('async');

const select_procedures_target_schema = require('./queries/select_procedures_target_schema')();
const select_input_params_for_procedure = require('./queries/select_input_params_for_procedure')();

const generator = require('./generator/generator');

console.dir(argv);

/* --con ... --use env */

/* tssql generate --procedure --schema Web*/
/* tssql generate -p -s Web*/

var config = require('./tssql.config.json')


if(argv.p && argv.g && argv.schema) {

  var connection = new sql.Connection(config);

  connection.connect(function(err) {

    if(err) {
      console.log("error", err);
      return;
    }

    var request = new sql.Request(connection);
    request.input('schema', sql.NVarChar, argv.schema);
    request.query(select_procedures_target_schema, function(err, recordset) {

        if(err) {
          console.log("prepare error", err);
          connection.close();
          return;
        }

        if(!recordset || !recordset.length) {
          console.log("recordset empty");
          connection.close();
          return;
        }

        console.log("found data");

        var parallel = recordset.map(function(row) {
          return function(done) {
            request = new sql.Request(connection);
            request.input('object_id', sql.Int, row.object_id);
            request.query(select_input_params_for_procedure, function(err, recordset) {

              if(err) {
                done(err);
                return;
              }

              if(!recordset || !recordset.length) {
                done("recordset empty");
                return;
              }

              row.input_params = recordset;

              done(null, generator.createFunction(row));

            });
          };

        });

        _.parallel(parallel, function(err, results) {
            if(err) {
              connection.close();
              return;
            }

            var classWrapper = generator.createClass(argv.schema, results);
            generator.createFile(argv.schema, classWrapper);
            
            connection.close();
        });

    });

  });

}
