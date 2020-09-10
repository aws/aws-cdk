import { IAppsyncFunction } from './appsync-function';
import { BaseDataSource } from './data-source';
import { AuthorizationType } from './graphqlapi';
import { MappingTemplate } from './mapping-template';
import { Type, IField, IIntermediateType, Directive } from './schema-base';

/**
 * Base options for GraphQL Types
 *
 * @option isList - is this attribute a list
 * @option isRequired - is this attribute non-nullable
 * @option isRequiredList - is this attribute a non-nullable list
 *
 * @experimental
 */
export interface BaseTypeOptions {
  /**
   * property determining if this attribute is a list
   * i.e. if true, attribute would be [Type]
   *
   * @default - false
   */
  readonly isList?: boolean;

  /**
   * property determining if this attribute is non-nullable
   * i.e. if true, attribute would be Type!
   *
   * @default - false
   */
  readonly isRequired?: boolean;

  /**
   * property determining if this attribute is a non-nullable list
   * i.e. if true, attribute would be [ Type ]!
   * or if isRequired true, attribe would be [ Type! ]!
   *
   * @default - false
   */
  readonly isRequiredList?: boolean;
}

/**
 * Options for GraphQL Types
 *
 * @option isList - is this attribute a list
 * @option isRequired - is this attribute non-nullable
 * @option isRequiredList - is this attribute a non-nullable list
 * @option objectType - the object type linked to this attribute
 *
 * @experimental
 */
export interface GraphqlTypeOptions extends BaseTypeOptions {
  /**
   * the intermediate type linked to this attribute
   * @default - no intermediate type
   */
  readonly intermediateType?: IIntermediateType;
}

/**
 * The GraphQL Types in AppSync's GraphQL. GraphQL Types are the
 * building blocks for object types, queries, mutations, etc. They are
 * types like String, Int, Id or even Object Types you create.
 *
 * i.e. `String`, `String!`, `[String]`, `[String!]`, `[String]!`
 *
 * GraphQL Types are used to define the entirety of schema.
 */
export class GraphqlType implements IField {
  /**
   * `ID` scalar type is a unique identifier. `ID` type is serialized similar to `String`.
   *
   * Often used as a key for a cache and not intended to be human-readable.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static id(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.ID, options);
  }
  /**
   * `String` scalar type is a free-form human-readable text.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static string(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.STRING, options);
  }
  /**
   * `Int` scalar type is a signed non-fractional numerical value.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static int(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.INT, options);
  }
  /**
   * `Float` scalar type is a signed double-precision fractional value.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static float(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.FLOAT, options);
  }
  /**
   * `Boolean` scalar type is a boolean value: true or false.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static boolean(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.BOOLEAN, options);
  }

  /**
   * `AWSDate` scalar type represents a valid extended `ISO 8601 Date` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DD`. It accepts time zone offsets.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsDate(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_DATE, options);
  }
  /**
   * `AWSTime` scalar type represents a valid extended `ISO 8601 Time` string.
   *
   * In other words, accepts date strings in the form of `hh:mm:ss.sss`. It accepts time zone offsets.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsTime(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_TIME, options);
  }
  /**
   * `AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DDThh:mm:ss.sssZ`. It accepts time zone offsets.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsDateTime(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_DATE_TIME, options);
  }
  /**
   * `AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`.
   *
   * Timestamps are serialized and deserialized as numbers.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsTimestamp(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_TIMESTAMP, options);
  }
  /**
   * `AWSEmail` scalar type represents an email address string (i.e.`username@example.com`)
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsEmail(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_EMAIL, options);
  }
  /**
   * `AWSJson` scalar type represents a JSON string.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsJson(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_JSON, options);
  }
  /**
   * `AWSURL` scalar type represetns a valid URL string.
   *
   * URLs wihtout schemes or contain double slashes are considered invalid.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsUrl(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_URL, options);
  }
  /**
   * `AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated.
   *
   * The number can specify a country code at the beginning, but is not required for US phone numbers.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsPhone(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_PHONE, options);
  }
  /**
   * `AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string.
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public static awsIpAddress(options?: BaseTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_IP_ADDRESS, options);
  }

  /**
   * an intermediate type to be added as an attribute
   * (i.e. an interface or an object type)
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   * - intermediateType
   */
  public static intermediate(options?: GraphqlTypeOptions): GraphqlType {
    if (!options?.intermediateType) {
      throw new Error('GraphQL Type of interface must be configured with corresponding Intermediate Type');
    }
    return new GraphqlType(Type.INTERMEDIATE, options);
  }

  /**
   * the type of attribute
   */
  public readonly type: Type;

  /**
   * property determining if this attribute is a list
   * i.e. if true, attribute would be `[Type]`
   *
   * @default - false
   */
  public readonly isList: boolean;

