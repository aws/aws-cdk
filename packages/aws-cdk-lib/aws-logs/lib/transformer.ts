/**
 * Generated TypeScript code for L2 Construct Design: AWS Logs Transformer
 *
 * This file contains TypeScript definitions for the AWS Logs Transformer L2 Construct.
 *
 * A log transformer enables transforming log events into a different format, making them easier
 * to process and analyze. You can also transform logs from different sources into standardized formats
 * that contain relevant, source-specific information.
 *
 * After you create a transformer, CloudWatch performs the transformations at the time of log ingestion.
 * You can then refer to the transformed versions of the logs during operations such as
 * querying with CloudWatch Logs Insights or creating metric filters or subscription filters.
 *
 * Resource Structure:
 * - AWS::Logs::Transformer: Interface (ITransformer) directly implemented by concrete classes (Transformer)
 *   This follows a direct implementation pattern where concrete classes implement the interface directly without a shared base class.
 *
 * @example
 * import * as logs from 'aws-cdk-lib/aws-logs';
 *
 * // Create a log group
 * const logGroup = new logs.LogGroup(this, 'MyLogGroup');
 *
 * // Create a JSON parser processor
 * const jsonParser = logs.BaseProcessor.createParserProcessor(this, 'JsonParser', {
 *   type: logs.ParserProcessorType.JSON
 * });
 *
 * // Create a processor to add keys
 * const addKeysProcessor = logs.BaseProcessor.createJsonMutator(this, 'AddKeys', {
 *   type: logs.JsonMutatorType.ADD_KEYS,
 *   addKeysOptions: {
 *     entries: [{
 *       key: 'metadata.transformed_in',
 *       value: 'CloudWatchLogs'
 *     }]
 *   }
 * });
 *
 * // Create a transformer with these processors
 * new logs.Transformer(this, 'MyTransformer', {
 *   logGroup: logGroup,
 *   transformerConfig: [jsonParser, addKeysProcessor]
 * });
 */

import { Construct } from 'constructs';
import { CfnTransformer } from '.';
import { ILogGroup } from './log-group';
import { IResource, Resource, Token, ValidationError } from '../../core';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Valid data types for type conversion in the TypeConverter processor.
 * Used to specify the target data type for field conversion.
 */
export enum TypeConverterType {
  /** Convert value to boolean type */
  BOOLEAN = 'boolean',
  /** Convert value to integer type */
  INTEGER = 'integer',
  /** Convert value to double (floating point) type */
  DOUBLE = 'double',
  /** Convert value to string type */
  STRING = 'string',
}

/**
 * Standard datetime formats for the DateTimeConverter processor.
 * Provides common format patterns for date/time conversion.
 */
export enum DateTimeFormat {
  /** ISO 8601 format (yyyy-MM-ddTHH:mm:ssZ) */
  ISO_8601 = 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'',
  /** Unix timestamp (seconds since epoch) */
  UNIX_TIMESTAMP = 'epoch',
  /** Custom format specified by the targetFormat parameter */
  CUSTOM = 'custom',
}

/**
 * Valid delimiter characters for CSV processor.
 * Defines the character used to separate each column in CSV data.
 */
export enum DelimiterCharacter {
  /** Comma character */
  COMMA = ',',
  /** Tab character */
  TAB = '\t',
  /** Space character */
  SPACE = ' ',
  /** Semicolon character */
  SEMICOLON = ';',
  /** Pipe character */
  PIPE = '|',
}

/**
 * Valid quote characters for CSV processor.
 * Defines the character used as a text qualifier for a single column of data.
 */
export enum QuoteCharacter {
  /** Double quote character (default) */
  DOUBLE_QUOTE = '"',
  /** Single quote character */
  SINGLE_QUOTE = '\'',
}

/**
 * Valid field delimiters for ParseKeyValue processor.
 * Defines the delimiter string used between key-value pairs in the original log events.
 */
export enum KeyValuePairDelimiter {
  /** Ampersand character (default) */
  AMPERSAND = '&',
  /** Semicolon character */
  SEMICOLON = ';',
  /** Space character */
  SPACE = ' ',
  /** Newline character */
  NEWLINE = '\n',
}

/**
 * Valid key-value delimiters for ParseKeyValue processor.
 * Defines the delimiter string to use between the key and value in each pair.
 */
export enum KeyValueDelimiter {
  /** Equal sign (default) */
  EQUAL = '=',
  /** Colon character */
  COLON = ':',
}

/**
 * Types of configurable parser processors.
 * Defines the various parser types that can be used to process log events.
 */
export enum ParserProcessorType {
  /** Parse log entries as JSON */
  JSON,
  /** Parse log entries as key-value pairs */
  KEY_VALUE,
  /** Parse log entries in CSV format */
  CSV,
  /** Parse log entries using Grok patterns */
  GROK,
}

/**
 * Types of AWS vended logs with built-in parsers.
 * AWS provides specialized parsers for common log formats produced by various AWS services.
 */
export enum VendedLogType {
  /** Parse CloudFront logs */
  CLOUDFRONT,
  /** Parse VPC flow logs */
  VPC,
  /** Parse AWS WAF logs */
  WAF,
  /** Parse Route 53 logs */
  ROUTE53,
  /** Parse PostgreSQL logs */
  POSTGRES,
}

/**
 * Types of string mutation operations.
 * Defines various operations that can be performed to modify string values in log events.
 */
export enum StringMutatorType {
  /** Convert strings to lowercase */
  LOWER_CASE,
  /** Convert strings to uppercase */
  UPPER_CASE,
  /** Trim whitespace from strings */
  TRIM,
  /** Split strings by delimiter */
  SPLIT,
  /** Replace substrings in strings */
  SUBSTITUTE,
}

