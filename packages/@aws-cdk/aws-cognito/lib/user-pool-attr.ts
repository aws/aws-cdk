/**
 * The set of standard attributes that can be marked as required.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes
 */
export interface RequiredAttributes {
  /**
   * Whether the user's postal address is a required attribute.
   * @default - Attribute is not required
   */
  readonly address?: StringAttribute;

  /**
   * Whether the user's birthday, represented as an ISO 8601:2004 format, is a required attribute.
   * @default - Attribute is not required
   */
  readonly birthdate?: StringAttribute;

  /**
   * Whether the user's e-mail address, represented as an RFC 5322 [RFC5322] addr-spec, is a required attribute.
   * @default - Attribute is not required
   */
  readonly email?: StringAttribute;

  /**
   * Whether the surname or last name of the user is a required attribute.
   * @default - Attribute is not required
   */
  readonly familyName?: StringAttribute;

  /**
   * Whether the user's gender is a required attribute.
   * @default - Attribute is not required
   */
  readonly gender?: StringAttribute;

  /**
   * Whether the user's first name or give name is a required attribute.
   * @default - Attribute is not required
   */
  readonly givenName?: StringAttribute;

  /**
   * Whether the user's locale, represented as a BCP47 [RFC5646] language tag, is a required attribute.
   * @default - Attribute is not required
   */
  readonly locale?: StringAttribute;

  /**
   * Whether the user's middle name is a required attribute.
   * @default - Attribute is not required
   */
  readonly middleName?: StringAttribute;

  /**
   * Whether user's full name in displayable form, including all name parts, titles and suffixes, is a required attibute.
   * @default - Attribute is not required
   */
  readonly fullname?: StringAttribute;

  /**
   * Whether the user's nickname or casual name is a required attribute.
   * @default - Attribute is not required
   */
  readonly nickname?: StringAttribute;

  /**
   * Whether the user's telephone number is a required attribute.
   * @default - Attribute is not required
   */
  readonly phoneNumber?: StringAttribute;

  /**
   * Whether the URL to the user's profile picture is a required attribute.
   * @default - Attribute is not required
   */
  readonly profilePicture?: StringAttribute;

  /**
   * Whether the user's preffered username, different from the immutable user name, is a required attribute.
   * @default - Attribute is not required
   */
  readonly preferredUsername?: StringAttribute;

  /**
   * Whether the URL to the user's profile page is a required attribute.
   * @default - Attribute is not required
   */
  readonly profilePage?: StringAttribute;

  /**
   * Whether the user's time zone is a required attribute.
   * @default - Attribute is not required
   */
  readonly timezone?: StringAttribute;

  /**
   * Whether the time, the user's information was last updated, is a required attribute.
   * @default - Attribute is not required
   */
  readonly lastUpdateTime?: NumberAttribute;

  /**
   * Whether the URL to the user's web page or blog is a required attribute.
   * @default - Attribute is not required
   */
  readonly website?: StringAttribute;
}

/**
 * Represents a custom attribute type.
 */
export interface IAttribute {
  /**
   * Bind this custom attribute type to the values as expected by CloudFormation
   */
  bind(): AttributeConfig;
}

/**
 * Configuration that will be fed into CloudFormation for any custom attribute type.
 */
export interface AttributeConfig {
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

  /**
   * Specifies whether the value of the attribute can be changed.
   * For any user pool attribute that's mapped to an identity provider attribute, you must set this parameter to true.
   * Amazon Cognito updates mapped attributes when users sign in to your application through an identity provider.
   * If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute.
   *
   * @default false
   */
  readonly mutable?: boolean
}

/**
 * Constraints that can be applied to a custom attribute of any type.
 */
export interface AttributeProps {
  /**
   * Specifies whether the value of the attribute can be changed.
   * For any user pool attribute that's mapped to an identity provider attribute, you must set this parameter to true.
   * Amazon Cognito updates mapped attributes when users sign in to your application through an identity provider.
   * If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute.
   *
   * @default false
   */
  readonly mutable?: boolean
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
export interface StringAttributeProps extends StringAttributeConstraints, AttributeProps {
}

/**
 * The String attribute type.
 */
export class StringAttribute implements IAttribute {
  private readonly minLen?: number;
  private readonly maxLen?: number;
  private readonly mutable?: boolean;

  constructor(props: StringAttributeProps = {}) {
    if (props.minLen && props.minLen < 0) {
      throw new Error(`minLen cannot be less than 0 (value: ${props.minLen}).`);
    }
    if (props.maxLen && props.maxLen > 2048) {
      throw new Error(`maxLen cannot be greater than 2048 (value: ${props.maxLen}).`);
    }
    this.minLen = props?.minLen;
    this.maxLen = props?.maxLen;
    this.mutable = props?.mutable;
  }

  public bind(): AttributeConfig {
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
      mutable: this.mutable,
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
export interface NumberAttributeProps extends NumberAttributeConstraints, AttributeProps {
}

/**
 * The Number custom attribute type.
 */
export class NumberAttribute implements IAttribute {
  private readonly min?: number;
  private readonly max?: number;
  private readonly mutable?: boolean;

  constructor(props: NumberAttributeProps = {}) {
    this.min = props?.min;
    this.max = props?.max;
    this.mutable = props?.mutable;
  }

  public bind(): AttributeConfig {
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
      mutable: this.mutable,
    };
  }
}

/**
 * The Boolean custom attribute type.
 */
export class BooleanAttribute implements IAttribute {
  private readonly mutable?: boolean;

  constructor(props: AttributeProps = {}) {
    this.mutable = props?.mutable;
  }

  public bind(): AttributeConfig {
    return {
      dataType: 'Boolean',
      mutable: this.mutable,
    };
  }
}

/**
 * The DateTime custom attribute type.
 */
export class DateTimeAttribute implements IAttribute {
  private readonly mutable?: boolean;

  constructor(props: AttributeProps = {}) {
    this.mutable = props?.mutable;
  }

  public bind(): AttributeConfig {
    return {
      dataType: 'DateTime',
      mutable: this.mutable,
    };
  }
}
