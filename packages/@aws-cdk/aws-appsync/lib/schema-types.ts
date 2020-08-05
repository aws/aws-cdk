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
  public static id(name: string): AttributeType {
    return new AttributeType(Type.ID, name);
  }
  /**
   * `String` scalar type is a free-form human-readable text.
   */
  public static string(name: string): AttributeType {
    return new AttributeType(Type.STRING, name);
  }
  /**
   * `Int` scalar type is a signed non-fractional numerical value.
   */
  public static int(name: string): AttributeType {
    return new AttributeType(Type.INT, name);
  }
  /**
   * `Float` scalar type is a signed double-precision fractional value.
   */
  public static float(name: string): AttributeType {
    return new AttributeType(Type.FLOAT, name);
  }
  /**
   * `Boolean` scalar type is a boolean value: true or false.
   */
  public static boolean(name: string): AttributeType {
    return new AttributeType(Type.BOOLEAN, name);
  }

  /**
   * `AWSDate` scalar type represents a valid extended `ISO 8601 Date` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DD`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates
   */
  public static awsDate(name: string): AttributeType {
    return new AttributeType(Type.AWS_DATE, name);
  }
  /**
   * `AWSTime` scalar type represents a valid extended `ISO 8601 Time` string.
   *
   * In other words, accepts date strings in the form of `hh:mm:ss.sss`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   */
  public static awsTime(name: string): AttributeType {
    return new AttributeType(Type.AWS_TIME, name);
  }
  /**
   * `AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DDThh:mm:ss.sssZ`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
   */
  public static awsDateTime(name: string): AttributeType {
    return new AttributeType(Type.AWS_DATE_TIME, name);
  }
  /**
   * `AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`.
   *
   * Timestamps are serialized and deserialized as numbers.
   */
  public static awsTimestamp(name: string): AttributeType {
    return new AttributeType(Type.AWS_TIMESTAMP, name);
  }
  /**
   * `AWSEmail` scalar type represents an email address string (i.e.`username@example.com`)
   */
  public static awsEmail(name: string): AttributeType {
    return new AttributeType(Type.AWS_EMAIL, name);
  }
  /**
   * `AWSJson` scalar type represents a JSON string.
   */
  public static awsJSON(name: string): AttributeType {
    return new AttributeType(Type.AWS_JSON, name);
  }
  /**
   * `AWSURL` scalar type represetns a valid URL string.
   *
   * URLs wihtout schemes or contain double slashes are considered invalid.
   */
  public static awsURL(name: string): AttributeType {
    return new AttributeType(Type.AWS_URL, name);
  }
  /**
   * `AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated.
   *
   * The number can specify a country code at the beginning, but is not required for US phone numbers.
   */
  public static awsPhone(name: string): AttributeType {
    return new AttributeType(Type.AWS_PHONE, name);
  }
  /**
   * `AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string.
   */
  public static awsIpAddress(name: string): AttributeType {
    return new AttributeType(Type.AWS_IP_ADDRESS, name);
  }

  /**
   * an object type to be added as an attribute
   */
  public static object(name: string, type: ObjectType): AttributeType {
    return new AttributeType(Type.OBJECT, name, type);
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
  public isList: boolean;
  /**
   * property determining if this attribute is required
   */
  public isRequired: boolean;
  /**
   * the object type linked to this attribute
   * @default - no object type
   */
  public objectType?: ObjectType;


  private constructor(type: Type, name: string, object?: ObjectType) {
    this.type = type;
    this.name = name;
    this.isList = false;
    this.isRequired = false;
    this.objectType = object;
  }

  /**
   * Set this attribute type as a list
   */
  public list(): AttributeType {
    this.isList = true;
    return this;
  }

  /**
   * Set this attribute type to be required
   */
  public required(): AttributeType {
    this.isRequired = true;
    return this;
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