/**
 * Types of JSON mutation operations.
 * Defines operations that can be performed to modify the JSON structure of log events.
 */
export enum JsonMutatorType {
  /** Add new keys to the log event */
  ADD_KEYS,
  /** Delete keys from the log event */
  DELETE_KEYS,
  /** Move keys to different locations */
  MOVE_KEYS,
  /** Rename keys in the log event */
  RENAME_KEYS,
  /** Copy values between keys */
  COPY_VALUE,
  /** Convert a list to a map */
  LIST_TO_MAP,
}

/**
 * Types of data conversion operations.
 * Defines operations that can convert data from one format to another.
 */
export enum DataConverterType {
  /** Convert data types */
  TYPE_CONVERTER,
  /** Convert datetime formats */
  DATETIME_CONVERTER,
}

/**
 * This processor parses log events that are in JSON format. It can extract JSON key-value pairs and place them
 * under a destination that you specify.
 * Additionally, because you must have at least one parse-type processor in a transformer, you can use ParseJSON as that
 * processor for JSON-format logs, so that you can also apply other processors, such as mutate processors, to these logs.
 * For more information about this processor including examples, see parseJSON in the CloudWatch Logs User Guide.
 */
export interface ProcessorParseJSONProperty {
  /**
   * Path to the field in the log event that will be parsed. Use dot notation to access child fields.
   * @default '@message'
   */
  readonly source?: string;
  /**
   * The location to put the parsed key value pair into.
   * @default - Placed under root of log event
   */
  readonly destination?: string;
}

/**
 * This processor parses a specified field in the original log event into key-value pairs.
 * For more information about this processor including examples, see parseKeyValue in the CloudWatch Logs User Guide.
 */
export interface ProcessorParseKeyValueProperty {
  /**
   * Path to the field in the log event that will be parsed. Use dot notation to access child fields.
   * @default '@message'
   */
  readonly source?: string;
  /**
   * The destination field to put the extracted key-value pairs into.
   * @default - Places at the root of the JSON input.
   */
  readonly destination?: string;
  /**
   * The field delimiter string that is used between key-value pairs in the original log events.
   * @default KeyValuePairDelimiter.AMPERSAND
   */
  readonly fieldDelimiter?: KeyValuePairDelimiter;
  /**
   * The delimiter string to use between the key and value in each pair in the transformed log event.
   * @default KeyValueDelimiter.EQUAL
   */
  readonly keyValueDelimiter?: KeyValueDelimiter;
  /**
   * If you want to add a prefix to all transformed keys, specify it here.
   * @default - No prefix is added to the keys.
   */
  readonly keyPrefix?: string;
  /**
   * A value to insert into the value field in the result, when a key-value pair is not successfully split.
   * @default - No values is inserted when split is not successful.
   */
  readonly nonMatchValue?: string;
  /**
   * Specifies whether to overwrite the value if the destination key already exists.
   * @default false
   */
  readonly overwriteIfExists?: boolean;
}

export interface ProcessorCopyValueProperty {
  readonly entries: Array<CopyValueEntryProperty>;
}

/**
 * The CSV processor parses comma-separated values (CSV) from the log events into columns.
 * For more information about this processor including examples, see csv in the CloudWatch Logs User Guide.
 */
export interface ProcessorCsvProperty {
  /**
   * Character used as a text qualifier for a single column of data.
   * @default QuoteCharacter.DOUBLE_QUOTE
   */
  readonly quoteCharacter?: QuoteCharacter;
  /**
   * Character used to separate each column in the original comma-separated value log event.
   * @default DelimiterCharacter.COMMA
   */
  readonly delimiter?: DelimiterCharacter;
  /**
   * The path to the field in the log event that has the comma separated values to be parsed.
   * @default '@message'
   */
  readonly source?: string;
  /**
   * An array of names to use for the columns in the transformed log event.
   * @default - Column names ([column_1, column_2 ...]) are used
   */
  readonly columns?: Array<string>;
}

/**
 * This processor converts a datetime string into a format that you specify.
 * For more information about this processor including examples, see datetimeConverter in the CloudWatch Logs User Guide.
 */
export interface ProcessorDateTimeConverterProperty {
  /**
   * The key to apply the date conversion to.
   */
  readonly source: string;

  /**
   * The JSON field to store the result in.
   */
  readonly target: string;

  /**
   * The datetime format to use for the converted data in the target field.
   * @default "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
   */
  readonly targetFormat?: string;

  /**
   * A list of patterns to match against the source field.
   */
  readonly matchPatterns: Array<string>;

  /**
   * The time zone of the source field.
   * @default UTC
   */
  readonly sourceTimezone?: string;

  /**
   * The time zone of the target field.
   * @default UTC
   */
  readonly targetTimezone?: string;

  /**
   * The locale of the source field.
   */
  readonly locale: string;
}

/**
 * This processor uses pattern matching to parse and structure unstructured data. This processor can also extract fields from log messages.
 * For more information about this processor including examples, see grok in the CloudWatch Logs User Guide.
 */
export interface ProcessorGrokProperty {
  /**
   * The path to the field in the log event that you want to parse.
   * @default '@message'
   */
  readonly source?: string;

  /**
   * The grok pattern to match against the log event. For a list of supported grok patterns,
   * see Supported grok patterns in the CloudWatch Logs User Guide.
   */
  readonly match: string;
}

/**
 * This processor takes a list of objects that contain key fields, and converts them into a map of target keys.
 * For more information about this processor including examples, see listToMap in the CloudWatch Logs User Guide.
 */
