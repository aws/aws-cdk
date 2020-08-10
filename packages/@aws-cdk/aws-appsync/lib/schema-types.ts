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
 * Properties for configuring an Object Type
 */
export interface ObjectTypeProps {
  /**
   * the attributes of this object type
   */
  readonly definition: { [key: string]: GraphqlType };
  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  readonly directives?: Directive [];
}

/**
 * Object Types must be configured using addType to be added to schema
 */
export class ObjectType {
  /**
   *  A method to define Object Types from an interface
   *  TODO: implement interface class
   */
  public static extendInterface(name: string, typeInterface: ObjectType, props: ObjectTypeProps): ObjectType {
    // check to make sure interface is properly scoped out
    typeInterface;
    return new ObjectType(name, props);
  }

  /**
   * the name of this object type
   */
  public readonly name: string;
  /**
   * the attributes of this object type
   */
  public readonly definition: { [key: string]: GraphqlType };
  /**
   * the directives for this object type
   *
   * @default - no directives
   */
  public readonly directives?: Directive[];

  public constructor(name: string, props: ObjectTypeProps) {
    this.name = name;
    this.definition = props.definition;
    this.directives = props?.directives;
  }

  /**
   * Create an GraphQL Type representing this Object Type
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   */
  public attribute(options?: BaseGraphqlTypeOptions): GraphqlType{
    return GraphqlType.graphqlObject({
      isList: options?.isList,
      isRequired: options?.isRequired,
      isRequiredList: options?.isRequiredList,
      objectType: this,
    });
  }

  /**
   * Generate the string of this object type
   */
  public toString(): string {
    const directives = this.generateDirectives(this.directives);
    let schemaAddition = `type ${this.name} ${directives}{\n`;
    Object.keys(this.definition).forEach( (key) => {
      const attribute = this.definition[key];
      schemaAddition = `${schemaAddition}  ${key}: ${attribute.toString()}\n`;
    });
    return `${schemaAddition}}`;
  }

  /**
   * Utility function to generate directives
   *
   * @param directives the directives of a given type
   * @param delimiter the separator betweeen directives
   * @default - ' '
   */
  private generateDirectives (directives?: Directive[], delimiter?: string): string{
    let schemaAddition = '';
    if (!directives){ return schemaAddition; }
    directives.map((directive) => {
      schemaAddition = `${schemaAddition}${directive.statement}${delimiter ?? ' '}`;
    });
    return schemaAddition;
  }
}

/**
 * Base options for GraphQL Types
 *
 * @option isList - is this attribute a list
 * @option isRequired - is this attribute non-nullable
 * @option isRequiredList - is this attribute a non-nullable list
 */
export interface BaseGraphqlTypeOptions {
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
 */
export interface GraphqlTypeOptions extends BaseGraphqlTypeOptions {
  /**
   * the object type linked to this attribute
   * @default - no object type
   */
  readonly objectType?: ObjectType;
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
export class GraphqlType {
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
  public static id(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static string(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static int(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static float(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static boolean(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsDate(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsTime(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsDateTime(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsTimestamp(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsEmail(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsJSON(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsURL(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsPhone(options?: BaseGraphqlTypeOptions): GraphqlType {
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
  public static awsIpAddress(options?: BaseGraphqlTypeOptions): GraphqlType {
    return new GraphqlType(Type.AWS_IP_ADDRESS, options);
  }

  /**
   * an object type to be added as an attribute
   *
   * @param options the options to configure this attribute
   * - isList
   * - isRequired
   * - isRequiredList
   * - objectType
   */
  public static graphqlObject(options?: GraphqlTypeOptions): GraphqlType {
    if (!options?.objectType) {
      throw new Error('GraphQL Type of object must be configured with corresponding Object Type');
    }
    return new GraphqlType(Type.OBJECT, options);
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
   * the object type linked to this attribute
   * @default - no object type
   */
  public readonly objectType?: ObjectType;

  private constructor(type: Type, options?: GraphqlTypeOptions) {
    this.type = type;
    this.isList = options?.isList ?? false;
    this.isRequired = options?.isRequired ?? false;
    this.isRequiredList = options?.isRequiredList ?? false;
    this.objectType = options?.objectType;
  }

  /**
   * Generate the string for this attribute
   */
  public toString(): string{
    // If an Object Type, we use the name of the Object Type
    let type = this.objectType ? this.objectType?.name : this.type;
    // If configured as required, the GraphQL Type becomes required
    type = this.isRequired ? `${type}!` : type;
    // If configured with isXxxList, the GraphQL Type becomes a list
    type = this.isList || this.isRequiredList ? `[${type}]` : type;
    // If configured with isRequiredList, the list becomes required
    type = this.isRequiredList ? `${type}!` : type;
    return type;
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
  AWS_URL = 'AWSUrl',
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
   * Type used for Object Types
   */
  OBJECT = 'OBJECT',
}