/**
 * Absolute class name of the Hadoop `InputFormat` to use when reading table files.
 */
export class InputFormat {
  /**
   * InputFormat for Avro files.
   *
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerInputFormat.html
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
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/orc/OrcInputFormat.html
   */
  public static readonly ORC = new InputFormat('org.apache.hadoop.hive.ql.io.orc.OrcInputFormat');

  /**
   * InputFormat for Parquet files.
   *
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetInputFormat.html
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
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/HiveIgnoreKeyTextOutputFormat.html
   */
  public static readonly HIVE_IGNORE_KEY_TEXT = new OutputFormat('org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat');

  /**
   * OutputFormat for Avro files.
   *
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/avro/AvroContainerOutputFormat.html
   */
  public static readonly AVRO = new InputFormat('org.apache.hadoop.hive.ql.io.avro.AvroContainerOutputFormat');

  /**
   * OutputFormat for Orc files.
   *
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/orc/OrcOutputFormat.html
   */
  public static readonly ORC = new InputFormat('org.apache.hadoop.hive.ql.io.orc.OrcOutputFormat');

  /**
   * OutputFormat for Parquet files.
   *
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/parquet/MapredParquetOutputFormat.html
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
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/serde2/avro/AvroSerDe.html
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
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hive/hcatalog/data/JsonSerDe.html
   */
  public static readonly HIVE_JSON = new SerializationLibrary('org.apache.hive.hcatalog.data.JsonSerDe');

  /**
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/serde2/lazy/LazySimpleSerDe.html
   */
  public static readonly LAZY_SIMPLE = new SerializationLibrary('org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe');

  /**
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/serde2/OpenCSVSerde.html
   */
  public static readonly OPEN_CSV = new SerializationLibrary('org.apache.hadoop.hive.serde2.OpenCSVSerde');

  /**
   * @see https://github.com/rcongiu/Hive-JSON-Serde
   */
  public static readonly OPENX_JSON = new SerializationLibrary('org.openx.data.jsonserde.JsonSerDe');

  /**
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/orc/OrcSerde.html
   */
  public static readonly ORC = new SerializationLibrary('org.apache.hadoop.hive.ql.io.orc.OrcSerde');

  /**
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/ql/io/parquet/serde/ParquetHiveSerDe.html
   */
  public static readonly PARQUET = new SerializationLibrary('org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe');

  /**
   * @see https://svn.apache.org/repos/infra/websites/production/hive/content/javadocs/r3.1.3/api/org/apache/hadoop/hive/serde2/RegexSerDe.html
   */
  public static readonly REGEXP = new SerializationLibrary('org.apache.hadoop.hive.serde2.RegexSerDe');

  constructor(public readonly className: string) {}
}

/**
 * Classification string given to tables with this data format.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/add-classifier.html#classifier-built-in
 */
export class ClassificationString {
  /**
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-avro
   */
  public static readonly AVRO = new ClassificationString('avro');

  /**
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-csv
   */
  public static readonly CSV = new ClassificationString('csv');

  /**
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-json
   */
  public static readonly JSON = new ClassificationString('json');

  /**
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-xml
   */
  public static readonly XML = new ClassificationString('xml');

  /**
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-parquet
   */
  public static readonly PARQUET = new ClassificationString('parquet');

  /**
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-format.html#aws-glue-programming-etl-format-orc
   */
  public static readonly ORC = new ClassificationString('orc');

  constructor(public readonly value: string) {}
}


/**
 * Properties of a DataFormat instance.
 */
export interface DataFormatProps {
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

  /**
   * Classification string given to tables with this data format.
   *
   * @default - No classification is specified.
   */
  readonly classificationString?: ClassificationString;

  /**
   * Additional serialization parameters
   *
   * @default No dataFormat parameters are specified
   */
  readonly serDeProperties?: { [key: string]: string };

  /**
   * Additional table level serialization parameters
   *
   * @default No dataFormat parameters are specified
   */
  readonly tableSerDeProperties?: { [key: string]: string };
}

/**
 * Compression type Parquet SerDe
 */