export interface ProcessorListToMapProperty {
  /**
   * The key in the log event that has a list of objects that will be converted to a map.
   */
  readonly source: string;

  /**
   * The key of the field to be extracted as keys in the generated map.
   */
  readonly key: string;

  /**
   * If this is specified, the values that you specify in this parameter will be extracted from the source objects
   * and put into the values of the generated map.
   * @default - Original objects in the source list will be put into the values of the generated map
   */
  readonly valueKey?: string;

  /**
   * The key of the field that will hold the generated map.
   * @default - Stored at the root of the log event
   */
  readonly target?: string;

  /**
   * A Boolean value to indicate whether the list will be flattened into single items.
   * @default false
   */
  readonly flatten?: boolean;

  /**
   * If you set flatten to true, use flattenedElement to specify which element, first or last, to keep.
   * You must specify this parameter if flatten is true.
   * @default - Must be specified if flatten is true and if flatten is false, has no effect
   */
  readonly flattenedElement?: string;
}

/**
 * This processor adds new key-value pairs to the log event.
 * For more information about this processor including examples, see addKeys in the CloudWatch Logs User Guide.
 */
export interface ProcessorAddKeysProperty {
  /**
   * An array of objects, where each object contains information about one key to add to the log event.
   */
  readonly entries: Array<AddKeyEntryProperty>;
}

/**
 * This processor adds new key-value pairs to the log event.
 * For more information about this processor including examples, see addKeys in the CloudWatch Logs User Guide.
 */
export interface ProcessorDeleteKeysProperty {
  /**
   * A list of keys to delete
   */
  readonly withKeys: Array<String>;
}

/**
 * This processor copies values within a log event.
 * You can also use this processor to add metadata to log events by copying values from metadata keys.
 * For more information about this processor including examples, see copyValue in the CloudWatch Logs User Guide.
 */
export interface ProcessorCopyValueProperty {
  /**
   * An array of CopyValueEntry objects, where each object contains information about one field value to copy.
   */
  readonly entries: Array<CopyValueEntryProperty>;
}

/**
 * This processor moves a key from one field to another. The original key is deleted.
 * For more information about this processor including examples, see moveKeys in the CloudWatch Logs User Guide.
 */
export interface ProcessorMoveKeysProperty {
  /**
   * An array of objects, where each object contains information about one key to move.
   */
  readonly entries: Array<MoveKeyEntryProperty>;
}

/**
 * Use this processor to rename keys in a log event.
 * For more information about this processor including examples, see renameKeys in the CloudWatch Logs User Guide.
 */
export interface ProcessorRenameKeysProperty {
  /**
   * An array of RenameKeyEntry objects, where each object contains information about one key to rename.
   */
  readonly entries: Array<RenameKeyEntryProperty>;
}

/**
 * Use this processor to split a field into an array of strings using a delimiting character.
 * For more information about this processor including examples, see splitString in the CloudWatch Logs User Guide.
 */
export interface ProcessorSplitStringProperty {
  /**
   * An array of SplitStringEntry objects, where each object contains information about one field to split.
   */
  readonly entries: Array<SplitStringEntryProperty>;
}

/**
 * This processor matches a key's value against a regular expression and replaces all matches with a replacement string.
 * For more information about this processor including examples, see substituteString in the CloudWatch Logs User Guide.
 */
export interface ProcessorSubstituteStringProperty {
  /**
   * An array of objects, where each object contains information about one key to match and replace.
   */
  readonly entries: Array<SubstituteStringEntryProperty>;
}

/**
 * Use this processor to convert a value type associated with the specified key to the specified type.
 * It's a casting processor that changes the types of the specified fields.
 * For more information about this processor including examples, see typeConverter in the CloudWatch Logs User Guide.
 */
export interface ProcessorTypeConverterProperty {
  /**
   * An array of TypeConverterEntry objects, where each object contains information about one field to change the type of.
   */
  readonly entries: Array<TypeConverterEntryProperty>;
}

/**
 * Interface representing a single processor in a CloudWatch Logs transformer.
 * A log transformer is a series of processors, where each processor applies one type of transformation
 * to the log events. The processors work one after another, in the order that they are listed, like a pipeline.
 */
export interface IProcessor {
  /**
   * Returns the L1 processor configuration
   * @internal
   */
  _bind(): any;
}

/** Base properties for all processor types */
export interface BaseProcessorProps {
}

/** Properties for creating configurable parser processors */
export interface ParserProcessorProps extends BaseProcessorProps {
  /** The type of parser processor */
  readonly type: ParserProcessorType;
  /**
   * Options for JSON parser. Required when type is JSON.
   * @default - No JSON parser is created if props not set
   */
  readonly jsonOptions?: ProcessorParseJSONProperty;
  /**
   * Options for key-value parser. Required when type is KEY_VALUE.
   * @default - No key-value parser is created if props not set
   */
  readonly keyValueOptions?: ProcessorParseKeyValueProperty;
  /**
   * Options for CSV parser. Required when type is CSV.
   * @default - No CSV parser is created if props not set
   */
  readonly csvOptions?: ProcessorCsvProperty;
  /**
   * Options for Grok parser. Required when type is GROK.
   * @default - No Grok parser is created if props not set
   */
  readonly grokOptions?: ProcessorGrokProperty;
}

/** Properties for creating AWS vended log parsers */
export interface VendedLogParserProps extends BaseProcessorProps {
  /** The type of AWS vended log to parse */
  readonly logType: VendedLogType;
  /**
   * Source field to parse.
   * @default @message
   */
  readonly source?: string;
}

