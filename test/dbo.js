const sql = require('mssql');

export class dbo(connection) {

  constructor(connection) {
    this.connection = connection;
  }

  
  CreateUser(Name, Email, done) {
    
    var request = new sql.Request(this.connection);
    request.input('Name', sql.NVarChar (100), Name)
    request.input('Email', sql.NVarChar (100), Email)
    
    request.execute('dbo.CreateUser', done);

  }

}
    