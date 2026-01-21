/**
 * Default connection string templates for different database engines.
 *
 * These templates use ${placeholder} syntax which will be substituted
 * with actual secret field values at deployment time using CloudFormation's
 * Fn::Sub intrinsic function.
 */
export const CONNECTION_STRING_TEMPLATES = {
  /**
   * MySQL connection string template
   * Format: mysql://username:password@host:port/database
   */
  MYSQL: 'mysql://${username}:${password}@${host}:${port}/${dbname}',

  /**
   * PostgreSQL connection string template
   * Format: postgresql://username:password@host:port/database
   */
  POSTGRES: 'postgresql://${username}:${password}@${host}:${port}/${dbname}',

  /**
   * MariaDB connection string template (uses MySQL protocol)
   * Format: mysql://username:password@host:port/database
   */
  MARIADB: 'mysql://${username}:${password}@${host}:${port}/${dbname}',

  /**
   * SQL Server connection string template
   * Format: sqlserver://host:port;database=database;user=username;password=password
   */
  SQLSERVER: 'sqlserver://${host}:${port};database=${dbname};user=${username};password=${password}',

  /**
   * Oracle connection string template
   * Format: oracle://username:password@host:port/service_name
   */
  ORACLE: 'oracle://${username}:${password}@${host}:${port}/${dbname}',
};