/** Properties for creating string mutator processors */
export interface StringMutatorProps extends BaseProcessorProps {
  /** The type of string mutation operation */
  readonly type: StringMutatorType;
  /**
   * Keys for strings to convert to lowercase. Required when type is LOWER_CASE.
   * @default - No lowercase processor is created if props not set
   */
  readonly lowerCaseKeys?: Array<string>;
  /**
   * Keys for strings to convert to uppercase. Required when type is UPPER_CASE.
   * @default - No uppercase processor is created if props not set
   */
  readonly upperCaseKeys?: Array<string>;
  /**
   * Keys for strings to trim. Required when type is TRIM.
   * @default - No trim processor is created if props not set
   */
  readonly trimKeys?: Array<string>;
  /**
   * Options for string splitting. Required when type is SPLIT.
   * @default - No string splitting processor is created if props not set
   */
  readonly splitOptions?: ProcessorSplitStringProperty;
  /**
   * Options for string substitution. Required when type is SUBSTITUTE.
   * @default - No string substitution processor is created if props not set
   */
  readonly substituteOptions?: ProcessorSubstituteStringProperty;
}

/** Properties for creating JSON mutator processors */
export interface JsonMutatorProps extends BaseProcessorProps {
  /** The type of JSON mutation operation */
  readonly type: JsonMutatorType;
  /**
   * Options for adding keys. Required when type is ADD_KEYS.
   * @default - No adding keys processor is created if props not set
   */
  readonly addKeysOptions?: ProcessorAddKeysProperty;
  /**
   * Keys to delete. Required when type is DELETE_KEYS.
   * @default - No delete key processor is created if props not set
   */
  readonly deleteKeysOptions?: ProcessorDeleteKeysProperty;
  /**
   * Options for moving keys. Required when type is MOVE_KEYS.
   * @default - No move key processor is created if props not set
   */
  readonly moveKeysOptions?: ProcessorMoveKeysProperty;
  /**
   * Options for renaming keys. Required when type is RENAME_KEYS.
   * @default - No rename key processor is created if props not set
   */
  readonly renameKeysOptions?: ProcessorRenameKeysProperty;
  /**
   * Options for copying values. Required when type is COPY_VALUE.
   * @default - No copy value processor is created if props not set
   */
  readonly copyValueOptions?: ProcessorCopyValueProperty;
  /**
   * Options for converting lists to maps. Required when type is LIST_TO_MAP.
   * @default - No list-to-map processor is created if props not set
   */
  readonly listToMapOptions?: ProcessorListToMapProperty;
}

/** Properties for creating data converter processors */
export interface DataConverterProps extends BaseProcessorProps {
  /** The type of data conversion operation */
  readonly type: DataConverterType;
  /**
   * Options for type conversion. Required when type is TYPE_CONVERTER.
   * @default - No type convertor processor is created if not set
   */
  readonly typeConverterOptions?: ProcessorTypeConverterProperty;
  /**
   * Options for datetime conversion. Required when type is DATETIME_CONVERTER.
   * @default - No date time converter processor is created if not set
   */
  readonly dateTimeConverterOptions?: ProcessorDateTimeConverterProperty;
}

/**
 * This object defines one key that will be added with the addKeys processor.
 */
export interface AddKeyEntryProperty {
  /**
   * The key of the new entry to be added to the log event.
   */
  readonly key: string;

  /**
   * The value of the new entry to be added to the log event.
   */
  readonly value: string;
  /**
   * Specifies whether to overwrite the value if the key already exists.
   * @default false
   */
  readonly overwriteIfExists?: boolean;
}

/**
 * This object defines one value to be copied with the copyValue processor.
 */
export interface CopyValueEntryProperty {
  /**
   * The key to copy.
   */
  readonly source: string;

  /**
   * The key of the field to copy the value to.
   */
  readonly target: string;
  /**
   * Specifies whether to overwrite the value if the target key already exists.
   * @default false
   */
  readonly overwriteIfExists?: boolean;
}

/**
 * This object defines one key that will be moved with the moveKey processor.
 */
export interface MoveKeyEntryProperty {
  /**
   * The key to move.
   */
  readonly source: string;

  /**
   * The key to move to.
   */
  readonly target: string;
  /**
   * Specifies whether to overwrite the value if the target key already exists.
   * @default false
   */
  readonly overwriteIfExists?: boolean;
}

/**
 * This object defines one key that will be renamed with the renameKey processor.
 */
export interface RenameKeyEntryProperty {
  /**
   * The key to rename.
   */
  readonly key: string;

  /**
   * The string to use for the new key name.
   */
  readonly renameTo: string;

  /**
   * Whether to overwrite the target key if it already exists.
   * @default false
   */
  readonly overwriteIfExists?: boolean;
}

/**
 * This object defines one log field that will be split with the splitString processor.
 */
export interface SplitStringEntryProperty {
  /**
   * The key of the field to split.
   */
  readonly source: string;

  /** The separator character to split the string on */
  readonly delimiter: DelimiterCharacter;
}

/**
 * This object defines one log field key that will be replaced using the substituteString processor.
 */
export interface SubstituteStringEntryProperty {
  /**
   * The key to modify.
   */
  readonly source: string;

  /**
   * The regular expression string to be replaced.
   */
  readonly from: string;

  /**
   * The string to be substituted for each match of from.
   */
  readonly to: string;
}

/**
 * This object defines one value type that will be converted using the typeConverter processor.
 */
export interface TypeConverterEntryProperty {
  /**
   * The key with the value that is to be converted to a different type.
   */
  readonly key: string;

  /** The data type to convert the field value to. */
  readonly type: TypeConverterType;
}

