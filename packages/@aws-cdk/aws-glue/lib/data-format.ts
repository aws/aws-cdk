/**
 * Absolute class name of the Hadoop `InputFormat` to use when reading table files.
 */
export class InputFormat {
  /**
   * InputFormat for Avro files.
   *
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerInputFormat.html
   */
  public static readonly AVRO = new InputFormat('org.apache.hadoop.hive.ql.io.avro.AvroContainerInputFormat');

  /**
   * InputFormat for Cloudtrail Logs.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html
   */
  public static readonly CLOUDTRAIL = new InputFormat('com.amazon.emr.cloudtrail.CloudTrailInputFormat');

  /**
   * InputFormat for Orc files.
   *
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcInputFormat.html
   */
  public static readonly ORC = new InputFormat('org.apache.hadoop.hive.ql.io.orc.OrcInputFormat');

  /**
   * InputFormat for Parquet files.
   *
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetInputFormat.html
   */
  public static readonly PARQUET = new InputFormat('org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat');

  /**
   * An InputFormat for plain text files. Files are broken into lines. Either linefeed or
   * carriage-return are used to signal end of line. Keys are the position in the file, and
   * values are the line of text.
   * JSON & CSV files are examples of this InputFormat
   *
   * @see https://hadoop.apache.org/docs/stable/api/org/apache/hadoop/mapred/TextInputFormat.html
   */
  public static readonly TEXT = new InputFormat('org.apache.hadoop.mapred.TextInputFormat');

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
  public static readonly HIVE_IGNORE_KEY_TEXT = new OutputFormat('org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat');

  /**
   * OutputFormat for Avro files.
   *
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerOutputFormat.html
   */
  public static readonly AVRO = new InputFormat('org.apache.hadoop.hive.ql.io.avro.AvroContainerOutputFormat');

  /**
   * OutputFormat for Orc files.
   *
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcOutputFormat.html
   */
  public static readonly ORC = new InputFormat('org.apache.hadoop.hive.ql.io.orc.OrcOutputFormat');

  /**
   * OutputFormat for Parquet files.
   *
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetOutputFormat.html
   */
  public static readonly PARQUET = new OutputFormat('org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat');

  constructor(public readonly className: string) {}
}

/**
 * Serialization library to use when serializing/deserializing (SerDe) table records.
 *
 * @see https://cwiki.apache.org/confluence/display/Hive/SerDe
 */
export class SerializationLibrary {
  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/avro/AvroSerDe.html
   */
  public static readonly AVRO = new SerializationLibrary('org.apache.hadoop.hive.serde2.avro.AvroSerDe');

  /**
   * @see https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html
   */
  public static readonly CLOUDTRAIL = new SerializationLibrary('com.amazon.emr.hive.serde.CloudTrailSerde');

  /**
   * @see https://docs.aws.amazon.com/athena/latest/ug/grok.html
   */
  public static readonly GROK = new SerializationLibrary('com.amazonaws.glue.serde.GrokSerDe');

  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hive/hcatalog/data/JsonSerDe.html
   */
  public static readonly HIVE_JSON = new SerializationLibrary('org.apache.hive.hcatalog.data.JsonSerDe');

  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/lazy/LazySimpleSerDe.html
   */
  public static readonly LAZY_SIMPLE = new SerializationLibrary('org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe');

  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/OpenCSVSerde.html
   */
  public static readonly OPEN_CSV = new SerializationLibrary('org.apache.hadoop.hive.serde2.OpenCSVSerde');

  /**
   * @see https://github.com/rcongiu/Hive-JSON-Serde
   */
  public static readonly OPENX_JSON = new SerializationLibrary('org.openx.data.jsonserde.JsonSerDe');

  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcSerde.html
   */
  public static readonly ORC = new SerializationLibrary('org.apache.hadoop.hive.ql.io.orc.OrcSerde');

  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/serde/ParquetHiveSerDe.html
   */
  public static readonly PARQUET = new SerializationLibrary('org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe');

  /**
   * @see https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/serde2/RegexSerDe.html
   */
  public static readonly REGEXP = new SerializationLibrary('org.apache.hadoop.hive.serde2.RegexSerDe');

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
   * DataFormat for Apache Web Server Logs. Also works for CloudFront logs
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/apache.html
   */
  export const ApacheLogs: DataFormat = {
    inputFormat: InputFormat.TEXT,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
    serializationLibrary: SerializationLibrary.REGEXP
  };

  /**
   * DataFormat for Apache Avro
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/avro.html
   */
  export const Avro: DataFormat = {
    inputFormat: InputFormat.AVRO,
    outputFormat: OutputFormat.AVRO,
    serializationLibrary: SerializationLibrary.AVRO
  };

  /**
   * DataFormat for CloudTrail logs stored on S3
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html
   */
  export const CloudTrailLogs: DataFormat = {
    inputFormat: InputFormat.CLOUDTRAIL,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
    serializationLibrary: SerializationLibrary.CLOUDTRAIL
  };

  /**
   * DataFormat for CSV Files
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/csv.html
   */
  export const CSV: DataFormat = {
    inputFormat: InputFormat.TEXT,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
    serializationLibrary: SerializationLibrary.OPEN_CSV
  };

  /**
   * Stored as plain text files in JSON format.
   * Uses OpenX Json SerDe for serialization and deseralization.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/json.html
   */
  export const Json: DataFormat = {
    inputFormat: InputFormat.TEXT,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
    serializationLibrary: SerializationLibrary.OPENX_JSON
  };

  /**
   * DataFormat for Logstash Logs, using the GROK SerDe
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/grok.html
   */
  export const Logstash: DataFormat = {
    inputFormat: InputFormat.TEXT,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
    serializationLibrary: SerializationLibrary.GROK
  };

  /**
   * DataFormat for Apache ORC (Optimized Row Columnar)
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/orc.html
   */
  export const Orc: DataFormat = {
    inputFormat: InputFormat.ORC,
    outputFormat: OutputFormat.ORC,
    serializationLibrary: SerializationLibrary.ORC
  };

  /**
   * DataFormat for Apache Parquet
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/parquet.html
   */
  export const Parquet: DataFormat = {
    inputFormat: InputFormat.PARQUET,
    outputFormat: OutputFormat.PARQUET,
    serializationLibrary: SerializationLibrary.PARQUET
  };

  /**
   * DataFormat for TSV (Tab-Separated Values)
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/lazy-simple-serde.html
   */
  export const TSV: DataFormat = {
    inputFormat: InputFormat.TEXT,
    outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
    serializationLibrary: SerializationLibrary.LAZY_SIMPLE
  };
}