export class ParquetSerDeOptionCompress {
  /**
   * No compression
   */
  public static readonly NONE = new ParquetSerDeOptionCompress('none');
  /**
   * uncompressed
   */
  public static readonly UNCOMPRESSED = new ParquetSerDeOptionCompress('uncompressed');
  /**
   * Snappy compression
   */
  public static readonly SNAPPY = new ParquetSerDeOptionCompress('snappy');
  /**
   * Gzip compression
   */
  public static readonly GZIP = new ParquetSerDeOptionCompress('gzip');
  /**
   * Lzo compression
   */
  public static readonly LZO = new ParquetSerDeOptionCompress('lzo');
  /**
   * Brotli compression
   */
  public static readonly BROTLI = new ParquetSerDeOptionCompress('brotli');
  /**
   * Lz4 compression
   */
  public static readonly LZ4 = new ParquetSerDeOptionCompress('lz4');
  /**
   * Zstd compression
   */
  public static readonly ZSTD = new ParquetSerDeOptionCompress('zstd');

  /**
   * Create Compression type
   * @param compression Compression algorithm identifier
   */
  constructor(public readonly compression: string) {}
}

/**
 * Parameters for Parquet SerDe
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/parquet-serde.html
 */
export interface ParquetSerDeOptions {
  /**
   * Define if data is compressed
   *
   * @default ParquetSerDeOptionCompress.NONE
   */
  readonly compression?: ParquetSerDeOptionCompress
}

/**
 * Compression type for Orc serDe
 */
export class OrcSerDeOptionCompress {
  /**
   * No compression
   */
  public static readonly NONE = new OrcSerDeOptionCompress('NONE');
  /**
   * Zlib compression
   */
  public static readonly ZLIB = new OrcSerDeOptionCompress('ZLIB');
  /**
   * Snappy compression
   */
  public static readonly SNAPPY = new OrcSerDeOptionCompress('SNAPPY');

  /**
   * Create Compression type
   * @param compression Compression algorithm identifier
   */
  constructor(public readonly compression: string) {}
}
/**
 * Parameters for Orc serDe
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/orc-serde.html
 */
export interface OrcSerDeOptions {
  /**
   * Define if data is compressed
   *
   * @default GrokSerDeOptionCompress.NONE
   */
  readonly compression?: OrcSerDeOptionCompress;
}

/**
 * Parameters for Grok serDe
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/grok-serde.html
 */
export interface GrokSerDeOptions {
  /**
   * Defines the patterns to match in the data.
   */
  readonly format: string;
  /**
   * Defines a named custom pattern, which you can subsequently use within the format expression.
   *
   * @default No customPattern
   */
  readonly customPattern?: { [key: string]: string };
}

/**
 * Parameters for Avro serDe
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/avro-serde.html
 */
export interface AvroSerDeOptions {
  /**
   * Specify table schema
   * @remarks Athena does not support using avro.schema.url to  for security reasons.
   */
  readonly schema: object
}

/**
 * Parameters for Open CSV serDe
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/csv-serde.html
 */
export interface OpenXCsvSerDeOptions {
  /**
   * Separator character
   * @default `,`
   */
  readonly separatorChar?: string;
  /**
   * Quote character
   * @default `"`
   */
  readonly quoteChar?: string;
  /**
   * Escape character
   * @default `\`
   */
  readonly escapeChar?: string;
  /**
   * To ignore headers in your data when you define a table
   * @default don't skip
   */
  readonly skipHeaderLineCount?: number;
}

/**
 * Parameters for LazySimple CSV serDe
 * @remarks
 * This SerDe is used if you don't specify any SerDe and only specify ROW FORMAT DELIMITED.
 * Use this SerDe if your data does not have values enclosed in quotes.
 * @see https://docs.aws.amazon.com/athena/latest/ug/lazy-simple-serde.html
 */
export interface LazySimpleCsvSerDeOptions {
  /**
   * To ignore headers in your data when you define a table
   * @default don't skip
   */
  readonly skipHeaderLineCount?: number;

  /**
   * the escape character
   *
   */
  readonly escapeDelimiter: string;

  /**
   * the field delimiter
   */
  readonly fieldDelimiter: string;

  /**
   * the line separator
   */
  readonly lineDelimiter: string;

  /**
   * separator char columns:
   * ","-separated column names columns.types: ",", ":", or ";"-separated column types
   *
   * @default ','
   */
  readonly serializationFormat?: string;
}

/**
 * Parameters for OpenX Json serDe
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/openx-json-serde.html
 */
