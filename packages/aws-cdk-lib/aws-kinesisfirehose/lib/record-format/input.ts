import * as core from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

export interface IInputFormat {
  render(): CfnDeliveryStream.InputFormatConfigurationProperty;
}

/**
 * Props for OpenX JSON input format for data record format conversion
 */
export interface OpenXJsonInputFormatProps {

  /**
   * Whether the JSON keys should be lowercased when written as column names
   *
   * @default true
   */
  readonly lowercaseColumnNames?: boolean;

  /**
   * Maps column names to JSON keys that aren't identical to the column names.
   * This is useful when the JSON contains keys that are Hive keywords.
   * For example, `timestamp` is a Hive keyword. If you have a JSON key named `timestamp`, set this parameter to `{"ts": "timestamp"}` to map this key to a column named `ts`
   *
   * @default JSON keys are not renamed
   */
  readonly columnToJsonKeyMappings?: Record<string, string>;

  /**
   * When set to `true`, specifies that the names of the keys include dots and that you want Firehose to replace them with underscores.
   * This is useful because Apache Hive does not allow dots in column names.
   * For example, if the JSON contains a key whose name is "a.b", you can define the column name to be "a_b" when using this option.
   *
   * @default false
   */
  readonly convertDotsInJsonKeysToUnderscores?: boolean;
}

/**
 * This class specifies properties for OpenX JSON input format for record format conversion.
 *
 * You should only need to specify an instance of this class if the default configuration does not suit your needs.
 */
export class OpenXJsonInputFormat implements IInputFormat {
  /**
   * Construct a new OpenX JSON input format specification for record format conversion
   */
  public constructor(readonly props?: OpenXJsonInputFormatProps) {}

  private createOpenXJsonSerde(): CfnDeliveryStream.OpenXJsonSerDeProperty {
    const props = this.props;
    return props ? {
      caseInsensitive: props.lowercaseColumnNames,
      columnToJsonKeyMappings: props.columnToJsonKeyMappings,
      convertDotsInJsonKeysToUnderscores: props.convertDotsInJsonKeysToUnderscores,
    } : {};
  }

  public render(): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        openXJsonSerDe: this.createOpenXJsonSerde(),
      },
    };
  }
}

/**
 * Value class that wraps a Joda Time format string.
 * Use this with the Hive JSON input format for data record format conversion to parse custom timestamp formats.
 */
export class TimestampParser {
  /**
   * Parses timestamps formatted in milliseconds since epoch.
   */
  public static readonly EPOCH_MILLIS = new TimestampParser('millis');
  /**
   * Default timestamp parser.
   *
   * You should specify this parser if you want to preserve the default timestamp parsing logic.
   */
  public static readonly DEFAULT = new TimestampParser('java.sql.Timestamp::valueOf');

  /**
   * Creates a TimestampParser from the given format string.
   *
   * The format string should be a valid Joda Time pattern string.
   * See [Class DateTimeFormat](https://docs.aws.amazon.com/https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html) for more details
   *
   * @param format the Joda Time format string
   */
  public static fromFormatString(format: string): TimestampParser {
    if (format === this.DEFAULT.format) {
      throw new core.UnscopedValidationError(`Cannot use reserved format string ${format} - Use 'TimestampParser.DEFAULT' instead`);
    }

    if (format === this.EPOCH_MILLIS.format) {
      throw new core.UnscopedValidationError(`Cannot use reserved format string ${format} - Use 'TimestampParser.EPOCH_MILLIS' instead`);
    }

    return new TimestampParser(format);
  }

  private constructor(readonly format: string) {}
}

/**
 * Props for Hive JSON input format for data record format conversion
 */
export interface HiveJsonInputFormatProps {

  /**
   * List of TimestampParsers.
   *
   * These are used to parse custom timestamp strings from your input JSON into dates.
   *
   * Note: Specifying a parser will override the default timestamp parser. If you require the default timestamp parser,
   *  include `TimestampParser.DEFAULT` in the list of parsers along with your custom parser.
   *
   * @default the default timestamp parser is used
   */
  readonly timestampParsers?: TimestampParser[];
}

/**
 * This class specifies properties for Hive JSON input format for record format conversion.
 *
 * You should only need to specify an instance of this class if the default configuration does not suit your needs.
 */
export class HiveJsonInputFormat implements IInputFormat {
  /**
   * Construct a new Hive JSON input format specification for record format conversion
   */
  public constructor(readonly props?: HiveJsonInputFormatProps) {}

  private createHiveJsonSerde(): CfnDeliveryStream.HiveJsonSerDeProperty {
    const props = this.props;
    return props ? {
      timestampFormats: props.timestampParsers?.map(parser => parser.format),
    } : {};
  }

  public render(): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        hiveJsonSerDe: this.createHiveJsonSerde(),
      },
    };
  }
}

/**
 * Represents possible input formats when perform record data conversion.
 *
 * You can choose to parse your input JSON with OpenX JSON specification or Hive JSON specification.
 */
export class InputFormat {
  /**
   * Parse your JSON with OpenX JSON specification. This will typically suffice.
   */
  public static readonly OPENX_JSON = new OpenXJsonInputFormat();

  /**
   * Parse your JSON with Hive JSON specification. Use this if you want to parse custom timestamps.
   */
  public static readonly HIVE_JSON = new HiveJsonInputFormat();

  private constructor() {}
}
