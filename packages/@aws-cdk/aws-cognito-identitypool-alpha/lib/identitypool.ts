import { CfnIdentityPool, IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IOpenIdConnectProvider, ISamlProvider, Role, FederatedPrincipal, IRole } from 'aws-cdk-lib/aws-iam';
import { Resource, IResource, Stack, ArnFormat, Lazy, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IdentityPoolRoleAttachment, IdentityPoolRoleMapping } from './identitypool-role-attachment';
import { IUserPoolAuthenticationProvider } from './identitypool-user-pool-authentication-provider';

/**
 * Represents a Cognito identity pool
 */
export interface IIdentityPool extends IResource {
  /**
   * The ID of the identity pool in the format REGION:GUID
   * @attribute
   */
  readonly identityPoolId: string;

  /**
   * The ARN of the identity pool
   * @attribute
   */
  readonly identityPoolArn: string;

  /**
   * Name of the identity pool
   * @attribute
   */
  readonly identityPoolName: string;
}

/**
 * Props for the identity pool construct
 */
export interface IdentityPoolProps {
  /**
   * The name of the identity pool
   * @default - Automatically generated name by CloudFormation at deploy time
   */
  readonly identityPoolName?: string;

  /**
   * The default role to be assumed by authenticated users
   * @default - A default authenticated role will be added
   */
  readonly authenticatedRole?: IRole;

  /**
   * The default role to be assumed by unauthenticated users
   * @default - A default unauthenticated Role will be added
   */
  readonly unauthenticatedRole?: IRole;

  /**
   * Whether the identity pool supports unauthenticated logins
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
   * Authentication providers for using in identity pool
   * @default - No authentication providers passed directly to identity pool
   */
  readonly authenticationProviders?: IdentityPoolAuthenticationProviders;
}

/**
 * Types of identity pool login providers
 */
export enum IdentityPoolProviderType {
  FACEBOOK = 'Facebook',
  GOOGLE = 'Google',
  AMAZON = 'Amazon',
  APPLE = 'Apple',
  TWITTER = 'Twitter',
  DIGITS = 'Digits',
  OPEN_ID = 'OpenId',
  SAML = 'Saml',
  USER_POOL = 'UserPool',
  CUSTOM = 'Custom',
}

/**
 * Keys for login providers - each correspond to the client IDs of their respective federation identity providers
 */
export class IdentityPoolProviderUrl {
  public static readonly FACEBOOK = new IdentityPoolProviderUrl(IdentityPoolProviderType.FACEBOOK, 'graph.facebook.com');

  public static readonly GOOGLE = new IdentityPoolProviderUrl(IdentityPoolProviderType.GOOGLE, 'accounts.google.com');

  public static readonly AMAZON = new IdentityPoolProviderUrl(IdentityPoolProviderType.AMAZON, 'www.amazon.com');

  public static readonly APPLE = new IdentityPoolProviderUrl(IdentityPoolProviderType.APPLE, 'appleid.apple.com');

  public static readonly TWITTER = new IdentityPoolProviderUrl(IdentityPoolProviderType.TWITTER, 'api.twitter.com');

  public static readonly DIGITS = new IdentityPoolProviderUrl(IdentityPoolProviderType.DIGITS, 'www.digits.com');

  /** OpenId provider url */
  public static openId(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.OPEN_ID, url);
  }

  /** Saml provider url */
  public static saml(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.SAML, url);
  }

  /** User pool provider Url */
  public static userPool(userPool: IUserPool, userPoolClient: IUserPoolClient): IdentityPoolProviderUrl {
    const url = `${userPool.userPoolProviderName}:${userPoolClient.userPoolClientId}`;
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.USER_POOL, url);
  }

  /** Custom provider url */
  public static custom(url: string): IdentityPoolProviderUrl {
    return new IdentityPoolProviderUrl(IdentityPoolProviderType.CUSTOM, url);
  }

  constructor(
    public readonly type: IdentityPoolProviderType,
    public readonly value: string,
  ) {}
}

/**
 * Authentication provider for external third-party identity federation
 */
export interface IdentityPoolAuthenticationProvider {
  /**
   * Client ID for identity federation
   */
  readonly clientId: string;
}

/**
 * Login provider for identity federation using Amazon credentials
 */
export interface IdentityPoolAmazonLoginProvider extends IdentityPoolAuthenticationProvider {}

/**
 * Login provider for identity federation using Facebook credentials
 */
export interface IdentityPoolFacebookLoginProvider extends IdentityPoolAuthenticationProvider {}

/**
 * Login provider for identity federation using Apple credentials
*/
export interface IdentityPoolAppleLoginProvider extends IdentityPoolAuthenticationProvider {}

/**
 * Login provider for identity federation using Google credentials
 */
