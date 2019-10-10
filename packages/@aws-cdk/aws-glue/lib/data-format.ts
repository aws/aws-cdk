/**
 * Absolute class name of the Hadoop `InputFormat` to use when reading table files.
 */
export class InputFormat {
  /**
   * An InputFormat for plain text files. Files are broken into lines. Either linefeed or
   * carriage-return are used to signal end of line. Keys are the position in the file, and
   * values are the line of text.
   *
   * @see https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapred/TextInputFormat.html
   */
  public static readonly TEXT_INPUT_FORMAT = new InputFormat('org.apache.hadoop.mapred.TextInputFormat');

  constructor(public readonly className: string) {}
}

/**
 * Absolute class name of the Hadoop `OutputFormat` to use when writing table files.
 */
export class OutputFormat {
  /**
   * Writes text data with a null key (value only).
   *
   * @see https://hive.apache.org/javadocs/r2.2.0/api/org/apache/hadoop/hive/ql/io/HiveIgnoreKeyTextOutputFormat.html
   */
  public static readonly HIVE_IGNORE_KEY_TEXT_OUTPUT_FORMAT = new OutputFormat('org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat');

  constructor(public readonly className: string) {}
}

/**
 * Serialization library to use when serializing/deserializing (SerDe) table records.
 *
 * @see https://cwiki.apache.org/confluence/display/Hive/SerDe
 */
export class SerializationLibrary {
  /**
   * @see https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-JSON
   */
  public static readonly HIVE_JSON = new SerializationLibrary('org.apache.hive.hcatalog.data.JsonSerDe');

  /**
   * @see https://github.com/rcongiu/Hive-JSON-Serde
   */
  public static readonly OPENX_JSON = new SerializationLibrary('org.openx.data.jsonserde.JsonSerDe');

  constructor(public readonly className: string) {}
}

/**
 * Defines the input/output formats and ser/de for a single DataFormat.
 */
export interface DataFormat {
  /**
   * `InputFormat` for this data format.
   */
  readonly inputFormat: InputFormat;

  /**
   * `OutputFormat` for this data format.
   */
  readonly outputFormat: OutputFormat;

  /**
   * Serialization library for this data format.
   */
  readonly serializationLibrary: SerializationLibrary;
}

export namespace DataFormat {
  /**
   * Stored as plain text files in JSON format.
   *
   * Uses OpenX Json SerDe for serialization and deseralization.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/json.html
   */
  export const Json: DataFormat = {
    inputFormat: InputFormat.TEXT_INPUT_FORMAT,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT_OUTPUT_FORMAT,
    serializationLibrary: SerializationLibrary.OPENX_JSON
  };
}