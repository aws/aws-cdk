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
 * Properties of a GraphQL Schema Type
 */
export interface BaseTypeProps {
  /**
   * property declaring if this type is a list
   *
   * @default - false
   */
  readonly isList?: boolean;

  /**
   * property declaring if this type is required
   *
   * @default - false
   */
  readonly isRequired?: boolean;
}

/**
 * Properties for configuring an Object Type
 */
export interface ObjectTypeProps {
  /**
   * the attributes of this object type
   */
  readonly definition: AttributeType[];
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
   * the name of this object type
   */
  public readonly name: string;
  /**
   * the attributes of this object type
   */
  public readonly definition: AttributeType[];
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
}

/**
 * The Attribute Types in AppSync's GraphQL. Attribute Types are the
 * building blocks for object types, queries, mutations, etc.
 */
export class AttributeType {
  /**
   * `ID` scalar type is a unique identifier. `ID` type is serialized similar to `String`.
   *
   * Often used as a key for a cache and not intended to be human-readable.
   */
  public static id(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.ID, name, props);
  }
  /**
   * `String` scalar type is a free-form human-readable text.
   */
  public static string(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.STRING, name, props);
  }
  /**
   * `Int` scalar type is a signed non-fractional numerical value.
   */
  public static int(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.INT, name, props);
  }
  /**
   * `Float` scalar type is a signed double-precision fractional value.
   */
  public static float(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.FLOAT, name, props);
  }
  /**
   * `Boolean` scalar type is a boolean value: true or false.
   */
  public static boolean(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.BOOLEAN, name, props);
  }

  /**
   * `AWSDate` scalar type represents a valid extended `ISO 8601 Date` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DD`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates
   */
  public static awsDate(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_DATE, name, props);
  }
  /**
   * `AWSTime` scalar type represents a valid extended `ISO 8601 Time` string.
   *
   * In other words, accepts date strings in the form of `hh:mm:ss.sss`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   */
  public static awsTime(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_TIME, name, props);
  }
  /**
   * `AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DDThh:mm:ss.sssZ`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
   */
  public static awsDateTime(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_DATE_TIME, name, props);
  }
  /**
   * `AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`.
   *
   * Timestamps are serialized and deserialized as numbers.
   */
  public static awsTimestamp(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_TIMESTAMP, name, props);
  }
  /**
   * `AWSEmail` scalar type represents an email address string (i.e.`username@example.com`)
   */
  public static awsEmail(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_EMAIL, name, props);
  }
  /**
   * `AWSJson` scalar type represents a JSON string.
   */
  public static awsJSON(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_JSON, name, props);
  }
  /**
   * `AWSURL` scalar type represetns a valid URL string.
   *
   * URLs wihtout schemes or contain double slashes are considered invalid.
   */
  public static awsURL(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_URL, name, props);
  }
  /**
   * `AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated.
   *
   * The number can specify a country code at the beginning, but is not required for US phone numbers.
   */
  public static awsPhone(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_PHONE, name, props);
  }
  /**
   * `AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string.
   */
  public static awsIpAddress(name: string, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.AWS_IP_ADDRESS, name, props);
  }

  /**
   * an object type to be added as an attribute
   */
  public static object(type: ObjectType, props?: BaseTypeProps): AttributeType {
    return new AttributeType(Type.OBJECT, type.name, props);
  }

  /**
   * the type of attribute
   */
  public readonly type: Type;
  /**
   * the name of this attribute type
   */
  public readonly name: string;
  /**
   * property determining if this attribute is a list
   */
  public readonly isList: boolean;
  /**
   * property determining if this attribute is required
   */
  public readonly isRequired: boolean;

  private constructor(type: Type, name: string, props?: BaseTypeProps) {
    this.type = type;
    this.name = name;
    this.isList = props?.isList ?? false;
    this.isRequired = props?.isRequired ?? false;
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