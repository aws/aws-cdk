import {
  CfnIdentityPool,
} from '@aws-cdk/aws-cognito';
import {
  IOpenIdConnectProvider,
  ISamlProvider,
  Role,
  FederatedPrincipal,
  IRole,
} from '@aws-cdk/aws-iam';
import {
  Resource,
  IResource,
  Stack,
  ArnFormat,
  Lazy,
} from '@aws-cdk/core';
import {
  Construct,
} from 'constructs';
import {
  IdentityPoolRoleAttachment,
  IdentityPoolRoleMapping,
} from './identitypool-role-attachment';
import {
  IUserPoolAuthenticationProvider,
} from './identitypool-user-pool-authentication-provider';

/**
 * Represents a Cognito IdentityPool
 */
export interface IIdentityPool extends IResource {
  /**
   * The id of the Identity Pool in the format REGION:GUID
   * @attribute
   */
  readonly identityPoolId: string;

  /**
   * The ARN of the Identity Pool
   * @attribute
   */
  readonly identityPoolArn: string;

  /**
   * Name of the Identity Pool
   * @attribute
   */
  readonly identityPoolName: string
}

/**
 * Props for the IdentityPool construct
 */
export interface IdentityPoolProps {

  /**
   * The name of the Identity Pool
   * @default - automatically generated name by CloudFormation at deploy time
   */
  readonly identityPoolName?: string;

  /**
   * The Default Role to be assumed by Authenticated Users
   * @default - A Default Authenticated Role will be added
   */
  readonly authenticatedRole?: IRole;

  /**
   * The Default Role to be assumed by Unauthenticated Users
   * @default - A Default Unauthenticated Role will be added
   */
  readonly unauthenticatedRole?: IRole;

  /**
   * Wwhether the identity pool supports unauthenticated logins
   * @default - false
   */
  readonly allowUnauthenticatedIdentities?: boolean

  /**
   * Rules for mapping roles to users
   * @default - no Role Mappings
   */
  readonly roleMappings?: IdentityPoolRoleMapping[];

  /**
   * Enables the Basic (Classic) authentication flow
   * @default - Classic Flow not allowed
   */
  readonly allowClassicFlow?: boolean;

  /**
   * Authentication providers for using in identity pool.
   * @default - No Authentication Providers passed directly to Identity Pool
   */
  readonly authenticationProviders?: IdentityPoolAuthenticationProviders
}

/**
 * Types of Identity Pool Login Providers
 */
export enum IdentityPoolProviderType {
  /** Facebook Provider type */
  FACEBOOK = 'Facebook',
  /** Google Provider Type */
  GOOGLE = 'Google',
  /** Amazon Provider Type */
  AMAZON = 'Amazon',
  /** Apple Provider Type */
  APPLE = 'Apple',
  /** Twitter Provider Type */
  TWITTER = 'Twitter',
  /** Digits Provider Type */
  DIGITS = 'Digits',
  /** Open Id Provider Type */
  OPEN_ID = 'OpenId',
  /** Saml Provider Type */
  SAML = 'Saml',
  /** User Pool Provider Type */
  USER_POOL = 'UserPool',
  /** Custom Provider Type */
  CUSTOM = 'Custom',
}

/**
 * Keys for Login Providers - correspond to client id's of respective federation identity providers
 */
export class IdentityPoolProviderUrl {
  /** Facebook Provider Url */
  public static readonly FACEBOOK = new IdentityPoolProviderUrl(IdentityPoolProviderType.FACEBOOK, 'graph.facebook.com');

  /** Google Provider Url */
  public static readonly GOOGLE = new IdentityPoolProviderUrl(IdentityPoolProviderType.GOOGLE, 'accounts.google.com');

  /** Amazon Provider Url */
  public static readonly AMAZON = new IdentityPoolProviderUrl(IdentityPoolProviderType.AMAZON, 'www.amazon.com');

  /** Apple Provider Url */
  public static readonly APPLE = new IdentityPoolProviderUrl(IdentityPoolProviderType.APPLE, 'appleid.apple.com');

