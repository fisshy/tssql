
const sql = require('mssql');

function dbo(connection) {

  var self = this;

  this.connection = connection;

  
  this.CreateUser = function(Name, Email, done) {
    
    var request = new sql.Request(self.connection);

    request.input('Name', sql.NVarChar (100), Name)
    request.input('Email', sql.NVarChar (100), Email)

    

    request.execute('dbo.CreateUser', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

}

modules.export = dbo;
    