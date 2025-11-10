import * as cdk from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

/**
 * An input format to be used in Firehose record format conversion.
 */
export interface IInputFormat {

  /**
   * Renders the cloudformation properties for the input format.
   */
  createInputFormatConfig(): CfnDeliveryStream.InputFormatConfigurationProperty;
}

/**
 * Props for OpenX JSON input format for data record format conversion
 */
export interface OpenXJsonInputFormatProps {

  /**
   * Whether the JSON keys should be lowercased when written as column names
   *
   * @default `true`
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
   * @default `false`
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
   * Properties for OpenX JSON input format
   */
  readonly props?: OpenXJsonInputFormatProps;

  public constructor(props?: OpenXJsonInputFormatProps) {
    this.props = props;
  }

  private createOpenXJsonSerde(): CfnDeliveryStream.OpenXJsonSerDeProperty {
    const props = this.props;
    return props ? {
      caseInsensitive: props.lowercaseColumnNames,
      columnToJsonKeyMappings: props.columnToJsonKeyMappings,
      convertDotsInJsonKeysToUnderscores: props.convertDotsInJsonKeysToUnderscores,
    } : {};
  }

  public createInputFormatConfig(): CfnDeliveryStream.InputFormatConfigurationProperty {
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
   * Creates a TimestampParser from the given format string.
   *
   * The format string should be a valid Joda Time pattern string.
   * See [Class DateTimeFormat](https://docs.aws.amazon.com/https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html) for more details
   *
   * @param format the Joda Time format string
   */
  public static fromFormatString(format: string): TimestampParser {
    if (format === this.EPOCH_MILLIS.format) {
      throw new cdk.UnscopedValidationError(`Cannot use reserved format string ${format} - Use 'TimestampParser.EPOCH_MILLIS' instead`);
    }

    if (format.trim() === '') {
      throw new cdk.UnscopedValidationError('Format string cannot be blank or empty');
    }

    return new TimestampParser(format);
  }

  /**
   * The format string to use in Hive JSON input format configuration.
   */
  public readonly format: string;

  private constructor(format: string) {
    this.format = format;
  }
}

/**
 * Props for Hive JSON input format for data record format conversion
 */
export interface HiveJsonInputFormatProps {

  /**
   * List of TimestampParsers.
   *
   * These are used to parse custom timestamp strings from input JSON into dates.
   *
   * Note: Specifying a parser will override the default timestamp parser. If the default timestamp parser is required,
   *  include `TimestampParser.DEFAULT` in the list of parsers along with the custom parser.
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
   * Properties for Hive JSON input format
   */
  readonly props?: HiveJsonInputFormatProps;

  public constructor(props?: HiveJsonInputFormatProps) {
    this.props = props;
  }

  private createHiveJsonSerde(): CfnDeliveryStream.HiveJsonSerDeProperty {
    const props = this.props;
    return props ? {
      timestampFormats: props.timestampParsers?.map(parser => parser.format),
    } : {};
  }

  public createInputFormatConfig(): CfnDeliveryStream.InputFormatConfigurationProperty {
    return {
      deserializer: {
        hiveJsonSerDe: this.createHiveJsonSerde(),
      },
    };
  }
}

/**
 * Represents possible input formats when performing record data conversion.
 */
export class InputFormat {
  /**
   * Parse input JSON with OpenX JSON specification. This will typically suffice.
   */
  public static readonly OPENX_JSON = new OpenXJsonInputFormat();

  /**
   * Parse input JSON with Hive JSON specification.
   */
  public static readonly HIVE_JSON = new HiveJsonInputFormat();

  private constructor() {}
}
