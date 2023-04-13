/**
 * The compression type used by `StorageParameters.COMPRESSION_TYPE`.
 */
export enum CompressionType {
  /**
   * No compression.
   */
  NONE = 'none',

  /**
   * Burrows-Wheeler compression.
   */
  BZIP2 = 'bzip2',

  /**
   * Deflate compression.
   */
  GZIP = 'gzip',

  /**
   * Compression algorithm focused on high compression and decompression speeds, rather than the maximum possible compression.
   */
  SNAPPY = 'snappy',
}

/**
 * Specifies the action to perform when query results contain invalid UTF-8 character values.
 */
export enum InvalidCharHandlingAction {
  /**
   * Doesn't perform invalid character handling.
   */
  DISABLED = 'DISABLED',

  /**
   * Cancels queries that return data containing invalid UTF-8 values.
   */
  FAIL = 'FAIL',

  /**
   * Replaces invalid UTF-8 values with null.
   */
  SET_TO_NULL = 'SET_TO_NULL',

  /**
   * Replaces each value in the row with null.
   */
  DROP_ROW = 'DROP_ROW',

  /**
   * Replaces the invalid character with the replacement character you specify using `REPLACEMENT_CHAR`.
   */
  REPLACE = 'REPLACE',
}

/**
 * The action to assign to `COLUMN_COUNT_MISMATCH_HANDLING`.
 */
export enum NumericOverflowHandlingAction {
  /**
   * Invalid character handling is turned off.
   */
  DISABLED = 'DISABLED',

  /**
   * Cancel the query when the data includes invalid characters.
   */
  FAIL = 'FAIL',

  /**
   * Set invalid characters to null.
   */
  SET_TO_NULL = 'SET_TO_NULL',

  /**
   * Set each value in the row to null.
   */
  DROP_ROW = 'DROP_ROW',
}

/**
 * The action to assign to `COLUMN_COUNT_MISMATCH_HANDLING`.
 */
export enum SurplusBytesHandlingAction {
  /**
   * Replaces data that exceeds the column width with null.
   */
  SET_TO_NULL = 'SET_TO_NULL',

  /**
   * Doesn't perform surplus byte handling.
   */
  DISABLED = 'DISABLED',

  /**
   * Cancels queries that return data exceeding the column width.
   */
  FAIL = 'FAIL',

  /**
   * Drop all rows that contain data exceeding column width.
   */
  DROP_ROW = 'DROP_ROW',

  /**
   * Removes the characters that exceed the maximum number of characters defined for the column.
   */
  TRUNCATE = 'TRUNCATE',
}

/**
 * The action to assign to `COLUMN_COUNT_MISMATCH_HANDLING`.
 */
export enum SurplusCharHandlingAction {
  /**
   * Replaces data that exceeds the column width with null.
   */
  SET_TO_NULL = 'SET_TO_NULL',

  /**
   * Doesn't perform surplus character handling.
   */
  DISABLED = 'DISABLED',

  /**
   * Cancels queries that return data exceeding the column width.
   */
  FAIL = 'FAIL',

  /**
   * Replaces each value in the row with null.
   */
  DROP_ROW = 'DROP_ROW',

  /**
   * Removes the characters that exceed the maximum number of characters defined for the column.
   */
  TRUNCATE = 'TRUNCATE',
}

/**
 * The action to assign to `COLUMN_COUNT_MISMATCH_HANDLING`.
 */
export enum ColumnCountMismatchHandlingAction {
  /**
   * Column count mismatch handling is turned off.
   */
  DISABLED = 'DISABLED',

  /**
   * Fail the query if the column count mismatch is detected.
   */
  FAIL = 'FAIL',

  /**
   * Fill missing values with NULL and ignore the additional values in each row.
   */
  SET_TO_NULL = 'SET_TO_NULL',

  /**
   * Drop all rows that contain column count mismatch error from the scan.
   */
  DROP_ROW = 'DROP_ROW',
}

export class StorageParameters {
  /**
   * The number of rows to skip at the top of a CSV file when the table is being created.
   */
  public static readonly SKIP_HEADER_LINE_COUNT = new StorageParameters('skip.header.line.count');

  /**
   * Determines whether data handling is on for the table.
   */
  public static readonly DATA_CLEANSING_ENABLED = new StorageParameters('data_cleansing_enabled');

  /**
   * The type of compression used on the table, when the file name does not contain an extension. This value overrides the compression type specified through the extension.
   *
   * Assign this parameter to a value of `StorageParameters.CompressionType`
   */
  public static readonly COMPRESSION_TYPE = new StorageParameters('compression_type');