  /** Twitter Provider Url */
  public static readonly TWITTER = new IdentityPoolProviderUrl(IdentityPoolProviderType.TWITTER, 'api.twitter.com');

  /** Digits Provider Url */
  public static readonly DIGITS = new IdentityPoolProviderUrl(IdentityPoolProviderType.DIGITS, 'www.digits.com');

  /** OpenId Provider Url */
  public static openId(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.OPEN_ID, url);
  }

  /** Saml Provider Url */
  public static saml(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.SAML, url);
  }

  /** User Pool Provider Url */
  public static userPool(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.USER_POOL, url);
  }

  /** Custom Provider Url */
  public static custom(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.CUSTOM, url);
  }

  constructor(
    /** type of Provider Url */
    public readonly type: IdentityPoolProviderType,
    /** value of Provider Url */
    public readonly value: string,
  ) {}
}

/**
 * Login Provider for Identity Federation using Amazon Credentials
 */
export interface IdentityPoolAmazonLoginProvider {
  /**
   * App Id for Amazon Identity Federation
   */
  readonly appId: string
}

/**
 * Login Provider for Identity Federation using Facebook Credentials
 */
export interface IdentityPoolFacebookLoginProvider {
  /**
   * App Id for Facebook Identity Federation
   */
  readonly appId: string
}

/**
 * Login Provider for Identity Federation using Apple Credentials
*/
export interface IdentityPoolAppleLoginProvider {
  /**
   * App Id for Apple Identity Federation
  */
  readonly servicesId: string
}

/**
 * Login Provider for Identity Federation using Google Credentials
 */
export interface IdentityPoolGoogleLoginProvider {
  /**
   * App Id for Google Identity Federation
   */
  readonly clientId: string
}

/**
 * Login Provider for Identity Federation using Twitter Credentials
 */
export interface IdentityPoolTwitterLoginProvider {
  /**
   * App Id for Twitter Identity Federation
   */
  readonly consumerKey: string

  /**
   * App Secret for Twitter Identity Federation
   */
  readonly consumerSecret: string
}

/**
 * Login Provider for Identity Federation using Digits Credentials
 */
export interface IdentityPoolDigitsLoginProvider extends IdentityPoolTwitterLoginProvider {}

/**
 * External Identity Providers To Connect to User Pools and Identity Pools
 */
export interface IdentityPoolProviders {

  /** App Id for Facebook Identity Federation
   * @default - No Facebook Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly facebook?: IdentityPoolFacebookLoginProvider

  /** Client Id for Google Identity Federation
   * @default - No Google Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly google?: IdentityPoolGoogleLoginProvider

  /** App Id for Amazon Identity Federation
   * @default -  No Amazon Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly amazon?: IdentityPoolAmazonLoginProvider

  /** Services Id for Apple Identity Federation
   * @default - No Apple Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly apple?: IdentityPoolAppleLoginProvider

  /** Consumer Key and Secret for Twitter Identity Federation
   * @default - No Twitter Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly twitter?: IdentityPoolTwitterLoginProvider

  /** Consumer Key and Secret for Digits Identity Federation
   * @default - No Digits Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly digits?: IdentityPoolDigitsLoginProvider
}

/**
* Authentication providers for using in identity pool.
* @see https://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html
*/
export interface IdentityPoolAuthenticationProviders extends IdentityPoolProviders {

  /**
   * The User Pool Authentication Providers associated with this Identity Pool
   * @default - no User Pools Associated
   */
  readonly userPools?: IUserPoolAuthenticationProvider[];

  /**
   * The OpenIdConnect Provider associated with this Identity Pool
   * @default - no OpenIdConnectProvider
  */
  readonly openIdConnectProviders?: IOpenIdConnectProvider[];

  /**
   * The Security Assertion Markup Language Provider associated with this Identity Pool
   * @default - no SamlProvider
  */
  readonly samlProviders?: ISamlProvider[];

  /**
   * The Developer Provider Name to associate with this Identity Pool
   * @default - no Custom Provider
  */
  readonly customProvider?: string;
}

/**
 * Define a Cognito Identity Pool
 *
 *  @resource AWS::Cognito::IdentityPool
 */
export class IdentityPool extends Resource implements IIdentityPool {