export interface JsonSerDeOptions {
  /**
   * When set to TRUE, lets you skip malformed JSON syntax.
   * @default false
   */
  readonly ignoreMalformedJson?: boolean;
  /**
   * When set to TRUE, allows the SerDe to replace the dots in key names with underscores. For example, if the JSON dataset contains a key with the name "a.b", you can use this property to define the column name to be "a_b" in Athena. By default (without this SerDe), Athena does not allow dots in column names.
   *
   * @default false
   */
  readonly dotsInKeys?: boolean;
  /**
   * Optional. When set to TRUE, the SerDe converts all uppercase columns to lowercase.
   *
   * @remarks
   * To use case-sensitive key names in your data, use caseInsensitive: false.
   * Then, for every key that is not already all lowercase, provide a mapping from the column name to the property name using the following syntax:
   * @code
   * {
   *   caseInsensitive: false,
   *   mappings: {
   *     userid: 'userId',
   *   },
   * }
   * @remarks
   * If you have two keys like URL and Url that are the same when they are in lowercase, an error like the following can occur:
   * HIVE_CURSOR_ERROR: Row is not a valid JSON Object - JSONException: Duplicate key "url"
   *
   * To resolve this, set the caseInsensitive property to FALSE and map the keys to different names, as in the following example:
   * @code
   * {
   *   caseInsensitive: false,
   *   mappings: {
   *     url1: 'URL',
   *     url2: 'Url',
   *   },
   * }
   *
   * @default true
   */
  readonly caseInsensitive?: boolean;
  /**
   * Optional. Maps column names to JSON keys that aren't identical to the column names.
   *
   * @remarks
   * The mapping parameter is useful when the JSON data contains keys that are keywords. For example, if you have a JSON key named timestamp, use the following syntax to map the key to a column named ts:
   *
   * @code
   * {
   *   caseInsensitive: false,
   *   mappings: {
   *     ts: 'timestamp',
   *   },
   * }
   *
   * @remarks
   * Like the Hive JSON SerDe, the OpenX JSON SerDe does not allow duplicate keys in map or struct key names.
   *
   * @default empty
   */
  readonly mappings?: { [key: string]: string };
}


/**
 * Defines the input/output formats and ser/de for a single DataFormat.
 */
export class DataFormat {