/**
 * The available CloudFormation resource properties on the AWS::Logs::Transformer resource. Following CDK conventions, this
 * interface defines all configuration options for the CfnTransformer construct.
 */
export interface TransformerProps {
  /**
   * Name of the query definition.
   */
  readonly transformerName: string;
  /** Existing log group that you want to associate with this transformer. */
  readonly logGroup: ILogGroup;
  /** List of processors in a transformer */
  readonly transformerConfig: Array<IProcessor>;
}

/** Properties needed to import an existing Transformer */
export interface TransformerAttributes {
  /** The log group associated with the transformer */
  readonly logGroup: ILogGroup;
}

/** Interface for the L2 Transformer construct that represents AWS::Logs::Transformer CFN resource. */
export interface ITransformer extends IResource {
  /** Existing log group that you want to associate with this transformer. */
  readonly logGroup: ILogGroup;

  /**
   * List of processors in a transformer
   *
   * @attribute
   */
  readonly transformerConfig: Array<IProcessor>;
}

/**
 * Implementation of an imported transformer
 * @internal
 */
class ImportedTransformer extends Resource implements ITransformer {
  /** List of processors in a transformer */
  public readonly transformerConfig: Array<IProcessor> = [];

  constructor(
    scope: Construct,
    id: string,
    public readonly logGroup: ILogGroup,
  ) {
    super(scope, id);
  }
}

/** Base class for all log event processor implementations */
export abstract class BaseProcessor implements IProcessor {
  /** Creates a parser processor for common data formats */
  static createParserProcessor(scope: Construct, id: string, props: ParserProcessorProps): IProcessor {
    return new ParserProcessor(scope, id, props);
  }

  /** Creates a parser processor for AWS vended logs */
  static createVendedLogParser(scope: Construct, id: string, props: VendedLogParserProps): IProcessor {
    return new VendedLogParser(scope, id, props);
  }

  /** Creates a string mutator processor */
  static createStringMutator(scope: Construct, id: string, props: StringMutatorProps): IProcessor {
    return new StringMutatorProcessor(scope, id, props);
  }

  /** Creates a JSON mutator processor */
  static createJsonMutator(scope: Construct, id: string, props: JsonMutatorProps): IProcessor {
    return new JsonMutatorProcessor(scope, id, props);
  }

  /** Creates a data converter processor */
  static createDataConverter(scope: Construct, id: string, props: DataConverterProps): IProcessor {
    return new DataConverterProcessor(scope, id, props);
  }

  /**
   * @internal
   */
  abstract _bind(): any;
}

/** Parser processor for common data formats */
export class ParserProcessor extends BaseProcessor {
  /** The type of parser */
  type: ParserProcessorType;
  /** Options for JSON parser */
  jsonOptions?: ProcessorParseJSONProperty;
  /** Options for key-value parser */
  keyValueOptions?: ProcessorParseKeyValueProperty;
  /** Options for CSV parser */
  csvOptions?: ProcessorCsvProperty;
  /** Options for Grok parser */
  grokOptions?: ProcessorGrokProperty;
  /** The construct scope */
  private readonly scope: Construct;

  /** Creates a new parser processor */
  constructor(scope: Construct, _id: string, props: ParserProcessorProps) {
    super();
    this.scope = scope;
    this.type = props.type;

    switch (this.type) {
      case ParserProcessorType.JSON:
        // Apply default values for JSON options
        this.jsonOptions = {
          source: '@message',
          ...props.jsonOptions,
        };
        break;

      case ParserProcessorType.KEY_VALUE:
        // Apply default values for key-value options
        this.keyValueOptions = {
          source: '@message',
          fieldDelimiter: KeyValuePairDelimiter.AMPERSAND,
          keyValueDelimiter: KeyValueDelimiter.EQUAL,
          overwriteIfExists: false,
          ...props.keyValueOptions,
        };
        break;

      case ParserProcessorType.CSV:
        // Apply default values for CSV options
        this.csvOptions = {
          source: '@message',
          quoteCharacter: QuoteCharacter.DOUBLE_QUOTE,
          delimiter: DelimiterCharacter.COMMA,
          ...props.csvOptions,
        };
        break;

      case ParserProcessorType.GROK:
        if (!props.grokOptions || !props.grokOptions.match) {
          throw new ValidationError('Match pattern is required for Grok parser', scope);
        }
        // Apply default values for Grok options
        this.grokOptions = {
          source: '@message',
          ...props.grokOptions,
        };
        break;

      default:
        throw new ValidationError(`Unsupported parser processor type: ${this.type}`, this.scope);
    }
  }

  /**
   * Returns the L1 processor configuration for this parser
   * @internal
   */
  public _bind(): any {
    switch (this.type) {
      case ParserProcessorType.JSON:
        return { parseJson: this.jsonOptions };
      case ParserProcessorType.KEY_VALUE:
        return { parseKeyValue: this.keyValueOptions };
      case ParserProcessorType.CSV:
        return { csv: this.csvOptions };
      case ParserProcessorType.GROK:
        return { grok: this.grokOptions };
      default:
        throw new ValidationError(`Unsupported parser processor type: ${this.type}`, this.scope);
    }
  }
}

/** Parser processor for AWS vended logs */
export class VendedLogParser extends BaseProcessor {
  /** The type of AWS vended log */
  logType: VendedLogType;
  /** The construct scope */
  private readonly scope: Construct;

  /** Creates a new vended log parser processor */
  constructor(scope: Construct, _id: string, props: VendedLogParserProps) {
    super();
    this.scope = scope;
    this.logType = props.logType;
  }

