module.exports = function() {
  return `SELECT	p.object_id,
              		p.name,
              		st.name as sql_type,
              		p.max_length,
              		p.scale,
              		p.precision,
                  p.is_output,
              		CAST(1 AS BIT) isParam,
              		CAST(0 AS BIT) isColumn
          	INTO #temp
          	FROM sys.parameters p WITH(NOLOCK)
          		INNER JOIN sys.systypes st WITH(NOLOCK) ON st.xtype = p.system_type_id AND st.xusertype  = p.system_type_id
          	WHERE object_id = @object_id
          	ORDER BY p.parameter_id

          INSERT INTO #temp
          SELECT	c.object_id,
              		c.name,
              		st.name as sql_type,
              		c.max_length,
              		c.scale,
              		c.precision,
                  CAST(0 AS BIT) is_output,
              		CAST(0 AS BIT) isParam,
              		CAST(1 AS BIT) isColumn
          	FROM sys.columns c WITH(NOLOCK)
          		INNER JOIN sys.systypes st WITH(NOLOCK) ON st.xtype = c.system_type_id AND st.xusertype  = c.system_type_id
          	WHERE object_id = @object_id
          	ORDER BY c.column_id

          SELECT *
          	FROM #temp

          DROP TABLE #temp`
}
