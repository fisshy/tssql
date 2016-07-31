module.exports = function() {
  return `SELECT  sys.objects.name,
              		sys.schemas.name AS schema_name,
              		sys.objects.type,
              		sys.objects.object_id
	          FROM sys.objects
          	INNER JOIN sys.schemas ON sys.objects.schema_id = sys.schemas.schema_id
          	WHERE sys.schemas.name = @schema
          	AND sys.objects.type = 'P'`
}