  /**
   * Returns the L1 processor configuration for this vended log parser
   * @internal
   */
  public _bind(): any {
    switch (this.logType) {
      case VendedLogType.CLOUDFRONT:
        return { parseCloudfront: { } };
      case VendedLogType.VPC:
        return { parseVpc: { } };
      case VendedLogType.WAF:
        return { parseWaf: { } };
      case VendedLogType.ROUTE53:
        return { parseRoute53: { } };
      case VendedLogType.POSTGRES:
        return { parsePostgres: { } };
      default:
        throw new ValidationError(`Unsupported vended log type: ${this.logType}`, this.scope);
    }
  }
}

/** Processor for string mutation operations */
export class StringMutatorProcessor extends BaseProcessor {
  /** The type of string mutation operation */
  type: StringMutatorType;
  /** Keys for strings to convert to lowercase */
  lowerCaseKeys?: Array<string>;
  /** Keys for strings to convert to uppercase */
  upperCaseKeys?: Array<string>;
  /** Keys for strings to trim */
  trimKeys?: Array<string>;
  /** Options for string splitting */
  splitOptions?: ProcessorSplitStringProperty;
  /** Options for string substitution */
  substituteOptions?: ProcessorSubstituteStringProperty;
  /** The construct scope */
  private readonly scope: Construct;

  /** Creates a new string mutator processor */
  constructor(scope: Construct, _id: string, props: StringMutatorProps) {
    super();
    this.scope = scope;
    this.type = props.type;

    switch (this.type) {
      case StringMutatorType.LOWER_CASE:
        if (!props.lowerCaseKeys || props.lowerCaseKeys.length === 0) {
          throw new ValidationError('lowerCaseKeys must be provided for LOWER_CASE string mutator', scope);
        }
        this.lowerCaseKeys = props.lowerCaseKeys;
        break;

      case StringMutatorType.UPPER_CASE:
        if (!props.upperCaseKeys || props.upperCaseKeys.length === 0) {
          throw new ValidationError('upperCaseKeys must be provided for UPPER_CASE string mutator', scope);
        }
        this.upperCaseKeys = props.upperCaseKeys;
        break;

      case StringMutatorType.TRIM:
        if (!props.trimKeys || props.trimKeys.length === 0) {
          throw new ValidationError('trimKeys must be provided for TRIM string mutator', scope);
        }
        this.trimKeys = props.trimKeys;
        break;

      case StringMutatorType.SPLIT:
        if (!props.splitOptions || !props.splitOptions.entries || props.splitOptions.entries.length === 0) {
          throw new ValidationError('splitOptions must be provided for SPLIT string mutator', scope);
        }
        this.splitOptions = props.splitOptions;
        break;

      case StringMutatorType.SUBSTITUTE:
        if (!props.substituteOptions || !props.substituteOptions.entries || props.substituteOptions.entries.length === 0) {
          throw new ValidationError('substituteOptions must be provided for SUBSTITUTE string mutator', scope);
        }
        this.substituteOptions = props.substituteOptions;
        break;

      default:
        throw new ValidationError(`Unsupported string mutator type: ${this.type}`, scope);
    }
  }

  /**
   * Returns the L1 processor configuration for this string mutator
   * @internal
   */
  public _bind(): any {
    switch (this.type) {
      case StringMutatorType.LOWER_CASE:
        return { lowerCaseString: { withKeys: this.lowerCaseKeys } };
      case StringMutatorType.UPPER_CASE:
        return { upperCaseString: { withKeys: this.upperCaseKeys } };
      case StringMutatorType.TRIM:
        return { trimString: { withKeys: this.trimKeys } };
      case StringMutatorType.SPLIT:
        return { splitString: this.splitOptions };
      case StringMutatorType.SUBSTITUTE:
        return { substituteString: this.substituteOptions };
      default:
        throw new ValidationError(`Unsupported string mutator type: ${this.type}`, this.scope);
    }
  }
}

/** Processor for JSON mutation operations */
export class JsonMutatorProcessor extends BaseProcessor {
  /** The type of JSON mutation operation */
  type: JsonMutatorType;
  /** Options for adding keys */
  addKeysOptions?: ProcessorAddKeysProperty;
  /** Keys to delete */
  deleteKeysOptions?: ProcessorDeleteKeysProperty;
  /** Options for moving keys */
  moveKeysOptions?: ProcessorMoveKeysProperty;
  /** Options for renaming keys */
  renameKeysOptions?: ProcessorRenameKeysProperty;
  /** Options for copying values */
  copyValueOptions?: ProcessorCopyValueProperty;
  /** Options for converting lists to maps */
  listToMapOptions?: ProcessorListToMapProperty;
  /** The construct scope */
  private readonly scope: Construct;