  /**
   * property determining if this attribute is non-nullable
   * i.e. if true, attribute would be `Type!` and this attribute
   * must always have a value
   *
   * @default - false
   */
  public readonly isRequired: boolean;

  /**
   * property determining if this attribute is a non-nullable list
   * i.e. if true, attribute would be `[ Type ]!` and this attribute's
   * list must always have a value
   *
   * @default - false
   */
  public readonly isRequiredList: boolean;

  /**
   * the intermediate type linked to this attribute
   * (i.e. an interface or an object)
   *
   * @default - no intermediate type
   */
  public readonly intermediateType?: IIntermediateType;

  protected constructor(type: Type, options?: GraphqlTypeOptions) {
    this.type = type;
    this.isList = options?.isList ?? false;
    this.isRequired = options?.isRequired ?? false;
    this.isRequiredList = options?.isRequiredList ?? false;
    this.intermediateType = options?.intermediateType;
  }

  /**
   * Generate the string for this attribute
   */
  public toString(): string {
    // If an Object Type, we use the name of the Object Type
    let type = this.intermediateType ? this.intermediateType?.name : this.type;
    // If configured as required, the GraphQL Type becomes required
    type = this.isRequired ? `${type}!` : type;
    // If configured with isXxxList, the GraphQL Type becomes a list
    type = this.isList || this.isRequiredList ? `[${type}]` : type;
    // If configured with isRequiredList, the list becomes required
    type = this.isRequiredList ? `${type}!` : type;
    return type;
  }

  /**
   * Generate the arguments for this field
   */
  public argsToString(): string {
    return '';
  }

  /**
   * Generate the directives for this field
   */
  public directivesToString(_modes?: AuthorizationType[]): string {
    return '';
  }
}

/**
 * Properties for configuring a field
 *
 * @options args - the variables and types that define the arguments
 *
 * i.e. { string: GraphqlType, string: GraphqlType }
 */
export interface FieldOptions {
  /**
   * The return type for this field
   */
  readonly returnType: GraphqlType;
  /**
   * The arguments for this field.
   *
   * i.e. type Example (first: String second: String) {}
   * - where 'first' and 'second' are key values for args
   * and 'String' is the GraphqlType
   *
   * @default - no arguments
   */
  readonly args?: { [key: string]: GraphqlType };
  /**
   * the directives for this field
   *
   * @default - no directives
   */
  readonly directives?: Directive[];
}

/**
 * Fields build upon Graphql Types and provide typing
 * and arguments.
 */
export class Field extends GraphqlType implements IField {
  /**
   * The options for this field
   *
   * @default - no arguments
   */
  public readonly fieldOptions?: ResolvableFieldOptions;

  public constructor(options: FieldOptions) {
    const props = {
      isList: options.returnType.isList,
      isRequired: options.returnType.isRequired,
      isRequiredList: options.returnType.isRequiredList,
      intermediateType: options.returnType.intermediateType,
    };
    super(options.returnType.type, props);
    this.fieldOptions = options;
  }

  /**
   * Generate the args string of this resolvable field
   */
  public argsToString(): string {
    if (!this.fieldOptions || !this.fieldOptions.args) { return ''; }
    return Object.keys(this.fieldOptions.args).reduce((acc, key) =>
      `${acc}${key}: ${this.fieldOptions?.args?.[key].toString()} `, '(').slice(0, -1) + ')';
  }

  /**
   * Generate the directives for this field
   */
  public directivesToString(modes?: AuthorizationType[]): string {
    if (!this.fieldOptions || !this.fieldOptions.directives) { return ''; }
    return this.fieldOptions.directives.reduce((acc, directive) =>
      `${acc}${directive._bindToAuthModes(modes).toString()} `, '\n  ').slice(0, -1);
  }
}

/**
 * Properties for configuring a resolvable field
 *
 * @options dataSource - the data source linked to this resolvable field
 * @options requestMappingTemplate - the mapping template for requests to this resolver
 * @options responseMappingTemplate - the mapping template for responses from this resolver
 */
export interface ResolvableFieldOptions extends FieldOptions {
  /**
   * The data source creating linked to this resolvable field
   *
   * @default - no data source
   */
  readonly dataSource?: BaseDataSource;
  /**
   * configuration of the pipeline resolver
   *
   * @default - no pipeline resolver configuration
   * An empty array or undefined prop will set resolver to be of type unit
   */
  readonly pipelineConfig?: IAppsyncFunction[];
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
export class ResolvableField extends Field implements IField {
  /**
   * The options to make this field resolvable
   *
   * @default - not a resolvable field
   */
  public readonly fieldOptions?: ResolvableFieldOptions;

  public constructor(options: ResolvableFieldOptions) {
    const props = {
      returnType: options.returnType,
      args: options.args,
    };
    super(props);
    this.fieldOptions = options;
  }
}