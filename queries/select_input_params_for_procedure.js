module.exports = function() {
  return `SELECT	p.object_id,
              		p.name,
              		st.name as sql_type,
              		p.max_length,
                  p.is_output,
              		p.scale,
              		p.precision
              	FROM sys.parameters p WITH(NOLOCK)
              	INNER JOIN sys.systypes st WITH(NOLOCK) ON st.xtype = p.system_type_id AND st.xusertype  = p.system_type_id
                WHERE object_id = @object_id
                ORDER BY parameter_id `
}
