import { CfnIdentityPool, IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IOpenIdConnectProvider, ISamlProvider, Role, FederatedPrincipal, IRole } from 'aws-cdk-lib/aws-iam';
import { Resource, IResource, Stack, ArnFormat, Lazy, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IdentityPoolRoleAttachment, IdentityPoolRoleMapping } from './identitypool-role-attachment';
import { IUserPoolAuthenticationProvider } from './identitypool-user-pool-authentication-provider';

/**
 * Represents a Cognito Identity Pool
 */
export interface IIdentityPool extends IResource {
  /**
   * The ID of the Identity Pool in the format REGION:GUID
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
  readonly identityPoolName: string;
}

/**
 * Props for the Identity Pool construct
 */
export interface IdentityPoolProps {
  /**
   * The name of the Identity Pool
   * @default - Automatically generated name by CloudFormation at deploy time
   */
  readonly identityPoolName?: string;

  /**
   * The default Role to be assumed by authenticated users
   * @default - A default authenticated Role will be added
   */
  readonly authenticatedRole?: IRole;

  /**
   * The default Role to be assumed by unauthenticated users
   * @default - A default unauthenticated Role will be added
   */
  readonly unauthenticatedRole?: IRole;

  /**
   * Whether the Identity Pool supports unauthenticated logins
   * @default - false
   */
  readonly allowUnauthenticatedIdentities?: boolean;

  /**
   * Rules for mapping roles to users
   * @default - no role mappings
   */
  readonly roleMappings?: IdentityPoolRoleMapping[];

  /**
   * Enables the Basic (Classic) authentication flow
   * @default - Classic Flow not allowed
   */
  readonly allowClassicFlow?: boolean;

  /**
   * Authentication Providers for using in Identity Pool
   * @default - No Authentication Providers passed directly to Identity Pool
   */
  readonly authenticationProviders?: IdentityPoolAuthenticationProviders;
}

/**
 * Types of Identity Pool Login Providers
 */
export enum IdentityPoolProviderType {
  /** Facebook provider type */
  FACEBOOK = 'Facebook',
  /** Google provider type */
  GOOGLE = 'Google',
  /** Amazon provider type */
  AMAZON = 'Amazon',
  /** Apple provider type */
  APPLE = 'Apple',
  /** Twitter provider type */
  TWITTER = 'Twitter',
  /** Open Id provider type */
  OPEN_ID = 'OpenId',
  /** Saml provider type */
  SAML = 'Saml',
  /** User Pool provider type */
  USER_POOL = 'UserPool',
  /** Custom provider type */
  CUSTOM = 'Custom',
}

/**
 * Keys for Login Providers - each correspond to the client IDs of their respective federation Identity Providers
 */
export class IdentityPoolProviderUrl {
  /** Facebook Provider url */
  public static readonly FACEBOOK = new IdentityPoolProviderUrl(IdentityPoolProviderType.FACEBOOK, 'graph.facebook.com');

  /** Google Provider url */
  public static readonly GOOGLE = new IdentityPoolProviderUrl(IdentityPoolProviderType.GOOGLE, 'accounts.google.com');

  /** Amazon Provider url */
  public static readonly AMAZON = new IdentityPoolProviderUrl(IdentityPoolProviderType.AMAZON, 'www.amazon.com');

  /** Apple Provider url */
  public static readonly APPLE = new IdentityPoolProviderUrl(IdentityPoolProviderType.APPLE, 'appleid.apple.com');

  /** Twitter Provider url */
  public static readonly TWITTER = new IdentityPoolProviderUrl(IdentityPoolProviderType.TWITTER, 'api.twitter.com');

  /** OpenId Provider url */
  public static openId(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.OPEN_ID, url);
  }

  /** Saml Provider url */
  public static saml(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.SAML, url);
  }

  /** User Pool Provider Url */
  public static userPool(userPool: IUserPool, userPoolClient: IUserPoolClient): IdentityPoolProviderUrl {
    const url = `${userPool.userPoolProviderName}:${userPoolClient.userPoolClientId}`;
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.USER_POOL, url);
  }

  /** Custom Provider url */
  public static custom(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.CUSTOM, url);
  }

  constructor(
    /**
     * The type of Identity Pool Provider
     */
    public readonly type: IdentityPoolProviderType,

    /**
     * The value of the Identity Pool Provider
     */
    public readonly value: string,
  ) {}
}

/**
 * Login Provider for identity federation using Amazon credentials
 */
export interface IdentityPoolAmazonLoginProvider {
  /**
   * App ID for Amazon identity federation
   */
  readonly appId: string;
}

/**
 * Login Provider for identity federation using Facebook credentials
 */
export interface IdentityPoolFacebookLoginProvider {
  /**
   * App ID for Facebook identity federation
   */
  readonly appId: string;
}

/**
 * Login Provider for identity federation using Apple credentials
*/
export interface IdentityPoolAppleLoginProvider {
  /**
   * Services ID for Apple identity federation
   */
  readonly servicesId: string;
}