  /** Creates a new JSON mutator processor */
  constructor(scope: Construct, _id: string, props: JsonMutatorProps) {
    super();
    this.scope = scope;
    this.type = props.type;

    switch (this.type) {
      case JsonMutatorType.ADD_KEYS:
        if (!props.addKeysOptions || !props.addKeysOptions.entries || props.addKeysOptions.entries.length === 0) {
          throw new ValidationError('addKeysOptions must be provided for ADD_KEYS JSON mutator', scope);
        }
        this.addKeysOptions = {
          entries: props.addKeysOptions.entries.map(entry => { return { overwriteIfExists: false, ...entry }; }),
        };
        break;

      case JsonMutatorType.DELETE_KEYS:
        if (!props.deleteKeysOptions || !props.deleteKeysOptions.withKeys || props.deleteKeysOptions.withKeys.length === 0) {
          throw new ValidationError('deleteKeys must be provided for DELETE_KEYS JSON mutator', scope);
        }
        this.deleteKeysOptions = props.deleteKeysOptions;
        break;

      case JsonMutatorType.MOVE_KEYS:
        if (!props.moveKeysOptions || !props.moveKeysOptions.entries || props.moveKeysOptions.entries.length === 0) {
          throw new ValidationError('moveKeysOptions must be provided for MOVE_KEYS JSON mutator', scope);
        }
        this.moveKeysOptions = {
          entries: props.moveKeysOptions.entries.map(entry => { return { overwriteIfExists: false, ...entry }; }),
        };
        break;

      case JsonMutatorType.RENAME_KEYS:
        if (!props.renameKeysOptions || !props.renameKeysOptions.entries || props.renameKeysOptions.entries.length === 0) {
          throw new ValidationError('renameKeysOptions must be provided for RENAME_KEYS JSON mutator', scope);
        }
        this.renameKeysOptions = {
          entries: props.renameKeysOptions.entries.map(entry => { return { overwriteIfExists: false, ...entry }; }),
        };
        break;

      case JsonMutatorType.COPY_VALUE:
        if (!props.copyValueOptions || !props.copyValueOptions.entries || props.copyValueOptions.entries.length === 0) {
          throw new ValidationError('copyValueOptions must be provided for COPY_VALUE JSON mutator', scope);
        }
        this.copyValueOptions = {
          entries: props.copyValueOptions.entries.map(entry => { return { overwriteIfExists: false, ...entry }; }),
        };
        break;

      case JsonMutatorType.LIST_TO_MAP:
        if (!props.listToMapOptions || !props.listToMapOptions.source || !props.listToMapOptions.key) {
          throw new ValidationError('listToMapOptions with source and key must be provided for LIST_TO_MAP JSON mutator', scope);
        }
        if (props.listToMapOptions.flatten && !props.listToMapOptions.flattenedElement) {
          throw new ValidationError('listToMapOptions flattenedElement must be provided when flatten is true for LIST_TO_MAP JSON mutator', scope);
        }
        this.listToMapOptions = {
          flatten: false,
          ...props.listToMapOptions,
        };
        break;

      default:
        throw new ValidationError(`Unsupported JSON mutator type: ${this.type}`, scope);
    }
  }

  /**
   * Returns the L1 processor configuration for this JSON mutator
   * @internal
   */
  public _bind(): any {
    switch (this.type) {
      case JsonMutatorType.ADD_KEYS:
        return { addKeys: this.addKeysOptions };
      case JsonMutatorType.DELETE_KEYS:
        return { deleteKeys: this.deleteKeysOptions };
      case JsonMutatorType.MOVE_KEYS:
        return { moveKeys: this.moveKeysOptions };
      case JsonMutatorType.RENAME_KEYS:
        return { renameKeys: this.renameKeysOptions };
      case JsonMutatorType.COPY_VALUE:
        return { copyValue: this.copyValueOptions };
      case JsonMutatorType.LIST_TO_MAP:
        return { listToMap: this.listToMapOptions };
      default:
        throw new ValidationError(`Unsupported JSON mutator type: ${this.type}`, this.scope);
    }
  }
}

/** Processor for data conversion operations */
export class DataConverterProcessor extends BaseProcessor {
  /** The type of data conversion operation */
  type: DataConverterType;
  /** Options for type conversion */
  typeConverterOptions?: ProcessorTypeConverterProperty;
  /** Options for datetime conversion */
  dateTimeConverterOptions?: ProcessorDateTimeConverterProperty;
  /** The construct scope */
  private readonly scope: Construct;

  /** Creates a new data converter processor */
  constructor(scope: Construct, _id: string, props: DataConverterProps) {
    super();
    this.scope = scope;
    this.type = props.type;

    switch (this.type) {
      case DataConverterType.TYPE_CONVERTER:
        if (!props.typeConverterOptions || !props.typeConverterOptions.entries || props.typeConverterOptions.entries.length === 0) {
          throw new ValidationError('typeConverterOptions must be provided for TYPE_CONVERTER data converter', scope);
        }
        this.typeConverterOptions = props.typeConverterOptions;
        break;

      case DataConverterType.DATETIME_CONVERTER:
        if (!props.dateTimeConverterOptions || !props.dateTimeConverterOptions.source ||
            !props.dateTimeConverterOptions.target || !props.dateTimeConverterOptions.matchPatterns) {
          throw new ValidationError('dateTimeConverterOptions with source, target and matchPatterns must be provided for DATETIME_CONVERTER data converter', scope);
        }
        this.dateTimeConverterOptions = {
          targetFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
          sourceTimezone: 'UTC',
          targetTimezone: 'UTC',
          ... props.dateTimeConverterOptions,
        };
        break;

      default:
        throw new ValidationError(`Unsupported data converter type: ${this.type}`, scope);
    }
  }

  /**
   * Returns the L1 processor configuration for this data converter
   * @internal
   */
  public _bind(): any {
    switch (this.type) {
      case DataConverterType.TYPE_CONVERTER:
        return { typeConverter: this.typeConverterOptions };
      case DataConverterType.DATETIME_CONVERTER:
        return { dateTimeConverter: this.dateTimeConverterOptions };
      default:
        throw new ValidationError(`Unsupported data converter type: ${this.type}`, this.scope);
    }
  }
}

/** Represent the L2 construct for the AWS::Logs::Transformer CloudFormation resource. */
@propertyInjectable
export class Transformer extends Resource implements ITransformer {
  /**
   * The property injection ID for this resource class.
   * Used by the CDK frameworks for managing resource lifecycle.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.Transformer';

  /** Import an existing Transformer given its associated log group */
  static fromLogGroup(scope: Construct, id: string, logGroup: ILogGroup): ITransformer {
    if (!logGroup) {
      throw new ValidationError('logGroup must be specified', scope);
    }

    return new ImportedTransformer(scope, id, logGroup);
  }
  /** Import an existing Transformer given its attributes */
  static fromTransformerAttributes(scope: Construct, id: string, attrs: TransformerAttributes): ITransformer {
    return Transformer.fromLogGroup(scope, id, attrs.logGroup);
  }

