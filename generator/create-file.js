var fs = require('fs');
var path = require('path');

module.exports = function(fileName, content) {
  var file = process.cwd() + '\\' + fileName + ".js";

  fs.writeFile(file, content, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log(fileName + " created!");
  });
}
