import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnUserPoolIdentityProvider } from './cognito.generated';
import { StandardAttributeNames } from './private/attr-names';
import { IUserPool } from './user-pool';

/**
 * Represents a UserPoolIdentityProvider
 */
export interface IUserPoolIdentityProvider extends IResource {
  /**
   * The primary identifier of this identity provider
   * @attribute
   */
  readonly providerName: string;
}

/**
 * User pool third-party identity providers
 */
export class UserPoolIdentityProvider {

  /**
   * Import an existing UserPoolIdentityProvider
   */
  public static fromProviderName(scope: Construct, id: string, providerName: string): IUserPoolIdentityProvider {
    class Import extends Resource implements IUserPoolIdentityProvider {
      public readonly providerName: string = providerName;
    }

    return new Import(scope, id);
  }

  private constructor() {}
}

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

/**
 * Options to integrate with the various social identity providers.
 */
abstract class UserPoolIdentityProviderBase extends Resource implements IUserPoolIdentityProvider {
  public abstract readonly providerName: string;

  public constructor(scope: Construct, id: string, private readonly props: UserPoolIdentityProviderProps) {
    super(scope, id);
    props.userPool.registerIdentityProvider(this);
  }

  protected configureAttributeMapping(): any {
    if (!this.props.attributeMapping) {
      return undefined;
    }
    type SansCustom = Omit<AttributeMapping, 'custom'>;
    let mapping: { [key: string]: string } = {};
    mapping = Object.entries(this.props.attributeMapping)
      .filter(([k, _]) => k !== 'custom') // 'custom' handled later separately
      .reduce((agg, [k, v]) => {
        return { ...agg, [StandardAttributeNames[k as keyof SansCustom]]: v.attributeName };
      }, mapping);
    if (this.props.attributeMapping.custom) {
      mapping = Object.entries(this.props.attributeMapping.custom).reduce((agg, [k, v]) => {
        return { ...agg, [k]: v.attributeName };
      }, mapping);
    }
    if (Object.keys(mapping).length === 0) { return undefined; }
    return mapping;
  }
}

/**
 * Properties to initialize UserPoolAmazonIdentityProvider
 */
export interface UserPoolIdentityProviderAmazonProps extends UserPoolIdentityProviderProps {
  /**
   * The client id recognized by 'Login with Amazon' APIs.
   * @see https://developer.amazon.com/docs/login-with-amazon/security-profile.html#client-identifier
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientId for 'Login with Amazon' APIs to authenticate the client.
   * @see https://developer.amazon.com/docs/login-with-amazon/security-profile.html#client-identifier
   */
  readonly clientSecret: string;
  /**
   * The types of user profile data to obtain for the Amazon profile.
   * @see https://developer.amazon.com/docs/login-with-amazon/customer-profile.html
   * @default [ profile ]
   */
  readonly scopes?: string[];
}

/**
 * Represents a identity provider that integrates with 'Login with Amazon'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderAmazon extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderAmazonProps) {
    super(scope, id, props);

    const scopes = props.scopes ?? ['profile'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'LoginWithAmazon', // must be 'LoginWithAmazon' when the type is 'LoginWithAmazon'
      providerType: 'LoginWithAmazon',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(' '),
      },
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}

/**
 * Properties to initialize UserPoolFacebookIdentityProvider
 */
export interface UserPoolIdentityProviderFacebookProps extends UserPoolIdentityProviderProps {
  /**
  * The client id recognized by Facebook APIs.
  */
  readonly clientId: string;
  /**
  * The client secret to be accompanied with clientUd for Facebook to authenticate the client.
  * @see https://developers.facebook.com/docs/facebook-login/security#appsecret
  */
  readonly clientSecret: string;
  /**
  * The list of facebook permissions to obtain for getting access to the Facebook profile.
  * @see https://developers.facebook.com/docs/facebook-login/permissions
  * @default [ public_profile ]
  */
  readonly scopes?: string[];
  /**
  * The Facebook API version to use
  * @default - to the oldest version supported by Facebook
  */
  readonly apiVersion?: string;
}

/**
* Represents a identity provider that integrates with 'Facebook Login'
* @resource AWS::Cognito::UserPoolIdentityProvider
*/
export class UserPoolIdentityProviderFacebook extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderFacebookProps) {
    super(scope, id, props);

    const scopes = props.scopes ?? ['public_profile'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'Facebook', // must be 'Facebook' when the type is 'Facebook'
      providerType: 'Facebook',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(','),
        api_version: props.apiVersion,
      },
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}


/**
 * Properties to initialize UserPoolGoogleIdentityProvider
 */
export interface UserPoolIdentityProviderGoogleProps extends UserPoolIdentityProviderProps {
  /**
   * The client id recognized by Google APIs.
   * @see https://developers.google.com/identity/sign-in/web/sign-in#specify_your_apps_client_id
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientId for Google APIs to authenticate the client.
   * @see https://developers.google.com/identity/sign-in/web/sign-in
   */
  readonly clientSecret: string;
  /**
   * The list of google permissions to obtain for getting access to the google profile
   * @see https://developers.google.com/identity/sign-in/web/sign-in
   * @default [ profile ]
   */
  readonly scopes?: string[];
}

/**
 * Represents a identity provider that integrates with 'Google'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderGoogle extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderGoogleProps) {
    super(scope, id, props);

    const scopes = props.scopes ?? ['profile'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'Google', // must be 'Google' when the type is 'Google'
      providerType: 'Google',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(' '),
      },
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}