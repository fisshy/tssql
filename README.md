# tssql
Generate TypeScript/ES6 based on MSSQL.

Work in progress.

## Dependencies
[node-mssql](https://github.com/patriksimek/node-mssql)

## Installation
```bin
$ not yet published
```

## Usage

### Stored Procedure
```sql
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
```

### Table Valued functions
