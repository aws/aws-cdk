/**
 * Standard attributes
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes
 */
export enum StandardAttribute {
  /**
   * End-User's preferred postal address.
   */
  ADDRESS = 'address',

  /**
   * User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format.
   * The year MAY be 0000, indicating that it is omitted.
   * To represent only the year, YYYY format is allowed.
   */
  BIRTHDATE = 'birthdate',

  /**
   * User's preferred e-mail address.
   * Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax.
   */
  EMAIL = 'email',

  /**
   * Surname or last name of the user.
   */
  FAMILY_NAME = 'family_name',

  /**
   * User's gender.
   */
  GENDER = 'gender',

  /**
   * Given name or first name of the user.
   */
  GIVEN_NAME = 'given_name',

  /**
   * User's locale, represented as a BCP47 [RFC5646] language tag.
   * This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase
   * and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash.
   * For example, en-US or fr-CA.
   */
  LOCALE = 'locale',

  /**
   * Middle name of the user.
   */
  MIDDLE_NAME = 'middle_name',

  /**
   * User's full name in displayable form including all name parts, possibly including titles and suffixes.
   */
  NAME = 'name',

  /**
   * Casual name of the user that may or may not be the same as the given_name.
   */
  NICKNAME = 'nickname',

  /**
   * User's preferred telephone number.
   *
   * Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed
   * immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other
   * characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the
   * service.
   */
  PHONE_NUMBER = 'phone_number',

  /**
   * URL of the user's profile picture.
   * This URL must refer to an image file (for example, a PNG, JPEG, or GIF image file).
   */
  PICTURE = 'picture',

  /**
   * Shorthand name by which the user wishes to be referred to.
   */
  PREFERRED_USERNAME = 'preferred_username',

  /**
   * URL of the user's profile page.
   */
  PROFILE = 'profile',

  /**
   * The user's time zone
   */
  TIMEZONE = 'zoneinfo',

  /**
   * Time the user's information was last updated.
   * Its value is a JSON number representing the number of seconds from 1970-01-01T0:0:0Z
   * as measured in UTC until the date/time.
   */
  UPDATED_AT = 'updated_at',

  /**
   * URL of the user's web page or blog.
   */
  WEBSITE = 'website'
}

/**
 * Represents a custom attribute type.
 */
export interface ICustomAttribute {
  /**
   * Bind this custom attribute type to the values as expected by CloudFormation
   */
  bind(): CustomAttributeConfig;
}

/**
 * Configuration that will be fed into CloudFormation for any custom attribute type.
 */
export interface CustomAttributeConfig {
  // tslint:disable:max-line-length
  /**
   * The data type of the custom attribute.
   *
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SchemaAttributeType.html#CognitoUserPools-Type-SchemaAttributeType-AttributeDataType
   */
  readonly dataType: string;
  // tslint:enable:max-line-length

  /**
   * The constraints attached to this custom attribute.
   * The structure here would be the fragment of `CfnUserPool.SchemaAttributeProperty` associated with this data type.
   * For example, in the case of the 'String' data type, this would be `{ "stringAttributeConstraints": { "minLength": "..", "maxLength": ".." } }`.
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SchemaAttributeType.html
   * @default - no constraints
   */
  readonly constraints?: { [key: string]: any };
}

/**
 * Props for constructing a StringAttr
 */
export interface StringAttributeProps {
  /**
   * Minimum length of this attribute.
   * @default 0
   */
  readonly minLen?: number;

  /**
   * Maximum length of this attribute.
   * @default 2048
   */
  readonly maxLen?: number;
}

/**
 * The String custom attribute type.
 */
export class StringAttribute implements ICustomAttribute {
  private readonly minLen?: number;
  private readonly maxLen?: number;

  constructor(props: StringAttributeProps = {}) {
    if (props.minLen && props.minLen < 0) {
      throw new Error(`minLen cannot be less than 0 (value: ${props.minLen}).`);
    }
    if (props.maxLen && props.maxLen > 2048) {
      throw new Error(`maxLen cannot be greater than 2048 (value: ${props.maxLen}).`);
    }
    this.minLen = props?.minLen;
    this.maxLen = props?.maxLen;
  }

  public bind(): CustomAttributeConfig {
    const constraints = {
      stringAttributeConstraints: {
        minLength: this.minLen?.toString(),
        maxLength: this.maxLen?.toString(),
      }
    };

    return {
      dataType: 'String',
      constraints: (this.minLen || this.maxLen) ? constraints : undefined,
    };
  }
}

/**
 * Props for NumberAttr
 */
export interface NumberAttributeProps {
  /**
   * Minimum value of this attribute.
   * @default - no minimum value
   */
  readonly min?: number;

  /**
   * Maximum value of this attribute.
   * @default - no maximum value
   */
  readonly max?: number;
}

/**
 * The Number custom attribute type.
 */
export class NumberAttribute implements ICustomAttribute {
  private readonly min?: number;
  private readonly max?: number;

  constructor(props: NumberAttributeProps = {}) {
    this.min = props?.min;
    this.max = props?.max;
  }

  public bind(): CustomAttributeConfig {
    const constraints = {
      numberAttributeConstraints: {
        minValue: this.min?.toString(),
        maxValue: this.max?.toString(),
      }
    };

    return {
      dataType: 'Number',
      constraints: (this.min || this.max) ? constraints : undefined,
    };
  }
}

/**
 * The Boolean custom attribute type.
 */
export class BooleanAttribute implements ICustomAttribute {
  public bind(): CustomAttributeConfig {
    return {
      dataType: 'Boolean'
    };
  }
}

/**
 * The DateTime custom attribute type.
 */
export class DateTimeAttribute implements ICustomAttribute {
  public bind(): CustomAttributeConfig {
    return {
      dataType: 'DateTime'
    };
  }
}