export interface IdentityPoolGoogleLoginProvider extends IdentityPoolAuthenticationProvider {}

/**
 * Login provider for identity federation using Twitter credentials
 */
export interface IdentityPoolTwitterLoginProvider extends IdentityPoolAuthenticationProvider {
  /**
   * Consumer secret for identity federation
   */
  readonly consumerSecret: string;
}

/**
 * Login provider for identity federation using Digits credentials
 * @deprecated As of September 30, 2017, the Digits Auth service has been deprecated.
 */
export interface IdentityPoolDigitsLoginProvider extends IdentityPoolTwitterLoginProvider {}

/**
 * Authentication providers for using in identity pool.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/external-identity-providers.html
 */
export interface IdentityPoolAuthenticationProviders {
  /** 
   * The Facebook authentication provider associated with this identity pool
   * @default - No Facebook authentication provider used without OpenIdConnect or a User Pool
   */
  readonly facebook?: IdentityPoolFacebookLoginProvider;

  /**
   * The Google authentication provider associated with this identity pool
   * @default - No Google authentication provider used without OpenIdConnect or a user pool
   */
  readonly google?: IdentityPoolGoogleLoginProvider;

  /**
   * The Amazon authentication provider associated with this identity pool
   * @default -  No Amazon authentication provider used without OpenIdConnect or a user pool
   */
  readonly amazon?: IdentityPoolAmazonLoginProvider;

  /**
   * The Apple authentication provider associated with this identity pool
   * @default - No Apple authentication provider used without OpenIdConnect or a user pool
   */
  readonly apple?: IdentityPoolAppleLoginProvider;

  /**
   * The Twitter authentication provider associated with this identity pool
   * @default - No Twitter authentication provider used without OpenIdConnect or a user pool
   */
  readonly twitter?: IdentityPoolTwitterLoginProvider;

  /**
   * The Digits authentication provider associated with this identity pool
   * @default - No Digits authentication provider used without OpenIdConnect or a user pool
   * @deprecated As of September 30, 2017, the Digits Auth service has been deprecated.
   */
  readonly digits?: IdentityPoolDigitsLoginProvider;

  /**
   * The user pool authentication providers associated with this identity pool
   * @default - no user pools associated
   */
  readonly userPools?: IUserPoolAuthenticationProvider[];

  /**
   * The OpenIdConnect provider associated with this identity pool
   * @default - no OpenIdConnectProvider
   */
  readonly openIdConnectProviders?: IOpenIdConnectProvider[];

  /**
   * The Security Assertion Markup Language provider associated with this identity pool
   * @default - no SamlProvider
   */
  readonly samlProviders?: ISamlProvider[];

  /**
   * The developer provider name to associate with this identity pool
   * @default - no custom provider
   */
  readonly customProvider?: string;
}

/**
 * Define a Cognito identity pool
 *
 * @resource AWS::Cognito::IdentityPool
 */
export class IdentityPool extends Resource implements IIdentityPool {
  /**
   * Import an existing identity pool from its ID
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
   * Import an existing identity pool from its ARN
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
   * The ID of the identity pool in the format REGION:GUID
   * @attribute
   */
  public readonly identityPoolId: string;

  /**
   * The ARN of the identity pool
   * @attribute
   */
  public readonly identityPoolArn: string;

  /**
   * The name of the identity pool
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
   * List of identity providers added in constructor for use with property overrides
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
    if (authProviders.amazon) supportedLoginProviders[IdentityPoolProviderUrl.AMAZON.value] = authProviders.amazon.clientId;
    if (authProviders.facebook) supportedLoginProviders[IdentityPoolProviderUrl.FACEBOOK.value] = authProviders.facebook.clientId;
    if (authProviders.google) supportedLoginProviders[IdentityPoolProviderUrl.GOOGLE.value] = authProviders.google.clientId;
    if (authProviders.apple) supportedLoginProviders[IdentityPoolProviderUrl.APPLE.value] = authProviders.apple.clientId;
    if (authProviders.twitter) supportedLoginProviders[IdentityPoolProviderUrl.TWITTER.value] = `${authProviders.twitter.clientId};${authProviders.twitter.consumerSecret}`;
    if (authProviders.digits) supportedLoginProviders[IdentityPoolProviderUrl.DIGITS.value] = `${authProviders.digits.clientId};${authProviders.digits.consumerSecret}`;
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
   * Add a user pool to the identity pool and configure the user pool client to handle identities
   */
  public addUserPoolAuthentication(userPool: IUserPoolAuthenticationProvider): void {
    const providers = userPool.bind(this, this);
    this.cognitoIdentityProviders = this.cognitoIdentityProviders.concat(providers);
  }

  /**
   * Add role mappings to the identity pool
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
   * Configure default roles for identity pool
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
