import { Token } from '@aws-cdk/core';

/**
 * The set of standard attributes that can be marked as required or mutable.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes
 */
export interface StandardAttributes {
  /**
   * The user's postal address.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly address?: StandardAttribute;

  /**
   * The user's birthday, represented as an ISO 8601:2004 format.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly birthdate?: StandardAttribute;

  /**
   * The user's e-mail address, represented as an RFC 5322 [RFC5322] addr-spec.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly email?: StandardAttribute;

  /**
   * The surname or last name of the user.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly familyName?: StandardAttribute;

  /**
   * The user's gender.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly gender?: StandardAttribute;

  /**
   * The user's first name or give name.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly givenName?: StandardAttribute;

  /**
   * The user's locale, represented as a BCP47 [RFC5646] language tag.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly locale?: StandardAttribute;

  /**
   * The user's middle name.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly middleName?: StandardAttribute;

  /**
   * The user's full name in displayable form, including all name parts, titles and suffixes.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly fullname?: StandardAttribute;

  /**
   * The user's nickname or casual name.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly nickname?: StandardAttribute;

  /**
   * The user's telephone number.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly phoneNumber?: StandardAttribute;

  /**
   * The URL to the user's profile picture.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly profilePicture?: StandardAttribute;

  /**
   * The user's preffered username, different from the immutable user name.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly preferredUsername?: StandardAttribute;

  /**
   * The URL to the user's profile page.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly profilePage?: StandardAttribute;

  /**
   * The user's time zone.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly timezone?: StandardAttribute;

  /**
   * The time, the user's information was last updated.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly lastUpdateTime?: StandardAttribute;

  /**
   * The URL to the user's web page or blog.
   * @default - see the defaults under `StandardAttribute`
   */
  readonly website?: StandardAttribute;
}

/**
 * Standard attribute that can be marked as required or mutable.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes
 */
export interface StandardAttribute {
  /**
   * Specifies whether the value of the attribute can be changed.
   * For any user pool attribute that's mapped to an identity provider attribute, this must be set to `true`.
   * Amazon Cognito updates mapped attributes when users sign in to your application through an identity provider.
   * If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute.
   *
   * @default true
   */
  readonly mutable?: boolean;
  /**
   * Specifies whether the attribute is required upon user registration.
   * If the attribute is required and the user does not provide a value, registration or sign-in will fail.
   *
   * @default false
   */
  readonly required?: boolean;
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
  /**
   * The data type of the custom attribute.
   *
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SchemaAttributeType.html#CognitoUserPools-Type-SchemaAttributeType-AttributeDataType
   */
  readonly dataType: string;

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
  readonly mutable?: boolean;
}

/**
 * Constraints that can be applied to a custom attribute of any type.
 */
export interface CustomAttributeProps {
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
export interface StringAttributeProps extends StringAttributeConstraints, CustomAttributeProps {
}

/**
 * The String custom attribute type.
 */
export class StringAttribute implements ICustomAttribute {
  private readonly minLen?: number;
  private readonly maxLen?: number;
  private readonly mutable?: boolean;

  constructor(props: StringAttributeProps = {}) {
    if (props.minLen && !Token.isUnresolved(props.minLen) && props.minLen < 0) {
      throw new Error(`minLen cannot be less than 0 (value: ${props.minLen}).`);
    }
    if (props.maxLen && !Token.isUnresolved(props.maxLen) && props.maxLen > 2048) {
      throw new Error(`maxLen cannot be greater than 2048 (value: ${props.maxLen}).`);
    }
    this.minLen = props?.minLen;
    this.maxLen = props?.maxLen;
    this.mutable = props?.mutable;
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
export interface NumberAttributeProps extends NumberAttributeConstraints, CustomAttributeProps {
}

/**
 * The Number custom attribute type.
 */
export class NumberAttribute implements ICustomAttribute {
  private readonly min?: number;
  private readonly max?: number;
  private readonly mutable?: boolean;

  constructor(props: NumberAttributeProps = {}) {
    this.min = props?.min;
    this.max = props?.max;
    this.mutable = props?.mutable;
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
      mutable: this.mutable,
    };
  }
}

/**
 * The Boolean custom attribute type.
 */
export class BooleanAttribute implements ICustomAttribute {
  private readonly mutable?: boolean;

  constructor(props: CustomAttributeProps = {}) {
    this.mutable = props?.mutable;
  }

  public bind(): CustomAttributeConfig {
    return {
      dataType: 'Boolean',
      mutable: this.mutable,
    };
  }
}

/**
 * The DateTime custom attribute type.
 */
export class DateTimeAttribute implements ICustomAttribute {
  private readonly mutable?: boolean;

  constructor(props: CustomAttributeProps = {}) {
    this.mutable = props?.mutable;
  }

  public bind(): CustomAttributeConfig {
    return {
      dataType: 'DateTime',
      mutable: this.mutable,
    };
  }
}

/**
 * This interface contains all standard attributes recognized by Cognito
 * from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
 * including `preferred_email` and `preferred_phone_number`
 */
export interface StandardAttributesMask {
  /**
   * The user's postal address.
   * @default false
   */
  readonly address?: boolean;

  /**
   * The user's birthday, represented as an ISO 8601:2004 format.
   * @default false
   */
  readonly birthdate?: boolean;

  /**
   * The user's e-mail address, represented as an RFC 5322 [RFC5322] addr-spec.
   * @default false
   */
  readonly email?: boolean;

  /**
   * The surname or last name of the user.
   * @default false
   */
  readonly familyName?: boolean;

  /**
   * The user's gender.
   * @default false
   */
  readonly gender?: boolean;

