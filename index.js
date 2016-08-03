#! /usr/bin/env node
const sql = require('mssql');
const argv = require('minimist')(process.argv.slice(2));
const _ = require('async');

const select_target_schema = require('./queries/select_target_schema')();
const select_input_params = require('./queries/select_input_params')();

const generator = require('./generator/generator');

console.dir(argv);

/* --con ... --use env */

/* tssql generate --procedure --schema Web*/
/* tssql generate -p -s Web*/

const config = require('./tssql.config.json')

let hasTarget = argv.p || argv.tf || argv.t;

if(argv.g && argv.schema) {

  var connection = new sql.Connection(config);

  connection.connect(function(err) {

    if(err) {
      console.log("error", err);
      return;
    }

    const type = argv.p ? "P" : (argv.tf ? "TF" : null);

    let request = new sql.Request(connection);
    request.input('schema', sql.NVarChar, argv.schema);

    request.query(select_target_schema, function(err, recordset) {

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

        var parallel = recordset.map(function(row) {
          return function(done) {
            request = new sql.Request(connection);
            request.input('object_id', sql.Int, row.object_id);
            request.query(select_input_params, function(err, recordset) {

              if(err) {
                done(err);
                return;
              }

              if(!recordset || !recordset.length) {
                done(null, '');
                return;
              }

              if(hasTarget) {
                if(row.type === "P" && !argv.p) { done(null, ''); return; }
                if(row.type === "TF" && !argv.tf) { done(null, ''); return; }
                if(row.type === "T" && !argv.t) { done(null, ''); return; }
              }

              row.input_params = recordset;

              done(null, generator.createFunction(row.type, row));

            });
          };

        });

        _.parallel(parallel, function(err, results) {

            if(err) {
              console.log(err);
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
