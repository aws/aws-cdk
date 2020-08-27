import { Resolver } from './resolver';
import { ResolvableFieldOptions, BaseTypeOptions, GraphqlType } from './schema-field';
import { InterfaceType } from './schema-intermediate';

/**
 * A Graphql Field
 */
export interface IField {
  /**
   * the type of attribute
   */
  readonly type: Type;

  /**
   * property determining if this attribute is a list
   * i.e. if true, attribute would be `[Type]`
   *
   * @default false
   */
  readonly isList: boolean;

  /**
   * property determining if this attribute is non-nullable
   * i.e. if true, attribute would be `Type!` and this attribute
   * must always have a value
   *
   * @default false
   */
  readonly isRequired: boolean;

  /**
   * property determining if this attribute is a non-nullable list
   * i.e. if true, attribute would be `[ Type ]!` and this attribute's
   * list must always have a value
   *
   * @default false
   */
  readonly isRequiredList: boolean;

  /**
   * The options to make this field resolvable
   *
   * @default - not a resolvable field
   */
  readonly fieldOptions?: ResolvableFieldOptions;

  /**
   * the intermediate type linked to this attribute
   * (i.e. an interface or an object)
   *
   * @default - no intermediate type
   */
  readonly intermediateType?: IIntermediateType;

  /**
   * Generate the string for this attribute
   */
  toString(): string;

  /**
   * Generate the arguments for this field
   */
  argsToString(): string;
}

/**
 * Intermediate Types are types that includes a certain set of fields
 * that define the entirety of your schema
 */
export interface IIntermediateType {
  /**
   * the name of this type
   */
  readonly name: string;

  /**
   * the attributes of this type
   */
  readonly definition: { [key: string]: IField };

  /**
   * The Interface Types this Intermediate Type implements
   *
   * @default - no interface types
   */
  readonly interfaceTypes?: InterfaceType[];

  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  readonly directives?: Directive[];

  /**
   * The resolvers linked to this data source
   */
  resolvers?: Resolver[];

  /**
   * the intermediate type linked to this attribute
   * (i.e. an interface or an object)
   *
   * @default - no intermediate type
   */
  readonly intermediateType?: InterfaceType;

  /**
   * Create an GraphQL Type representing this Intermediate Type
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  attribute(options?: BaseTypeOptions): GraphqlType;

  /**
   * Generate the string of this object type
   */
  toString(): string;

  /**
   * Add a field to this Intermediate Type
   *
   * @param fieldName - The name of the field
   * @param field - the resolvable field to add
   */
  addField(fieldName: string, field: IField): void;
}

/**
 * Directives for types
 *
 * i.e. @aws_iam or @aws_subscribe
 *
 * @experimental
 */
export class Directive {
  /**
   * Add the @aws_iam directive
   */
  public static iam(): Directive {
    return new Directive('@aws_iam');
  }

  /**
   * Add a custom directive
   *
   * @param statement - the directive statement to append
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