  /**
   * Specifies the action to perform when query results contain invalid UTF-8 character values.
   *
   * Assign this parameter to a value of `StorageParameters.InvalidCharHandlingAction`
   */
  public static readonly INVALID_CHAR_HANDLING = new StorageParameters('invalid_char_handling');

  /**
   * Specifies the replacement character to use when you set `INVALID_CHAR_HANDLING` to `REPLACE`.
   */
  public static readonly REPLACEMENT_CHAR = new StorageParameters('replacement_char');

  /**
   * Specifies the action to perform when ORC data contains an integer (for example, BIGINT or int64) that is larger than the column definition (for example, SMALLINT or int16).
   *
   * Assign this parameter to a value of `StorageParameters.NumericOverflowHandlingAction`
   */
  public static readonly NUMERIC_OVERFLOW_HANDLING = new StorageParameters('numeric_overflow_handling');

  /**
   * Specifies how to handle data being loaded that exceeds the length of the data type defined for columns containing VARBYTE data. By default, Redshift Spectrum sets the value to null for data that exceeds the width of the column.
   *
   * Assign this parameter to a value of `StorageParameters.SurplusBytesHandlingAction`
   */
  public static readonly SURPLUS_BYTES_HANDLING = new StorageParameters('surplus_bytes_handling');

  /**
   * Specifies how to handle data being loaded that exceeds the length of the data type defined for columns containing VARCHAR, CHAR, or string data. By default, Redshift Spectrum sets the value to null for data that exceeds the width of the column.
   *
   * Assign this parameter to a value of `StorageParameters.SurplusCharHandlingAction`
   */
  public static readonly SURPLUS_CHAR_HANDLING = new StorageParameters('surplus_char_handling');

  /**
   * Identifies if the file contains less or more values for a row than the number of columns specified in the external table definition. This property is only available for an uncompressed text file format.
   *
   * Assign this parameter to a value of `StorageParameters.ColumnCountMismatchHandling`
   */
  public static readonly COLUMN_COUNT_MISMATCH_HANDLING = new StorageParameters('column_count_mismatch_handling');

  /**
   * A property that sets the numRows value for the table definition. To explicitly update an external table's statistics, set the numRows property to indicate the size of the table. Amazon Redshift doesn't analyze external tables to generate the table statistics that the query optimizer uses to generate a query plan. If table statistics aren't set for an external table, Amazon Redshift generates a query execution plan based on an assumption that external tables are the larger tables and local tables are the smaller tables.
   */
  public static readonly NUM_ROWS = new StorageParameters('num_rows');

  /**
   * A property that sets number of rows to skip at the beginning of each source file.
   *
   * Assign this parameter to a value of `StorageParameters.SerializationNullFormat`
   */
  public static readonly SERIALIZATION_NULL_FORMAT = new StorageParameters('serialization.null.format');

  /**
   * A property that sets the column mapping type for tables that use ORC data format. This property is ignored for other data formats. If this property is omitted, columns are mapped by `OrcColumnMappingType.NAME` by default.
   *
   * Assign this parameter to a value of `StorageParameters.OrcColumnMappingType`
   */
  public static readonly ORC_SCHEMA_RESOLUTION = new StorageParameters('orc.schema.resolution');

  /**
   * A property that sets whether CREATE EXTERNAL TABLE AS should write data in parallel. By default, CREATE EXTERNAL TABLE AS writes data in parallel to multiple files, according to the number of slices in the cluster. The default option is on. When 'write.parallel' is set to off, CREATE EXTERNAL TABLE AS writes to one or more data files serially onto Amazon S3. This table property also applies to any subsequent INSERT statement into the same external table.
   *
   * Assign this parameter to a value of `StorageParameters.WriteParallel`
   */
  public static readonly WRITE_PARALLEL = new StorageParameters('write.parallel');

  /**
   * A property that sets the maximum size (in MB) of each file written to Amazon S3 by CREATE EXTERNAL TABLE AS. The size must be a valid integer between 5 and 6200. The default maximum file size is 6,200 MB. This table property also applies to any subsequent INSERT statement into the same external table.
   */
  public static readonly WRITE_MAX_FILESIZE_MB = new StorageParameters('write.maxfilesize.mb');

  /**
   * You can specify an AWS Key Management Service key to enable Server–Side Encryption (SSE) for Amazon S3 objects.
   */
  public static readonly WRITE_KMS_KEY_ID = new StorageParameters('write.kms.key.id');

  /**
   * A custom storage parameter.
   * @param key The key of the parameter.
   */
  public static custom(key: string) {
    return new StorageParameters(key);
  }

  protected constructor(public readonly key: string) {}
}