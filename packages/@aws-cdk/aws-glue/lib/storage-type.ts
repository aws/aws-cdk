/**
 * Absolute class name of the Hadoop `InputFormat` to use when reading table files.
 */
export enum InputFormat {
  /**
   * An InputFormat for plain text files. Files are broken into lines. Either linefeed or
   * carriage-return are used to signal end of line. Keys are the position in the file, and
   * values are the line of text.
   *
   * @see https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapred/TextInputFormat.html
   */
  TextInputFormat = 'org.apache.hadoop.mapred.TextInputFormat'
}

/**
 * Absolute class name of the Hadoop `OutputFormat` to use when writing table files.
 */
export enum OutputFormat {
  /**
   * Writes text data with a null key (value only).
   *
   * @see https://hive.apache.org/javadocs/r2.2.0/api/org/apache/hadoop/hive/ql/io/HiveIgnoreKeyTextOutputFormat.html
   */
  HiveIgnoreKeyTextOutputFormat = 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
}

/**
 * Serialization library to use when serializing/deserializing (SerDe) table records.
 *
 * @see https://cwiki.apache.org/confluence/display/Hive/SerDe
 */
export enum SerializationLibrary {
  /**
   * @see https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-JSON
   */
  HiveJson = 'org.apache.hive.hcatalog.data.JsonSerDe',

  /**
   * @see https://github.com/rcongiu/Hive-JSON-Serde
   */
  OpenXJson = 'org.openx.data.jsonserde.JsonSerDe'
}

/**
 * Defines the input/output formats and ser/de for a single StorageType.
 */
export interface StorageType {
  /**
   * `InputFormat` for this storage type.
   */
  inputFormat: string;

  /**
   * `OutputFormat` for this storage type.
   */
  outputFormat: string;

  /**
   * Serialization library for this storage type.
   */
  serializationLibrary: string;
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