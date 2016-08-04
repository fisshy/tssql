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

### Input
#### Stored Procedure
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

#### Table Valued functions
```sql
CREATE FUNCTION [dbo].[ListAllUsers]
(
)
RETURNS @temp TABLE
(
	UserId bigint,
	Name nvarchar(50),
	Email nvarchar(50)
)
AS
BEGIN
	INSERT INTO @temp (
			UserId,
			Name,
			Email
	)
	SELECT	Id,
			Name,
			Email
		FROM dbo.[User] WITH(NOLOCK)

	RETURN
END

CREATE FUNCTION [dbo].[GetUsers]
(
	@UserId bigint
)
RETURNS @temp TABLE
(
	UserId bigint,
	Name nvarchar(50),
	Email nvarchar(50)
)
AS
BEGIN
	INSERT INTO @temp (
			UserId,
			Name,
			Email
	)
	SELECT	Id,
			Name,
			Email
		FROM dbo.[User] WITH(NOLOCK)
		WHERE Id = @UserId

	RETURN
END

```

#### Tables
```sql
CREATE TABLE [dbo].[User] (
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL
)
```

#### Command
```bin
$ tssql -g --schema dbo
```
#### Output
> Dbo.ts
```js
```

OR
#### Command
```bin
$ tssql -g -js --schema dbo
```

#### Output
> Dbo.js

```js
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
    request.input('Name', sql.NVarChar (100), Name);
    request.input('Email', sql.NVarChar (100), Email);
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
```
