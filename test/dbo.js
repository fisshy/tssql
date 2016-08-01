const sql = require('mssql');

export class Dbo(connection) {

  constructor(connection) {
    this.connection = connection;
  }

  
  createUser(Name, Email, done) {
    
    const request = new sql.Request(this.connection);
    request.input('Name', sql.NVarChar (100), Name)
    request.input('Email', sql.NVarChar (100), Email)
    
    request.execute('dbo.CreateUser', done);

  }

}
    