  /**
   * Import an existing Identity Pool from its id
   */
  public static fromIdentityPoolId(scope: Construct, id: string, identityPoolId: string): IIdentityPool {
    const identityPoolArn = Stack.of(scope).formatArn({
      service: 'cognito-identity',
      resource: 'identitypool',
      resourceName: identityPoolId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });

    return IdentityPool.fromIdentityPoolArn(scope, id, identityPoolArn);
  }

  /**
   * Import an existing Identity Pool from its Arn
   */
  public static fromIdentityPoolArn(scope: Construct, id: string, identityPoolArn: string): IIdentityPool {
    const pool = Stack.of(scope).splitArn(identityPoolArn, ArnFormat.SLASH_RESOURCE_NAME);
    const res = pool.resourceName || '';
    if (!res) {
      throw new Error('Invalid Identity Pool ARN');
    }
    const idParts = res.split(':');
    if (!(idParts.length === 2)) throw new Error('Invalid Identity Pool Id: Identity Pool Ids must follow the format <region>:<id>');
    if (idParts[0] !== pool.region) throw new Error('Invalid Identity Pool Id: Region in Identity Pool Id must match stack region');
    class ImportedIdentityPool extends Resource implements IIdentityPool {
      public readonly identityPoolId = res;
      public readonly identityPoolArn = identityPoolArn;
      public readonly identityPoolName: string
      constructor() {
        super(scope, id, {
          account: pool.account,
          region: pool.region,
        });
        this.identityPoolName = this.physicalName;
      }
    }
    return new ImportedIdentityPool();
  }

  /**
   * The id of the Identity Pool in the format REGION:GUID
   * @attribute
   */
  public readonly identityPoolId: string;

  /**
   * The ARN of the Identity Pool
   * @attribute
   */
  public readonly identityPoolArn: string;

  /**
   * The name of the Identity Pool
   * @attribute
   */
  public readonly identityPoolName: string;

  /**
   * Default role for authenticated users
   */
  public readonly authenticatedRole: IRole;

  /**
    * Default role for unauthenticated users
    */
  public readonly unauthenticatedRole: IRole;

  /**
   * List of Identity Providers added in constructor for use with property overrides
   */
  private cognitoIdentityProviders: CfnIdentityPool.CognitoIdentityProviderProperty[] = [];

  /**
   * Running count of added role attachments
   */
  private roleAttachmentCount: number = 0;

