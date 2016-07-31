# tssql
Generate TypeScript/JavaScript based on MSSQL.

Work in progress.

## Installation
```
$ not yet published
```

## Usage

```
CREATE PROCEDURE dbo.CreateUser
  @Name nvarchar(50),
  @Email nvarchar(50)
  AS
  BEGIN
  SET NOCOUNT ON;

  INSERT INTO dbo.[User](Name, Email)
  VALUES(@Name, @Email);

  RETURN SCOPE_IDENTITY();

END
```

```bin
$ tssql -g -p --schema dbo
```

```js
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
```