  /**
   * The user's first name or give name.
   * @default false
   */
  readonly givenName?: boolean;

  /**
   * The user's locale, represented as a BCP47 [RFC5646] language tag.
   * @default false
   */
  readonly locale?: boolean;

  /**
   * The user's middle name.
   * @default false
   */
  readonly middleName?: boolean;

  /**
   * The user's full name in displayable form, including all name parts, titles and suffixes.
   * @default false
   */
  readonly fullname?: boolean;

  /**
   * The user's nickname or casual name.
   * @default false
   */
  readonly nickname?: boolean;

  /**
   * The user's telephone number.
   * @default false
   */
  readonly phoneNumber?: boolean;

  /**
   * The URL to the user's profile picture.
   * @default false
   */
  readonly profilePicture?: boolean;

  /**
   * The user's preffered username, different from the immutable user name.
   * @default false
   */
  readonly preferredUsername?: boolean;

  /**
   * The URL to the user's profile page.
   * @default false
   */
  readonly profilePage?: boolean;

  /**
   * The user's time zone.
   * @default false
   */
  readonly timezone?: boolean;

  /**
   * The time, the user's information was last updated.
   * @default false
   */
  readonly lastUpdateTime?: boolean;

  /**
   * Whether the email address has been verified.
   * @default false
   */
  readonly emailVerified?: boolean;

  /**
   * Whether the phone number has been verified.
   * @default false
   */
  readonly phoneNumberVerified?: boolean;

  /**
   * The URL to the user's web page or blog.
   * @default false
   */
  readonly website?: boolean;
}


/**
 * A set of attributes, useful to set Read and Write attributes
 */
export class ClientAttributes {

  /**
   * Creates a custom ClientAttributes with the specified attributes
   * @param standard a mask with the standard attributes to include in the set
   * @param custom a list of custom attributes to add to the set
   */
  public static from(standard: StandardAttributesMask, custom?: string[]): ClientAttributes {
    const aux = new Set(custom);
    if (standard.address === true) { aux.add('address'); }
    if (standard.birthdate === true) { aux.add('birthdate'); }
    if (standard.email === true) { aux.add('email'); }
    if (standard.familyName === true) { aux.add('family_name'); }
    if (standard.fullname === true) { aux.add('name'); }
    if (standard.gender === true) { aux.add('gender'); }
    if (standard.givenName === true) { aux.add('given_name'); }
    if (standard.lastUpdateTime === true) { aux.add('updated_at'); }
    if (standard.locale === true) { aux.add('locale'); }
    if (standard.middleName === true) { aux.add('middle_name'); }
    if (standard.nickname === true) { aux.add('nickname'); }
    if (standard.phoneNumber === true) { aux.add('phone_number'); }
    if (standard.preferredUsername === true) { aux.add('preferred_username'); }
    if (standard.profilePage === true) { aux.add('profile'); }
    if (standard.profilePicture === true) { aux.add('picture'); }
    if (standard.timezone === true) { aux.add('zoneinfo'); }
    if (standard.emailVerified === true) { aux.add('email_verified'); }
    if (standard.phoneNumberVerified === true) { aux.add('phone_number_verified'); }
    if (standard.website === true) { aux.add('website'); }
    return new ClientAttributes(aux);
  }

  /**
   * Creates an empty ClientAttributes
   */
  public static empty(): ClientAttributes {
    return new ClientAttributes(new Set());
  }

  /**
   * Creates an attributes set with all default Cognito Attributes
   * from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
   *
   * @note there are some attributes (i.e. `verified_email` and `verified_phone_number`)
   * that should be kept readonly by most clients. @see `ClientAttributes.profileWritable`
   * @param custom a list of custom attributes to add to the set
   */
  public static allStandard(custom?: string[]): ClientAttributes {
    let standardAttributes: StandardAttributesMask = {
      address: true,
      birthdate: true,
      email: true,
      familyName: true,
      fullname: true,
      gender: true,
      givenName: true,
      lastUpdateTime: true,
      locale: true,
      middleName: true,
      nickname: true,
      phoneNumber: true,
      preferredUsername: true,
      profilePage: true,
      profilePicture: true,
      timezone: true,
      emailVerified: true,
      phoneNumberVerified: true,
      website: true,
    };
    return ClientAttributes.from(standardAttributes, custom);
  }

  /**
   * Creates an attributes set with all Cognito Attributes except verified_email and verified_phone_number
   * from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
   *
   * @note there are some attributes (i.e. `verified_email` and `verified_phone_number`)
   * that should be kept readonly by most clients.
   * @param custom a list of custom attributes to add to the set
   */
  public static profileWritable(custom?: string[]): ClientAttributes {
    let standardAttributes: StandardAttributesMask = {
      address: true,
      birthdate: true,
      email: true,
      familyName: true,
      fullname: true,
      gender: true,
      givenName: true,
      lastUpdateTime: true,
      locale: true,
      middleName: true,
      nickname: true,
      phoneNumber: true,
      preferredUsername: true,
      profilePage: true,
      profilePicture: true,
      timezone: true,
      emailVerified: false,
      phoneNumberVerified: false,
      website: true,
    };
    return ClientAttributes.from(standardAttributes, custom);
  }

  /**
   * The set of attributes
   */
  private readonly attributesSet: Set<string> = new Set<string>();

  private constructor(attributesSet: Set<string>) {
    this.attributesSet = attributesSet;
  }

  /**
   * The list of attributes represented by this ClientAttributes
   */
  public attributes(): string[] {
    // sorting is unnecessary but it simplify testing
    return Array.from(this.attributesSet).sort();
  }
}
