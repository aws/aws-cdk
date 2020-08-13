import { BaseDataSource } from './data-source';
import { MappingTemplate } from './mapping-template';
import { GraphqlType } from './schema-types';

/**
 * Directives for types
 *
 * i.e. @aws_iam or @aws_subscribe
 */
export class Directive {
  /**
   * Add the @aws_iam directive
   */
  public static iam(): Directive{
    return new Directive('@aws_iam');
  }

  /**
   * Add a custom directive
   *
   * @param statement - the directive statement to append
   * Note: doesn't guarantee functionality
   */
  public static custom(statement: string): Directive {
    return new Directive(statement);
  }

  /**
   * the directive statement
   */
  public readonly statement: string;

  private constructor(statement: string) { this.statement = statement; }
}

/**
 * Properties for configuring a resolvable field
 *
 * @options args - the variables and types that define the arguments
 *
 * i.e. { string: GraphqlType, string: GraphqlType }
 *
 * @options requestMappingTemplate - the mapping template for requests to this resolver
 * @options responseMappingTemplate - the mapping template for responses from this resolver
 */
export interface ResolvableFieldOptions {
  /**
   * The arguments for this resolvable field.
   *
   * i.e. type Example (first: String second: String) {}
   * - where 'first' and 'second' are key values for args
   * and 'String' is the GraphqlType
   *
   * @default - no arguments
   */
  readonly args?: { [key: string]: GraphqlType };
  /**
   * The request mapping template for this resolver
   *
   * @default - No mapping template
   */
  readonly requestMappingTemplate?: MappingTemplate;
  /**
   * The response mapping template for this resolver
   *
   * @default - No mapping template
   */
  readonly responseMappingTemplate?: MappingTemplate;
}

/**
 * Resolvable Fields build upon Graphql Types and provide fields
 * that can resolve into operations on a data source.
 */
export class ResolvableField {
  /**
   * The return type for this field
   */
  readonly graphqlType: GraphqlType;
  /**
   * The data source creating linked to this resolvable field
   */
  readonly dataSource: BaseDataSource;
  /**
   * The arguments for this resolvable field.
   *
   * i.e. type Example (first: String second: String) {}
   * - where 'first' and 'second' are key values for args
   * and 'String' is the GraphqlType
   *
   * @default - no arguments
   */
  readonly args?: { [key: string]: GraphqlType };
  /**
   * The request mapping template for this resolver
   *
   * @default - No mapping template
   */
  readonly requestMappingTemplate?: MappingTemplate;
  /**
   * The response mapping template for this resolver
   *
   * @default - No mapping template
   */
  readonly responseMappingTemplate?: MappingTemplate;

  public constructor(type: GraphqlType, dataSource: BaseDataSource, options?: ResolvableFieldOptions) {
    this.graphqlType = type;
    this.dataSource = dataSource;
    this.args = options?.args;
    this.requestMappingTemplate = options?.requestMappingTemplate;
    this.responseMappingTemplate = options?.responseMappingTemplate;
  }

  /**
   * Generate the string of this resolvable field
   */
  public toString(): string{
    return this.graphqlType.toString();
  }

  /**
   * Generate the args string of this resolvable field
   */
  public argsToString(): string{
    let args = '( ';
    Object.keys(this.args ?? {}).forEach((key) => {
      const type = this.args?.[key].toString();
      args = `${args}${key}: ${type} `;
    });
    return `${args})`;
  }
}

/**
 * Enum containing the Types that can be used to define ObjectTypes
 */
export enum Type {
  /**
   * `ID` scalar type is a unique identifier. `ID` type is serialized similar to `String`.
   *
   * Often used as a key for a cache and not intended to be human-readable.
   */
  ID = 'ID',
  /**
   * `String` scalar type is a free-form human-readable text.
   */
  STRING = 'String',
  /**
   * `Int` scalar type is a signed non-fractional numerical value.
   */
  INT = 'Int',
  /**
   * `Float` scalar type is a signed double-precision fractional value.
   */
  FLOAT = 'Float',
  /**
   * `Boolean` scalar type is a boolean value: true or false.
   */
  BOOLEAN = 'Boolean',

  /**
   * `AWSDate` scalar type represents a valid extended `ISO 8601 Date` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DD`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates
   */
  AWS_DATE = 'AWSDate',
  /**
   * `AWSTime` scalar type represents a valid extended `ISO 8601 Time` string.
   *
   * In other words, accepts date strings in the form of `hh:mm:ss.sss`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   */
  AWS_TIME = 'AWSTime',
  /**
   * `AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DDThh:mm:ss.sssZ`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
   */
  AWS_DATE_TIME = 'AWSDateTime',
  /**
   * `AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`.
   *
   * Timestamps are serialized and deserialized as numbers.
   */
  AWS_TIMESTAMP = 'AWSTimestamp',
  /**
   * `AWSEmail` scalar type represents an email address string (i.e.`username@example.com`)
   */
  AWS_EMAIL = 'AWSEmail',
  /**
   * `AWSJson` scalar type represents a JSON string.
   */
  AWS_JSON = 'AWSJSON',
  /**
   * `AWSURL` scalar type represetns a valid URL string.
   *
   * URLs wihtout schemes or contain double slashes are considered invalid.
   */
  AWS_URL = 'AWSURL',
  /**
   * `AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated.
   *
   * The number can specify a country code at the beginning, but is not required for US phone numbers.
   */
  AWS_PHONE = 'AWSPhone',
  /**
   * `AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string.
   */
  AWS_IP_ADDRESS = 'AWSIPAddress',

  /**
   * Type used for Intermediate Types
   * (i.e. an interface or an object type)
   */
  INTERMEDIATE = 'INTERMEDIATE',
}