  /**
   * DataFormat for Apache Web Server Logs. Also works for CloudFront logs
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/apache.html
   */
  public static apacheLogs(): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.TEXT,
      outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
      serializationLibrary: SerializationLibrary.REGEXP,
    });
  }

  /**
   * DataFormat for Apache Avro
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/avro.html
   */
  public static avro(options?: AvroSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.AVRO,
      outputFormat: OutputFormat.AVRO,
      serializationLibrary: SerializationLibrary.AVRO,
      classificationString: ClassificationString.AVRO,
      ...(options && {
        serDeProperties: {
          ...(options.schema && { 'avro.schema.literal': JSON.stringify(options.schema) }),
        },
      }),
    });
  }


  /**
   * DataFormat for CloudTrail logs stored on S3
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/cloudtrail.html
   */
  public static cloudtrailsLogs(): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.CLOUDTRAIL,
      outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
      serializationLibrary: SerializationLibrary.CLOUDTRAIL,
    });
  }

  /**
   * DataFormat for CSV Files
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/csv.html
   */
  public static csv(options?: OpenXCsvSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.TEXT,
      outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
      serializationLibrary: SerializationLibrary.OPEN_CSV,
      classificationString: ClassificationString.CSV,
      ...(options && (options.separatorChar || options.quoteChar || options.escapeChar) && {
        serDeProperties: {
          ...(options.separatorChar && { separatorChar: options.separatorChar }),
          ...(options.quoteChar && { quoteChar: options.quoteChar }),
          ...(options.escapeChar && { escapeChar: options.escapeChar }),
        },
      }),
      ...(options && typeof (options?.skipHeaderLineCount) !== undefined
        && {
          tableSerDeProperties: {
            'skip.header.line.count': `${options.skipHeaderLineCount}`,
          },
        }
      ),
    });
  }

  /**
   * Stored as plain text files in JSON format.
   * Uses OpenX Json SerDe for serialization and deseralization.
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/json.html
   */
  public static json(options?: JsonSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.TEXT,
      outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
      serializationLibrary: SerializationLibrary.OPENX_JSON,
      classificationString: ClassificationString.JSON,
      ...(options && {
        serDeProperties: {
          ...(typeof (options.ignoreMalformedJson) !== 'undefined' && { 'ignore.malformed.json': `${options.ignoreMalformedJson}` }),
          ...(typeof (options.dotsInKeys) !== 'undefined' && { 'dots.in.keys': `${options.dotsInKeys}` }),
          ...(typeof (options.caseInsensitive) !== 'undefined' && { 'case.insensitive': `${options.caseInsensitive}` }),
          ...(options.mappings
            && Object.entries(options?.mappings)
              .reduce((p, [key, value]) => ({ ...p, [`mapping.${key}`]: value }), {})),
        },
      }),
    });
  }

  /**
   * DataFormat for Logstash Logs, using the GROK SerDe
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/grok.html
   */
  public static logstash(options: GrokSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.TEXT,
      outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
      serializationLibrary: SerializationLibrary.GROK,
      serDeProperties: {
        'input.format': options.format,
        ...(options.customPattern
          && Object.entries(options.customPattern).length > 0
          && {
            'input.grokCustomPatterns':
              Object.entries(options.customPattern).map(([key, value]) => `${key} ${value}`).join('\n'),
          }),
      },
    });
  }

  /**
   * DataFormat for Apache ORC (Optimized Row Columnar)
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/orc.html
   */
  public static orc(options?: OrcSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.ORC,
      outputFormat: OutputFormat.ORC,
      serializationLibrary: SerializationLibrary.ORC,
      classificationString: ClassificationString.ORC,

      ...(options && options.compression && {
        tableSerDeProperties: {
          ...(options.compression && { 'orc.compress': options.compression.compression }),
        },
      }),
    });
  }

  /**
   * DataFormat for Apache Parquet
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/parquet.html
   */
  public static parquet(options?: ParquetSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.PARQUET,
      outputFormat: OutputFormat.PARQUET,
      serializationLibrary: SerializationLibrary.PARQUET,
      classificationString: ClassificationString.PARQUET,
      //only table level serde parameters
      ...(options && options.compression && {
        tableSerDeProperties: {
          'parquet.compression': options.compression.compression,
        },
      }),
    });
  }

  /**
   * DataFormat for TSV (Tab-Separated Values)
   *
   * @see https://docs.aws.amazon.com/athena/latest/ug/lazy-simple-serde.html
   */
  public static tsv(options: LazySimpleCsvSerDeOptions): DataFormat {
    return new DataFormat({
      inputFormat: InputFormat.TEXT,
      outputFormat: OutputFormat.HIVE_IGNORE_KEY_TEXT,
      serializationLibrary: SerializationLibrary.LAZY_SIMPLE,
      ...(typeof (options?.skipHeaderLineCount) !== undefined
        && {
          tableSerDeProperties: {
            'skip.header.line.count': `${options.skipHeaderLineCount}`,
          },
        }
      ),
      serDeProperties: {
        'escape.delim': options.escapeDelimiter,
        'field.delim': options.fieldDelimiter,
        'line.delim': options.lineDelimiter,
        'serialization.format': options.serializationFormat ?? ',',
      },
    });
  }

  /**
   * `InputFormat` for this data format.
   */
  public readonly inputFormat: InputFormat;

  /**
   * `OutputFormat` for this data format.
   */
  public readonly outputFormat: OutputFormat;

  /**
   * Serialization library for this data format.
   */
  public readonly serializationLibrary: SerializationLibrary;

  /**
   * Additional serialization parameters
   */
  public readonly serDeProperties?: { [key: string]: string };
  /**
   * Additional table level serialization parameters
   */
  public readonly tableSerDeProperties?: { [key: string]: string };

  /**
   * Classification string given to tables with this data format.
   */
  public readonly classificationString?: ClassificationString;

  public constructor(props: DataFormatProps) {
    this.inputFormat = props.inputFormat;
    this.outputFormat = props.outputFormat;
    this.serializationLibrary = props.serializationLibrary;
    this.classificationString = props.classificationString;
    this.serDeProperties = props.serDeProperties;
    this.tableSerDeProperties = props.tableSerDeProperties;
  }
}
