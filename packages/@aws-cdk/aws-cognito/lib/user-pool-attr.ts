/**
 * The set of standard attributes that can be marked as required.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes
 */
export interface RequiredAttributes {
  /**
   * Whether the user's postal address is a required attribute.
   * @default false
   */
  readonly address?: boolean;

  /**
   * Whether the user's birthday, represented as an ISO 8601:2004 format, is a required attribute.
   * @default false
   */
  readonly birthdate?: boolean;

  /**
   * Whether theb user's e-mail address, represented as an RFC 5322 [RFC5322] addr-spec, is a required attribute.
   * @default false
   */
  readonly email?: boolean;

  /**
   * Whether the surname or last name of the user is a required attribute.
   * @default false
   */
  readonly familyName?: boolean;

  /**
   * Whether the user's gender is a required attribute.
   * @default false
   */
  readonly gender?: boolean;

  /**
   * Whether the user's first name or give name is a required attribute.
   * @default false
   */
  readonly givenName?: boolean;

  /**
   * Whether the user's locale, represented as a BCP47 [RFC5646] language tag, is a required attribute.
   * @default false
   */
  readonly locale?: boolean;

  /**
   * Whether the user's middle name is a required attribute.
   * @default false
   */
  readonly middleName?: boolean;

  /**
   * Whether user's full name in displayable form, including all name parts, titles and suffixes, is a required attibute.
   * @default false
   */
  readonly fullname?: boolean;

  /**
   * Whether the user's nickname or casual name is a required attribute.
   * @default false
   */
  readonly nickname?: boolean;

  /**
   * Whether the user's telephone number is a required attribute.
   * @default false
   */
  readonly phoneNumber?: boolean;

  /**
   * Whether the URL to the user's profile picture is a required attribute.
   * @default false
   */
  readonly profilePicture?: boolean;

  /**
   * Whether the user's preffered username, different from the immutable user name, is a required attribute.
   * @default false
   */
  readonly preferredUsername?: boolean;

  /**
   * Whether the URL to the user's profile page is a required attribute.
   * @default false
   */
  readonly profilePage?: boolean;

  /**
   * Whether the user's time zone is a required attribute.
   * @default false
   */
  readonly timezone?: boolean;

  /**
   * Whether the time, the user's information was last updated, is a required attribute.
   * @default false
   */
  readonly lastUpdateTime?: boolean;

  /**
   * Whether the URL to the user's web page or blog is a required attribute.
   * @default false
   */
  readonly website?: boolean;
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
   * The constraints for a custom attribute of 'String' data type.
   * @default - None.
   */
  readonly stringConstraints?: StringAttributeConstraints;

  /**
   * The constraints for a custom attribute of the 'Number' data type.
   * @default - None.
   */
  readonly numberConstraints?: NumberAttributeConstraints;
}

/**
 * Constraints that can be applied to a custom attribute of string type.
 */
export interface StringAttributeConstraints {
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
 * Props for constructing a StringAttr
 */
export interface StringAttributeProps extends StringAttributeConstraints {
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
    let stringConstraints: StringAttributeConstraints | undefined;
    if (this.minLen || this.maxLen) {
      stringConstraints = {
        minLen: this.minLen,
        maxLen: this.maxLen,
      };
    }

    return {
      dataType: 'String',
      stringConstraints,
    };
  }
}

/**
 * Constraints that can be applied to a custom attribute of number type.
 */
export interface NumberAttributeConstraints {
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
 * Props for NumberAttr
 */
export interface NumberAttributeProps extends NumberAttributeConstraints {
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
    let numberConstraints: NumberAttributeConstraints | undefined;
    if (this.min || this.max) {
      numberConstraints = {
        min: this.min,
        max: this.max,
      };
    }

    return {
      dataType: 'Number',
      numberConstraints,
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