/**
 * Supported Datatypes in Athena
 */
export enum DataType {
  /**
   * Values are true and false.
   */
  BOOLEAN = 'BOOLEAN',
  /**
   * A 8-bit signed INTEGER in two’s complement format, with a minimum value of -2^7 and a maximum value of 2^7-1.
   */
  TINYINT = 'TINYINT',
  /**
   * A 16-bit signed INTEGER in two’s complement format, with a minimum value of -2^15 and a maximum value of 2^15-1.
   */
  SMALLINT = 'SMALLINT',
  /**
   * Athena combines two different implementations of the INTEGER data type. In Data Definition Language (DDL)
   * queries, Athena uses the INT data type. In all other queries, Athena uses the INTEGER data type, where INTEGER
   * is represented as a 32-bit signed value in two's complement format, with a minimum value of-2^31 and a maximum
   * value of 2^31-1. In the JDBC driver, INTEGER is returned, to ensure compatibility with business analytics
   * applications.
   */
  INT = 'INT',
  /**
   * A 64-bit signed INTEGER in two’s complement format, with a minimum value of -2^63 and a maximum value of 2^63-1.
   */
  BIGINT = 'BIGINT',
  /**
   * Floating-point types
   */
  DOUBLE = 'DOUBLE',
  /**
   * Floating-point types
   */
  FLOAT = 'FLOAT',
  /**
   * TODO
   * [ (precision, scale) ], where precision is the total number of digits, and scale (optional) is the number of
   * digits in fractional part, the default is 0. For example, use these type definitions: DECIMAL(11,5), DECIMAL(15).
   * To specify decimal values as literals, such as when selecting rows with a specific decimal value in a query DDL
   * expression, specify the DECIMAL type definition, and list the decimal value as a literal (in single quotes) in
   * your query, as in this example: decimal_value = DECIMAL '0.12'.
   */
  DECIMAL = 'DECIMALTODO',
  /**
   * Fixed length character data, with a specified length between 1 and 255, such as char(10).
   * For more information, see CHAR Hive Data Type.
   * https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Types#LanguageManualTypes-char
   */
  CHAR = 'CHAR',
  /**
   * Variable length character data, with a specified length between 1 and 65535, such as varchar(10).
   * For more information, see VARCHAR Hive Data Type.
   * https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Types#LanguageManualTypes-varchar
   */
  VARCHAR = 'VARCHAR',
  /**
   * Not Officially documented, but clearly supported by Athena :shrug emoji:
   */
  STRING = 'STRING',
  /**
   * (for data in Parquet)
   */
  BINARY = 'BINARY',
  /**
   * DATE, in the UNIX format, such as YYYY-MM-DD.
   */
  DATE = 'DATE',
  /**
   * Instant in time and date in the UNiX format, such as yyyy-mm-dd hh:mm:ss[.f...].
   * For example, TIMESTAMP '2008-09-15 03:04:05.324'. This format uses the session time zone.
   */
  TIMESTAMP = 'TIMESTAMP',
  /**
   * < data_type >
   */
  ARRAY = 'ARRAYTODO',
  /**
   * < primitive_type, data_type >
   */
  MAP = 'MAPTODO',
  /**
   * < col_name : data_type [COMMENT col_comment] [, ...] >
   */
  STRUCT = 'STRUCTTODO'
}