module.exports = function() {
  return `SELECT	p.object_id,
              		p.name,
              		st.name as sql_type,
              		p.max_length,
              		p.scale,
              		p.precision,
                  p.is_output,
              		CAST(1 AS BIT) isParam,
              		CAST(0 AS BIT) isColumn,
                  CAST(0 AS BIT) isTableColumn
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
              		CAST(1 AS BIT) isColumn,
                  CAST(0 AS BIT) isTableColumn
          	FROM sys.columns c WITH(NOLOCK)
          		INNER JOIN sys.systypes st WITH(NOLOCK) ON st.xtype = c.system_type_id AND st.xusertype  = c.system_type_id
          	WHERE object_id = @object_id
          	ORDER BY c.column_id

          INSERT INTO #temp
        	SELECT	p.object_id,
                  p.name,
                  REPLACE(p.name, '@', '') as sql_type,
                  p.max_length,
                  p.scale,
                  p.precision,
                  p.is_output,
                  CAST(1 AS BIT) isParam,
                  CAST(0 AS BIT) isColumn,
                  CAST(1 AS BIT) isTableColumn
      		FROM sys.parameters p WITH(NOLOCK)
      		WHERE p.is_readonly = 1 and object_id = @object_id
      		ORDER BY p.parameter_id

          SELECT *
          	FROM #temp

          DROP TABLE #temp`
}
