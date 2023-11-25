import { DatabaseQueryHandlerProps, TableHandlerProps } from './handler-props';

export type ClusterProps = Omit<DatabaseQueryHandlerProps, 'handler'>;
export type TableAndClusterProps = TableHandlerProps & ClusterProps;

/**
 * The sort style of a table.
 * This has been duplicated here to exporting private types.
 */
export enum TableSortStyle {
  /**
   * Amazon Redshift assigns an optimal sort key based on the table data.
   */
  AUTO = 'AUTO',

  /**
   * Specifies that the data is sorted using a compound key made up of all of the listed columns,
   * in the order they are listed.
   */
  COMPOUND = 'COMPOUND',

  /**
   * Specifies that the data is sorted using an interleaved sort key.
   */
  INTERLEAVED = 'INTERLEAVED',
}

/**
 * The data distribution style of a table.
 */
export enum TableDistStyle {
  /**
   *  Amazon Redshift assigns an optimal distribution style based on the table data
   */
  AUTO = 'AUTO',

  /**
   * The data in the table is spread evenly across the nodes in a cluster in a round-robin distribution.
   */
  EVEN = 'EVEN',

  /**
   * The data is distributed by the values in the DISTKEY column.
   */
  KEY = 'KEY',

  /**
   * A copy of the entire table is distributed to every node.
   */
  ALL = 'ALL',
}

/**
 * The compression encoding of a column.
 *
 * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Compression_encodings.html
 */
export enum ColumnEncoding {
  /**
   * Amazon Redshift assigns an optimal encoding based on the column data.
   * This is the default.
   */
  AUTO = 'AUTO',

  /**
   * The column is not compressed.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Raw_encoding.html
   */
  RAW = 'RAW',

  /**
   * The column is compressed using the AZ64 algorithm.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/az64-encoding.html
   */
  AZ64 = 'AZ64',

  /**
   * The column is compressed using a separate dictionary for each block column value on disk.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Byte_dictionary_encoding.html
   */
  BYTEDICT = 'BYTEDICT',

  /**
   * The column is compressed based on the difference between values in the column.
   * This records differences as 1-byte values.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Delta_encoding.html
   */
  DELTA = 'DELTA',

  /**
   * The column is compressed based on the difference between values in the column.
   * This records differences as 2-byte values.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Delta_encoding.html
   */
  DELTA32K = 'DELTA32K',

  /**
   * The column is compressed using the LZO algorithm.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/lzo-encoding.html
   */
  LZO = 'LZO',

  /**
   * The column is compressed to a smaller storage size than the original data type.
   * The compressed storage size is 1 byte.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
   */
  MOSTLY8 = 'MOSTLY8',

  /**
   * The column is compressed to a smaller storage size than the original data type.
   * The compressed storage size is 2 bytes.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
   */
  MOSTLY16 = 'MOSTLY16',

  /**
   * The column is compressed to a smaller storage size than the original data type.
   * The compressed storage size is 4 bytes.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
   */
  MOSTLY32 = 'MOSTLY32',

  /**
   * The column is compressed by recording the number of occurrences of each value in the column.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Runlength_encoding.html
   */
  RUNLENGTH = 'RUNLENGTH',

  /**
   * The column is compressed by recording the first 245 unique words and then using a 1-byte index to represent each word.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Text255_encoding.html
   */
  TEXT255 = 'TEXT255',

  /**
   * The column is compressed by recording the first 32K unique words and then using a 2-byte index to represent each word.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Text255_encoding.html
   */
  TEXT32K = 'TEXT32K',

  /**
   * The column is compressed using the ZSTD algorithm.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html
   */
  ZSTD = 'ZSTD',
}

/**
 * A column in a Redshift table.
 */
export interface Column {
  /**
   * The unique identifier of the column.
   *
   * This is not the name of the column, and renaming this identifier will cause a new column to be created and the old column to be dropped.
   *
   * **NOTE** - This field will be set, however, only by setting the `@aws-cdk/aws-redshift:columnId` feature flag will this field be used.
   *
   * @default - the column name is used as the identifier
   */
  readonly id?: string;

  /**
   * The name of the column. This will appear on Amazon Redshift.
   */
  readonly name: string;

  /**
   * The data type of the column.
   */
  readonly dataType: string;

  /**
   * Boolean value that indicates whether the column is to be configured as DISTKEY.
   *
   * @default - column is not DISTKEY
   */
  readonly distKey?: boolean;

  /**
   * Boolean value that indicates whether the column is to be configured as SORTKEY.
   *
   * @default - column is not a SORTKEY
   */
  readonly sortKey?: boolean;

  /**
   * The encoding to use for the column.
   *
   * @default - Amazon Redshift determines the encoding based on the data type.
   */
  readonly encoding?: ColumnEncoding;

  /**
   * A comment to attach to the column.
   *
   * @default - no comment
   */
  readonly comment?: string;
}
