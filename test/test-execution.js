const config = require('../tssql.config.json')
const sql = require('mssql');
const Dbo = require('./Dbo');
var connection = new sql.Connection(config);
test = () => {
  var connection = new sql.Connection(config);

  connection.connect(function(err) {
    var dbo = new Dbo(connection);

    dbo.listAllUsers((err, recordsets, returnValue, affected) => {
      console.log(err, recordsets, returnValue, affected);
    });

    /*dbo.createUser('Peter', 'peter@peter.com', (err, recordsets, returnValue, affected) => {
      console.log(err, recordsets, returnValue, affected);
    });*/

    dbo.user((err, recordsets, returnValue, affected) => {
      console.log(err, recordsets, returnValue, affected);
    });

    dbo.getUsers(1, (err, recordsets, returnValue, affected) => {
      console.log(err, recordsets, returnValue, affected);
    });

  });

  setTimeout(() => {
    connection.close();
  }, 5000);

}


test();
