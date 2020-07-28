import { AuthorizationType } from './graphqlapi';

/**
 * Enum containing the Types that can be used to define ObjectTypes
 */
export enum Type {
  /**
   * `ID` scalar type is a unique identifier. `ID` type is serialized similar to `String`.
   *
   * Often used as a key for a cache and not intended to be human-readable.
   */
  id = 'ID',
  /**
   * `String` scalar type is a free-form human-readable text.
   */
  string = 'String',
  /**
   * `Int` scalar type is a signed non-fractional numerical value.
   */
  int = 'Int',
  /**
   * `Float` scalar type is a signed double-precision fractional value.
   */
  float = 'Float',
  /**
   * `Boolean` scalar type is a boolean value: true or false.
   */
  boolean = 'Boolean',

  /**
   * `AWSDate` scalar type represents a valid extended `ISO 8601 Date` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DD`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates
   */
  AWSDate = 'AWSDate',
  /**
   * `AWSTime` scalar type represents a valid extended `ISO 8601 Time` string.
   *
   * In other words, accepts date strings in the form of `hh:mm:ss.sss`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Times
   */
  AWSTime = 'AWSTime',
  /**
   * `AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string.
   *
   * In other words, accepts date strings in the form of `YYYY-MM-DDThh:mm:ss.sssZ`. It accepts time zone offsets.
   *
   * @see https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
   */
  AWSDateTime = 'AWSDateTime',
  /**
   * `AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`.
   *
   * Timestamps are serialized and deserialized as numbers.
   */
  AWSTimestamp = 'AWSTimestamp',
  /**
   * `AWSEmail` scalar type represents an email address string (i.e.`username@example.com`)
   */
  AWSEmail = 'AWSEmail',
  /**
   * `AWSJson` scalar type represents a JSON string.
   */
  AWSJSON = 'AWSJSON',
  /**
   * `AWSURL` scalar type represetns a valid URL string.
   *
   * URLs wihtout schemes or contain double slashes are considered invalid.
   */
  AWSURL = 'AWSUrl',
  /**
   * `AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated.
   *
   * The number can specify a country code at the beginning, but is not required for US phone numbers.
   */
  AWSPhone = 'AWSPhone',
  /**
   * `AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string.
   */
  AWSIPAddress = 'AWSIPAddress',

  /**
   * Type used for Object Types
   */
  object = 'OBJECT',
}

/**
 * Properties of a GraphQL Schema Type
 */
export interface TypeProps {
  isList?: boolean;
  isRequired?: boolean;
  definition?: BaseType[];
  authorization?: AuthorizationType;
}

/**
 * Abstract base class for Types in GraphQL Schema
 */
abstract class BaseType {
  public readonly type: Type;
  public readonly name: string;
  public readonly isList: boolean;
  public readonly isRequired: boolean;

  protected constructor( type: Type, name: string, props?: TypeProps ) {
    this.type = type;
    this.name = name;
    this.isList = props?.isList ?? false;
    this.isRequired = props?.isRequired ?? false;
  }
};

export class ScalarType extends BaseType{
  public static id( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.id, name, props);
  }
  public static string( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.string, name, props);
  }
  public static int( name: string, props?: TypeProps): BaseType {
    return new ScalarType(Type.int, name, props);
  }
  public static float( name: string, props?: TypeProps): ScalarType {
    return new ScalarType(Type.float, name, props);
  }
  public static boolean( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.boolean, name, props);
  }

  public static AWSDate( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.AWSDate, name, props);
  }
  public static AWSTime( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.AWSTime, name, props);
  }
  public static AWSDateTime( name: string, props?: TypeProps): BaseType {
    return new ScalarType(Type.AWSDateTime, name, props);
  }
  public static AWSTimestamp( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.AWSTimestamp, name, props);
  }
  public static AWSEmail( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.AWSEmail, name, props);
  }
  public static AWSJSON( name: string, props?: TypeProps): BaseType {
    return new ScalarType(Type.AWSJSON, name, props);
  }
  public static AWSURL( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.AWSURL, name, props);
  }
  public static AWSPhone( name: string, props?: TypeProps ): ScalarType {
    return new ScalarType(Type.AWSPhone, name, props);
  }
  public static AWSIPAddress( name: string, props?: TypeProps): BaseType {
    return new ScalarType(Type.AWSIPAddress, name, props);
  }
}

export class ObjectType extends BaseType {
  public static custom( name: string, props?: TypeProps ): ObjectType {
    if ( props == undefined || props.definition == undefined) {
      throw Error('Custom Types must have a definition.');
    }
    return new ObjectType( Type.object, name, props);
  }

  public readonly definition?: BaseType[];
  public readonly authorization?: AuthorizationType;

  private constructor( type: Type, name: string, props?: TypeProps ) {
    super(type, name, props);
    this.definition = props?.definition;
    this.authorization = props?.authorization;
  }

}