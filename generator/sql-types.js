module.exports = function(type, length, precision, scale) {
  length = length == -1 ? "sql.MAX" : length;
  switch (type) {
    case'bit': return 'sql.Bit'
    case'bigint': return 'sql.BigInt'
    case'decimal': return `sql.Decimal (${precision}, ${scale})`
    case'float': return 'sql.Float'
    case'int': return 'sql.Int'
    case'money': return 'sql.Money'
    case'numeric': return `sql.Numeric (${precision}, ${scale})`
    case'smallint': return 'sql.SmallInt'
    case'smallmoney': return 'sql.SmallMoney'
    case'real': return 'sql.Real'
    case'tinyint': return 'sql.TinyInt'
    case'char': return `sql.Char (${length})`
    case'nchar': return `sql.NChar (${length})`
    case'text': return 'sql.Text'
    case'ntext': return 'sql.NText'
    case'varchar': return `sql.VarChar (${length})`
    case'nvarchar': return `sql.NVarChar (${length})`
    case'xml': return 'sql.Xml'
    case'time': return `sql.Time (${scale})`
    case'date': return 'sql.Date'
    case'datetime': return 'sql.DateTime'
    case'datetime2': return `sql.DateTime2 (${scale})`
    case'datetimeoffset': return `sql.DateTimeOffset (${scale})`
    case'smalldatetime': return 'sql.SmallDateTime'
    case'uniqueidentifier': return 'sql.UniqueIdentifier'
    case'variant': return 'sql.Variant'
    case'binary': return 'sql.Binary'
    case'varbinary': return `sql.VarBinary (${length})`
    case'image': return 'sql.Image'
    case'udt': return 'sql.UDT'
    case'geography': return 'sql.Geography'
    case'geometry': return 'sql.Geometry'
    default: return type
  }
}
