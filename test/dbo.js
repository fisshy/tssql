const sql = require('mssql');

class Dbo {

  constructor(connection) {
    this.connection = connection;
  }

  
  user(done) {
    
    const request = new sql.Request(this.connection);
    
    
    request.query('SELECT Id, Name, Email FROM [dbo].[User] WITH(NOLOCK)', done);

  }

  createUser(Name, Email, done) {
    
    const request = new sql.Request(this.connection);
    request.input('Name', sql.NVarChar (100), Name)
    request.input('Email', sql.NVarChar (100), Email)
    
    request.execute('dbo.CreateUser', done);

  }

  listAllUsers(done) {
    
    const request = new sql.Request(this.connection);
    
    
    request.query('SELECT UserId, Name, Email FROM dbo.ListAllUsers()', done);

  }

  getUsers(UserId, done) {
    
    const request = new sql.Request(this.connection);
    request.input('UserId', sql.BigInt, UserId)
    
    request.query('SELECT UserId, Name, Email FROM dbo.GetUsers(@UserId)', done);

  }

}
module.exports = Dbo;
    