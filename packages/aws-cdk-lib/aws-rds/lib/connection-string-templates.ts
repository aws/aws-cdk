/**
 * Default connection string templates for different database engines.
 *
 * These templates use `${fieldName}` syntax for placeholders, which will be
 * interpolated at deployment time using CloudFormation's Fn::Sub intrinsic function
 * with dynamic references to the secret fields.
 *
 * @example
 * const connectionString = secret.connectionString(CONNECTION_STRING_TEMPLATES.MYSQL);
 */
export const CONNECTION_STRING_TEMPLATES = {
  /**
   * MySQL connection string template.
   * Format: mysql://username:password@host:port/dbname
   */
  MYSQL: 'mysql://${username}:${password}@${host}:${port}/${dbname}',

  /**
   * PostgreSQL connection string template.
   * Format: postgresql://username:password@host:port/dbname
   */
  POSTGRES: 'postgresql://${username}:${password}@${host}:${port}/${dbname}',

  /**
   * SQL Server connection string template.
   * Format: sqlserver://host:port;database=dbname;user=username;password=password
   */
  SQLSERVER: 'sqlserver://${host}:${port};database=${dbname};user=${username};password=${password}',

  /**
   * Oracle connection string template.
   * Format: oracle://username:password@host:port/dbname
   */
  ORACLE: 'oracle://${username}:${password}@${host}:${port}/${dbname}',

  /**
   * MariaDB connection string template (same as MySQL).
   * Format: mysql://username:password@host:port/dbname
   */
  MARIADB: 'mysql://${username}:${password}@${host}:${port}/${dbname}',
};
