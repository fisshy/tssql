module.exports = function() {
  return `SELECT	p.object_id,
              		c.name,
              		st.name as sql_type,
              		c.max_length,
              		c.scale,
              		c.precision,
              		CAST(0 AS BIT) is_output,
              		CAST(0 AS BIT) isParam,
              		CAST(0 AS BIT) isColumn,
              		CAST(1 AS BIT) isTableParam
          	FROM sys.parameters p WITH(NOLOCK)
          		INNER JOIN sys.table_types tt WITH(NOLOCK) ON tt.system_type_id = p.system_type_id AND tt.user_type_id = p.user_type_id
          		INNER JOIN sys.columns c with(nolock) ON c.object_id = tt.type_table_object_id
          		INNER JOIN sys.systypes st WITH(NOLOCK) ON st.xtype = c.system_type_id AND st.xusertype  = c.system_type_id
          	WHERE p.is_readonly = 1 and p.object_id = @object_id
            ORDER BY p.parameter_id
  `
}
