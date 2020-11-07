import { IUserPool } from '../user-pool';

/**
 * An attribute available from a third party identity provider.
 */
export class ProviderAttribute {
  /** The user id attribute provided by Amazon */
  public static readonly AMAZON_USER_ID = new ProviderAttribute('user_id');
  /** The email attribute provided by Amazon */
  public static readonly AMAZON_EMAIL = new ProviderAttribute('email');
  /** The name attribute provided by Amazon */
  public static readonly AMAZON_NAME = new ProviderAttribute('name');
  /** The postal code attribute provided by Amazon */
  public static readonly AMAZON_POSTAL_CODE = new ProviderAttribute('postal_code');

  /** The user id attribute provided by Facebook */
  public static readonly FACEBOOK_ID = new ProviderAttribute('id');
  /** The birthday attribute provided by Facebook */
  public static readonly FACEBOOK_BIRTHDAY = new ProviderAttribute('birthday');
  /** The email attribute provided by Facebook */
  public static readonly FACEBOOK_EMAIL = new ProviderAttribute('email');
  /** The name attribute provided by Facebook */
  public static readonly FACEBOOK_NAME = new ProviderAttribute('name');
  /** The first name attribute provided by Facebook */
  public static readonly FACEBOOK_FIRST_NAME = new ProviderAttribute('first_name');
  /** The last name attribute provided by Facebook */
  public static readonly FACEBOOK_LAST_NAME = new ProviderAttribute('last_name');
  /** The middle name attribute provided by Facebook */
  public static readonly FACEBOOK_MIDDLE_NAME = new ProviderAttribute('middle_name');
  /** The gender attribute provided by Facebook */
  public static readonly FACEBOOK_GENDER = new ProviderAttribute('gender');
  /** The locale attribute provided by Facebook */
  public static readonly FACEBOOK_LOCALE = new ProviderAttribute('locale');

  /** The name attribute provided by Google */
  public static readonly GOOGLE_NAMES = new ProviderAttribute('names');
  /** The gender attribute provided by Google */
  public static readonly GOOGLE_GENDER = new ProviderAttribute('gender');
  /** The birthday attribute provided by Google */
  public static readonly GOOGLE_BIRTHDAYS = new ProviderAttribute('birthdays');
  /** The birthday attribute provided by Google */
  public static readonly GOOGLE_PHONE_NUMBERS = new ProviderAttribute('phoneNumbers');
  /** The email attribute provided by Google */
  public static readonly GOOGLE_EMAIL = new ProviderAttribute('email');
  /** The name attribute provided by Google */
  public static readonly GOOGLE_NAME = new ProviderAttribute('name');
  /** The email attribute provided by Google */
  public static readonly GOOGLE_PICTURE = new ProviderAttribute('picture');
  /** The email attribute provided by Google */
  public static readonly GOOGLE_GIVEN_NAME = new ProviderAttribute('given_name');
  /** The email attribute provided by Google */
  public static readonly GOOGLE_FAMILY_NAME = new ProviderAttribute('family_name');

  /**
   * Use this to specify an attribute from the identity provider that is not pre-defined in the CDK.
   * @param attributeName the attribute value string as recognized by the provider
   */
  public static other(attributeName: string): ProviderAttribute {
    return new ProviderAttribute(attributeName);
  }

  /** The attribute value string as recognized by the provider. */
  public readonly attributeName: string;

  private constructor(attributeName: string) {
    this.attributeName = attributeName;
  }
}

/**
 * The mapping of user pool attributes to the attributes provided by the identity providers.
 */
export interface AttributeMapping {
  /**
   * The user's postal address is a required attribute.
   * @default - not mapped
   */
  readonly address?: ProviderAttribute;

  /**
   * The user's birthday.
   * @default - not mapped
   */
  readonly birthdate?: ProviderAttribute;

  /**
   * The user's e-mail address.
   * @default - not mapped
   */
  readonly email?: ProviderAttribute;

  /**
   * The surname or last name of user.
   * @default - not mapped
   */
  readonly familyName?: ProviderAttribute;

  /**
   * The user's gender.
   * @default - not mapped
   */
  readonly gender?: ProviderAttribute;

  /**
   * The user's first name or give name.
   * @default - not mapped
   */
  readonly givenName?: ProviderAttribute;

  /**
   * The user's locale.
   * @default - not mapped
   */
  readonly locale?: ProviderAttribute;

  /**
   * The user's middle name.
   * @default - not mapped
   */
  readonly middleName?: ProviderAttribute;

  /**
   * The user's full name in displayable form.
   * @default - not mapped
   */
  readonly fullname?: ProviderAttribute;

  /**
   * The user's nickname or casual name.
   * @default - not mapped
   */
  readonly nickname?: ProviderAttribute;

  /**
   * The user's telephone number.
   * @default - not mapped
   */
  readonly phoneNumber?: ProviderAttribute;

  /**
   * The URL to the user's profile picture.
   * @default - not mapped
   */
  readonly profilePicture?: ProviderAttribute;

  /**
   * The user's preferred username.
   * @default - not mapped
   */
  readonly preferredUsername?: ProviderAttribute;

  /**
   * The URL to the user's profile page.
   * @default - not mapped
   */
  readonly profilePage?: ProviderAttribute;

  /**
   * The user's time zone.
   * @default - not mapped
   */
  readonly timezone?: ProviderAttribute;

  /**
   * Time, the user's information was last updated.
   * @default - not mapped
   */
  readonly lastUpdateTime?: ProviderAttribute;

  /**
   * The URL to the user's web page or blog.
   * @default - not mapped
   */
  readonly website?: ProviderAttribute;

  /**
   * Specify custom attribute mapping here and mapping for any standard attributes not supported yet.
   * @default - no custom attribute mapping
   */
  readonly custom?: { [key: string]: ProviderAttribute };
}

/**
 * Properties to create a new instance of UserPoolIdentityProvider
 *
 */
export interface UserPoolIdentityProviderProps {
  /**
   * The user pool to which this construct provides identities.
   */
  readonly userPool: IUserPool;

  /**
   * Mapping attributes from the identity provider to standard and custom attributes of the user pool.
   * @default - no attribute mapping
   */
  readonly attributeMapping?: AttributeMapping;
}