/**
 * Login Provider for identity federation using Google credentials
 */
export interface IdentityPoolGoogleLoginProvider {
  /**
   * Client ID for Google identity federation
   */
  readonly clientId: string;
}

/**
 * Login Provider for identity federation using Twitter credentials
 */
export interface IdentityPoolTwitterLoginProvider {
  /**
   * Consumer key for Twitter identity federation
   */
  readonly consumerKey: string;

  /**
   * Consumer secret for identity federation
   */
  readonly consumerSecret: string;
}

/**
 * External Authentication Providers for usage in Identity Pool.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html
 */
export interface IdentityPoolAuthenticationProviders {
  /**
   * The Facebook Authentication Provider associated with this Identity Pool
   * @default - No Facebook Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly facebook?: IdentityPoolFacebookLoginProvider;

  /**
   * The Google Authentication Provider associated with this Identity Pool
   * @default - No Google Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly google?: IdentityPoolGoogleLoginProvider;

  /**
   * The Amazon Authentication Provider associated with this Identity Pool
   * @default -  No Amazon Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly amazon?: IdentityPoolAmazonLoginProvider;

  /**
   * The Apple Authentication Provider associated with this Identity Pool
   * @default - No Apple Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly apple?: IdentityPoolAppleLoginProvider;

  /**
   * The Twitter Authentication Provider associated with this Identity Pool
   * @default - No Twitter Authentication Provider used without OpenIdConnect or a User Pool
   */
  readonly twitter?: IdentityPoolTwitterLoginProvider;

  /**
   * The User Pool Authentication Providers associated with this Identity Pool
   * @default - no User Pools associated
   */
  readonly userPools?: IUserPoolAuthenticationProvider[];

  /**
   * The OpenIdConnect Provider associated with this Identity Pool
   * @default - no OpenIdConnectProvider
   */
  readonly openIdConnectProviders?: IOpenIdConnectProvider[];

  /**
   * The Security Assertion Markup Language provider associated with this Identity Pool
   * @default - no SamlProvider
   */
  readonly samlProviders?: ISamlProvider[];

  /**
   * The developer provider name to associate with this Identity Pool
   * @default - no custom provider
   */
  readonly customProvider?: string;
}

/**
 * Define a Cognito Identity Pool
 *
 * @resource AWS::Cognito::IdentityPool
 */
export class IdentityPool extends Resource implements IIdentityPool {
  /**
   * Import an existing Identity Pool from its ID
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
   * Import an existing Identity Pool from its ARN
   */
  public static fromIdentityPoolArn(scope: Construct, id: string, identityPoolArn: string): IIdentityPool {
    const pool = Stack.of(scope).splitArn(identityPoolArn, ArnFormat.SLASH_RESOURCE_NAME);
    const res = pool.resourceName || '';
    if (!res) {
      throw new Error('Invalid Identity Pool ARN');
    }
    if (!Token.isUnresolved(res)) {
      const idParts = res.split(':');
      if (!(idParts.length === 2)) {
        throw new Error('Invalid Identity Pool Id: Identity Pool Ids must follow the format <region>:<id>');
      }
      if (!Token.isUnresolved(pool.region) && idParts[0] !== pool.region) {
        throw new Error('Invalid Identity Pool Id: Region in Identity Pool Id must match stack region');
      }
    }
    class ImportedIdentityPool extends Resource implements IIdentityPool {
      public readonly identityPoolId = res;
      public readonly identityPoolArn = identityPoolArn;
      public readonly identityPoolName: string;
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
   * The ID of the Identity Pool in the format REGION:GUID
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
   * Default Role for authenticated users
   */
  public readonly authenticatedRole: IRole;

  /**
   * Default Role for unauthenticated users
   */
  public readonly unauthenticatedRole: IRole;

  /**
   * List of Identity Providers added in constructor for use with property overrides
   */
  private cognitoIdentityProviders: CfnIdentityPool.CognitoIdentityProviderProperty[] = [];

  /**
   * Running count of added Role Attachments
   */
  private roleAttachmentCount: number = 0;

  constructor(scope: Construct, id: string, props:IdentityPoolProps = {}) {
    super(scope, id, {
      physicalName: props.identityPoolName,
    });
    const authProviders: IdentityPoolAuthenticationProviders = props.authenticationProviders || {};
    const providers = authProviders.userPools ? authProviders.userPools.map(userPool => userPool.bind(this, this)) : undefined;
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

    Array.isArray(attachment);
  }

  /**
   * Add a User Pool to the Identity Pool and configure the User Pool client to handle identities
   */
  public addUserPoolAuthentication(userPool: IUserPoolAuthenticationProvider): void {
    const providers = userPool.bind(this, this);
    this.cognitoIdentityProviders = this.cognitoIdentityProviders.concat(providers);
  }

  /**
   * Add Role Mappings to the Identity Pool
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

    Array.isArray(attachment);
  }

  /**
   * Configure default Roles for Identity Pool
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
