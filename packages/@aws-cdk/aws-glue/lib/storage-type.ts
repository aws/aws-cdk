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
  public static readonly TextInputFormat = new InputFormat('org.apache.hadoop.mapred.TextInputFormat');

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
  public static readonly HiveIgnoreKeyTextOutputFormat = new OutputFormat('org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat');

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
  public static readonly HiveJson = new SerializationLibrary('org.apache.hive.hcatalog.data.JsonSerDe');

  /**
   * @see https://github.com/rcongiu/Hive-JSON-Serde
   */
  public static readonly OpenXJson = new SerializationLibrary('org.openx.data.jsonserde.JsonSerDe');

  constructor(public readonly className: string) {}
}

/**
 * Defines the input/output formats and ser/de for a single StorageType.
 */
export interface StorageType {
  /**
   * `InputFormat` for this storage type.
   */
  inputFormat: InputFormat;

  /**
   * `OutputFormat` for this storage type.
   */
  outputFormat: OutputFormat;

  /**
   * Serialization library for this storage type.
   */
  serializationLibrary: SerializationLibrary;
}

export namespace StorageType {
  /**
   * Stored as plain text files in JSON format.
   *
   * Uses OpenX Json SerDe for serialization and deseralization.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/json.html
   */
  export const Json: StorageType = {
    inputFormat: InputFormat.TextInputFormat,
    outputFormat: OutputFormat.HiveIgnoreKeyTextOutputFormat,
    serializationLibrary: SerializationLibrary.OpenXJson
  };
}