  constructor(scope: Construct, id: string, props:IdentityPoolProps = {}) {
    super(scope, id, {
      physicalName: props.identityPoolName,
    });
    const authProviders: IdentityPoolAuthenticationProviders = props.authenticationProviders || {};
    const providers = authProviders.userPools ? authProviders.userPools.map(userPool => userPool.bind(this)) : undefined;
    if (providers && providers.length) this.cognitoIdentityProviders = providers;
    const openIdConnectProviderArns = authProviders.openIdConnectProviders ?
      authProviders.openIdConnectProviders.map(openIdProvider =>
        openIdProvider.openIdConnectProviderArn,
      ) : undefined;
    const samlProviderArns = authProviders.samlProviders ?
      authProviders.samlProviders.map(samlProvider =>
        samlProvider.samlProviderArn,
      ) : undefined;

    let supportedLoginProviders:any = {};
    if (authProviders.amazon) supportedLoginProviders[IdentityPoolProviderUrl.AMAZON.value] = authProviders.amazon.appId;
    if (authProviders.facebook) supportedLoginProviders[IdentityPoolProviderUrl.FACEBOOK.value] = authProviders.facebook.appId;
    if (authProviders.google) supportedLoginProviders[IdentityPoolProviderUrl.GOOGLE.value] = authProviders.google.clientId;
    if (authProviders.apple) supportedLoginProviders[IdentityPoolProviderUrl.APPLE.value] = authProviders.apple.servicesId;
    if (authProviders.twitter) supportedLoginProviders[IdentityPoolProviderUrl.TWITTER.value] = `${authProviders.twitter.consumerKey};${authProviders.twitter.consumerSecret}`;
    if (authProviders.digits) supportedLoginProviders[IdentityPoolProviderUrl.DIGITS.value] = `${authProviders.digits.consumerKey};${authProviders.digits.consumerSecret}`;
    if (!Object.keys(supportedLoginProviders).length) supportedLoginProviders = undefined;

    const cfnIdentityPool = new CfnIdentityPool(this, 'Resource', {
      allowUnauthenticatedIdentities: props.allowUnauthenticatedIdentities ? true : false,
      allowClassicFlow: props.allowClassicFlow,
      identityPoolName: this.physicalName,
      developerProviderName: authProviders.customProvider,
      openIdConnectProviderArns,
      samlProviderArns,
      supportedLoginProviders,
      cognitoIdentityProviders: Lazy.any({ produce: () => this.cognitoIdentityProviders }),
    });
    this.identityPoolName = cfnIdentityPool.attrName;
    this.identityPoolId = cfnIdentityPool.ref;
    this.identityPoolArn = Stack.of(scope).formatArn({
      service: 'cognito-identity',
      resource: 'identitypool',
      resourceName: this.identityPoolId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    this.authenticatedRole = props.authenticatedRole ? props.authenticatedRole : this.configureDefaultRole('Authenticated');
    this.unauthenticatedRole = props.unauthenticatedRole ? props.unauthenticatedRole : this.configureDefaultRole('Unauthenticated');
    const attachment = new IdentityPoolRoleAttachment(this, 'DefaultRoleAttachment', {
      identityPool: this,
      authenticatedRole: this.authenticatedRole,
      unauthenticatedRole: this.unauthenticatedRole,
      roleMappings: props.roleMappings,
    });

    // This added by the original author, but it's causing cyclic dependencies.
    // Don't know why this was added in the first place, but I'm disabling it for now and if
    // no complaints come from this, we're probably safe to remove it altogether.
    // attachment.node.addDependency(this);
    Array.isArray(attachment);
  }

  /**
   * Add a User Pool to the IdentityPool and configure User Pool Client to handle identities
   */
  public addUserPoolAuthentication(userPool: IUserPoolAuthenticationProvider): void {
    const providers = userPool.bind(this);
    this.cognitoIdentityProviders = this.cognitoIdentityProviders.concat(providers);
  }

  /**
   * Adds Role Mappings to Identity Pool
  */
  public addRoleMappings(...roleMappings: IdentityPoolRoleMapping[]): void {
    if (!roleMappings || !roleMappings.length) return;
    this.roleAttachmentCount++;
    const name = 'RoleMappingAttachment' + this.roleAttachmentCount.toString();
    const attachment = new IdentityPoolRoleAttachment(this, name, {
      identityPool: this,
      authenticatedRole: this.authenticatedRole,
      unauthenticatedRole: this.unauthenticatedRole,
      roleMappings,
    });

    // This added by the original author, but it's causing cyclic dependencies.
    // Don't know why this was added in the first place, but I'm disabling it for now and if
    // no complaints come from this, we're probably safe to remove it altogether.
    // attachment.node.addDependency(this);
    Array.isArray(attachment);
  }

  /**
   * Configure Default Roles For Identity Pool
   */
  private configureDefaultRole(type: string): IRole {
    const assumedBy = this.configureDefaultGrantPrincipal(type.toLowerCase());
    const role = new Role(this, `${type}Role`, {
      description: `Default ${type} Role for Identity Pool ${this.identityPoolName}`,
      assumedBy,
    });

    return role;
  }

  private configureDefaultGrantPrincipal(type: string) {
    return new FederatedPrincipal('cognito-identity.amazonaws.com', {
      'StringEquals': {
        'cognito-identity.amazonaws.com:aud': this.identityPoolId,
      },
      'ForAnyValue:StringLike': {
        'cognito-identity.amazonaws.com:amr': type,
      },
    }, 'sts:AssumeRoleWithWebIdentity');
  }
}