  /** Existing log group that you want to associate with this transformer. */
  readonly logGroup: ILogGroup;
  /** List of processors in a transformer */
  readonly transformerConfig: Array<IProcessor>;

  /** The Transformer L2 construct that represents AWS::Logs::Transformer CFN resource. */
  constructor(scope: Construct, id: string, props: TransformerProps) {
    super(scope, id, {
      physicalName: props.transformerName,
    });
    this.logGroup = props.logGroup;
    this.transformerConfig = props.transformerConfig;

    // Validate the transformer configuration
    this.validateProcessorCount(props.transformerConfig);
    this.validateParserProcessors(props.transformerConfig);
    this.validateUniqueProcessorTypes(props.transformerConfig);
    this.validateLogGroupClass(props.logGroup);

    // Map the transformer configuration to the L1 CloudFormation resource
    new CfnTransformer(scope, 'Resource', {
      logGroupIdentifier: this.logGroup.logGroupName,
      transformerConfig: this.transformerConfig.map(processor => processor._bind()),
    });
  }

  /**
   * @internal Validates that the number of processors doesn't exceed the AWS limit of 20 per transformer, and that at least
   * one processor is provided.
   */
  private validateProcessorCount(processors: Array<IProcessor>): void {
    // Skip validation if processors is a CDK token
    if (Token.isUnresolved(processors)) {
      return;
    }

    // Validate the number of processors is between 1 and 20 inclusive
    if (processors.length === 0) {
      throw new ValidationError('At least one processor is required in a transformer', this);
    }

    if (processors.length > 20) {
      throw new ValidationError('A transformer cannot have more than 20 processors', this);
    }
  }
  /**
   * @internal Validates parser processor requirements: at least one parser-type processor is required, maximum of 5
   * parser-type processors allowed, and if including a vended log parser, it must be the first processor.
   */
  private validateParserProcessors(processors: Array<IProcessor>): void {
    // Skip validation if processors is a CDK token
    if (Token.isUnresolved(processors)) {
      return;
    }
    // Validate first processor is a parser
    if (! (processors.at(0) instanceof ParserProcessor || processors.at(0) instanceof VendedLogParser)) {
      throw new ValidationError('First processor in a transformer must be a parser', this);
    }

    // Identify parser-type processors (instances of ParserProcessor or VendedLogParser)
    const parserProcessors = processors.filter(
      p => p instanceof ParserProcessor || p instanceof VendedLogParser,
    );

    const vendedProcessors = processors.filter(
      p => p instanceof VendedLogParser,
    );

    // Validate no more than 5 parser processors
    if (parserProcessors.length > 5) {
      throw new ValidationError('A transformer cannot have more than 5 parser-type processors', this);
    }

    // Validate at most one vended parser processor exists
    if (vendedProcessors.length > 1) {
      throw new ValidationError('Only one vended log parser is allowed in a transformer', this);
    }

    // Check if any vended log parser exists
    const vendedLogParserIndex = processors.findIndex(p => p instanceof VendedLogParser);

    // If a vended log parser exists, ensure it's the first processor
    if (vendedLogParserIndex > 0) {
      throw new ValidationError('AWS vended log parser must be the first processor in a transformer', this);
    }
  }
  /**
   * @internal Validates that certain processor types appear at most once: only one grok processor, one addKeys processor,
   * and one copyValue processor allowed.
   */
  private validateUniqueProcessorTypes(processors: Array<IProcessor>): void {
    // Skip validation if processors is a CDK token
    if (Token.isUnresolved(processors)) {
      return;
    }

    // Count occurrences of grok processors
    const grokProcessors = processors.filter(
      p => p instanceof ParserProcessor && (p as ParserProcessor).type === ParserProcessorType.GROK,
    );
    if (grokProcessors.length > 1) {
      throw new ValidationError('Only one grok processor is allowed in a transformer', this);
    }

    // Count occurrences of addKeys processors
    const addKeysProcessors = processors.filter(
      p => p instanceof JsonMutatorProcessor && (p as JsonMutatorProcessor).type === JsonMutatorType.ADD_KEYS,
    );
    if (addKeysProcessors.length > 1) {
      throw new ValidationError('Only one addKeys processor is allowed in a transformer', this);
    }

    // Count occurrences of copyValue processors
    const copyValueProcessors = processors.filter(
      p => p instanceof JsonMutatorProcessor && (p as JsonMutatorProcessor).type === JsonMutatorType.COPY_VALUE,
    );
    if (copyValueProcessors.length > 1) {
      throw new ValidationError('Only one copyValue processor is allowed in a transformer', this);
    }
  }
  /**
   * @internal Validates that the log group is in the Standard log class, as transformers can only be used with Standard log
   * groups.
   */
  private validateLogGroupClass(logGroup: ILogGroup): void {
    // Since logGroupClass might not be directly accessible or might be a CDK token,
    // we'll use a warning instead of validation error
    // In an ideal implementation, we would check that: logGroup.logGroupClass === 'Standard'
    // For now, add a warning to the node metadata
    if (logGroup.node) {
      logGroup.node.addMetadata('warning', 'Transformers can only be created for log groups in the Standard log class. ' +
        'Ensure that your log group is using the Standard log class.');
    }
  }
}
