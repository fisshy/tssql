
const sql = require('mssql');

function Web(connection) {

  var self = this;

  this.connection = connection;

  

  this.Error = function(Key, Culture, done) {
    
    var request = new sql.Request(self.connection);

    request.input('Key', sql.NVarChar (512), Key)
    request.input('Culture', sql.NVarChar (10), Culture)

    

    request.execute('Web.Error', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  

  this.RegisterUser = function(params, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AccountName', sql.NVarChar (512), params.AccountName)
    request.input('SubscriptionPublicId', sql.UniqueIdentifier, params.SubscriptionPublicId)
    request.input('Name', sql.NVarChar (512), params.Name)
    request.input('UserName', sql.NVarChar (512), params.UserName)
    request.input('Password', sql.NVarChar (512), params.Password)
    request.input('Email', sql.NVarChar (512), params.Email)
    request.input('Culture', sql.NVarChar (10), params.Culture)

    

    request.execute('Web.RegisterUser', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  


  this.AddProjectTask = function(params, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AuthorUserId', sql.BigInt, params.AuthorUserId)
    request.input('AccountId', sql.BigInt, params.AccountId)
    request.input('ProjectId', sql.BigInt, params.ProjectId)
    request.input('TaskId', sql.BigInt, params.TaskId)
    request.input('TeamId', sql.BigInt, params.TeamId)
    request.input('Name', sql.NVarChar (512), params.Name)
    request.input('IsBillable', sql.Bit, params.IsBillable)
    request.input('HourlyRate', sql.Decimal (18, 4), params.HourlyRate)

    

    request.execute('Web.AddProjectTask', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  


  this.AddProjectUser = function(params, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AuthorUserId', sql.BigInt, params.AuthorUserId)
    request.input('AccountId', sql.BigInt, params.AccountId)
    request.input('ProjectId', sql.BigInt, params.ProjectId)
    request.input('TeamId', sql.BigInt, params.TeamId)
    request.input('UserId', sql.BigInt, params.UserId)

    

    request.execute('Web.AddProjectUser', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  


  this.AddTeamUser = function(params, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AuthorUserId', sql.BigInt, params.AuthorUserId)
    request.input('AccountId', sql.BigInt, params.AccountId)
    request.input('TeamId', sql.BigInt, params.TeamId)
    request.input('UserId', sql.BigInt, params.UserId)
    request.input('RoleId', sql.BigInt, params.RoleId)

    

    request.execute('Web.AddTeamUser', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  


  this.CreateCustomer = function(AuthorUserId, AccountId, Name, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AuthorUserId', sql.BigInt, AuthorUserId)
    request.input('AccountId', sql.BigInt, AccountId)
    request.input('Name', sql.NVarChar (512), Name)

    

    request.execute('Web.CreateCustomer', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  


  this.CreateProject = function(params, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AuthorUserId', sql.BigInt, params.AuthorUserId)
    request.input('AccountId', sql.BigInt, params.AccountId)
    request.input('CustomerId', sql.BigInt, params.CustomerId)
    request.input('TeamId', sql.BigInt, params.TeamId)
    request.input('Name', sql.NVarChar (512), params.Name)
    request.input('ProjectCode', sql.NVarChar (100), params.ProjectCode)
    request.input('Notes', sql.NVarChar (8000), params.Notes)
    request.input('Start', sql.DateTime, params.Start)
    request.input('Stop', sql.DateTime, params.Stop)
    request.input('IsBillable', sql.Bit, params.IsBillable)
    request.input('IsTaskBased', sql.Bit, params.IsTaskBased)
    request.input('IsProjectBased', sql.Bit, params.IsProjectBased)
    request.input('IsPersonBased', sql.Bit, params.IsPersonBased)
    request.input('HasBudget', sql.Bit, params.HasBudget)

    

    request.execute('Web.CreateProject', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  


  this.CreateTeam = function(AuthorUserId, AccountId, Name, done) {
    
    var request = new sql.Request(self.connection);

    request.input('AuthorUserId', sql.BigInt, AuthorUserId)
    request.input('AccountId', sql.BigInt, AccountId)
    request.input('Name', sql.NVarChar (512), Name)

    

    request.execute('Web.CreateTeam', function(err, recordsets, returnValue, affected) {
      done.apply(self, arguments);
    });

  }

  

}

modules.export = Web;
    