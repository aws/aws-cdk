import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IOpenIdConnectProvider, ISamlProvider, Role, FederatedPrincipal, IRole } from 'aws-cdk-lib/aws-iam';
import { Resource, IResource, Stack, ArnFormat, Lazy, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IUserPoolAuthenticationProvider } from './identitypool-user-pool-authentication-provider';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

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
 * Map roles to users in the Identity Pool based on claims from the Identity Provider
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
 */
export interface IdentityPoolRoleMapping {
  /**
   * The url of the Provider for which the role is mapped
   */
  readonly providerUrl: IdentityPoolProviderUrl;

  /**
   * The key used for the role mapping in the role mapping hash. Required if the providerUrl is a token.
   * @default - The provided providerUrl
   */
  readonly mappingKey?: string;

  /**
   * If true then mapped roles must be passed through the cognito:roles or cognito:preferred_role claims from Identity Provider.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/role-based-access-control.html#using-tokens-to-assign-roles-to-users
   *
   * @default false
   */
  readonly useToken?: boolean;

  /**
   * Allow for role assumption when results of role mapping are ambiguous
   * @default false - Ambiguous role resolutions will lead to requester being denied
   */
  readonly resolveAmbiguousRoles?: boolean;

  /**
   * The claim and value that must be matched in order to assume the role. Required if useToken is false
   * @default - No role mapping rule
   */
  readonly rules?: RoleMappingRule[];
}

/**
 * Types of matches allowed for role mapping
 */
export enum RoleMappingMatchType {
  /**
   * The claim from the token must equal the given value in order for a match
   */
  EQUALS = 'Equals',

  /**
   * The claim from the token must contain the given value in order for a match
   */
  CONTAINS = 'Contains',

  /**
   * The claim from the token must start with the given value in order for a match
   */
  STARTS_WITH = 'StartsWith',

  /**
   * The claim from the token must not equal the given value in order for a match
   */
  NOTEQUAL = 'NotEqual',
}

/**
 * Represents an Identity Pool Role Attachment role mapping rule
 */
export interface RoleMappingRule {
  /**
   * The key sent in the token by the federated Identity Provider
   */
  readonly claim: string;

  /**
   * The role to be assumed when the claim value is matched
   */
  readonly mappedRole: IRole;

  /**
   * The value of the claim that must be matched
   */
  readonly claimValue: string;

  /**
   * How to match with the claim value
   *
   * @default RoleMappingMatchType.EQUALS
   */
  readonly matchType?: RoleMappingMatchType;
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
   * Role Provider for the default Role for authenticated users
   */
  private readonly roleAttachment: IdentityPoolRoleAttachment;

  /**
   * List of Identity Providers added in constructor for use with property overrides
   */
  private cognitoIdentityProviders: CfnIdentityPool.CognitoIdentityProviderProperty[] = [];

  constructor(scope: Construct, id: string, props: IdentityPoolProps = {}) {
    super(scope, id, {
      physicalName: props.identityPoolName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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

    // Set up Role Attachment
    this.roleAttachment = new IdentityPoolRoleAttachment(this, 'DefaultRoleAttachment', {
      identityPool: this,
      authenticatedRole: this.authenticatedRole,
      unauthenticatedRole: this.unauthenticatedRole,
      roleMappings: props.roleMappings,
    });

    Array.isArray(this.roleAttachment);
  }

  /**
   * Add a User Pool to the Identity Pool and configure the User Pool client to handle identities
   */
  @MethodMetadata()
  public addUserPoolAuthentication(userPool: IUserPoolAuthenticationProvider): void {
    const providers = userPool.bind(this, this);
    this.cognitoIdentityProviders = this.cognitoIdentityProviders.concat(providers);
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

/**
 * Represents an Identity Pool Role Attachment
 */
interface IIdentityPoolRoleAttachment extends IResource {
  /**
   * ID of the Attachment's underlying Identity Pool
   */
  readonly identityPoolId: string;
}

/**
 * Props for an Identity Pool Role Attachment
 */
interface IdentityPoolRoleAttachmentProps {

  /**
   * ID of the Attachment's underlying Identity Pool
   */
  readonly identityPool: IIdentityPool;

  /**
   * Default authenticated (User) Role
   * @default - No default authenticated Role will be added
   */
  readonly authenticatedRole?: IRole;

  /**
   * Default unauthenticated (Guest) Role
   * @default - No default unauthenticated Role will be added
   */
  readonly unauthenticatedRole?: IRole;

  /**
   * Rules for mapping roles to users
   * @default - No role mappings
   */
  readonly roleMappings?: IdentityPoolRoleMapping[];
}

/**
 * Defines an Identity Pool Role Attachment
 *
 * @resource AWS::Cognito::IdentityPoolRoleAttachment
 */
class IdentityPoolRoleAttachment extends Resource implements IIdentityPoolRoleAttachment {
  /**
   * ID of the underlying Identity Pool
   */
  public readonly identityPoolId: string;

  constructor(scope: Construct, id: string, props: IdentityPoolRoleAttachmentProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    this.identityPoolId = props.identityPool.identityPoolId;
    const mappings = props.roleMappings || [];
    let roles: any = undefined, roleMappings: any = undefined;
    if (props.authenticatedRole || props.unauthenticatedRole) {
      roles = {};
      if (props.authenticatedRole) roles.authenticated = props.authenticatedRole.roleArn;
      if (props.unauthenticatedRole) roles.unauthenticated = props.unauthenticatedRole.roleArn;
    }
    if (mappings) {
      roleMappings = this.configureRoleMappings(...mappings);
    }
    new CfnIdentityPoolRoleAttachment(this, 'Resource', {
      identityPoolId: this.identityPoolId,
      roles,
      roleMappings,
    });
  }

  /**
   * Configures role mappings for the Identity Pool Role Attachment
   */
  private configureRoleMappings(
    ...props: IdentityPoolRoleMapping[]
  ): { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty } | undefined {
    if (!props || !props.length) return undefined;
    return props.reduce((acc, prop) => {
      let mappingKey;
      if (prop.mappingKey) {
        mappingKey = prop.mappingKey;
      } else {
        const providerUrl = prop.providerUrl.value;
        if (Token.isUnresolved(providerUrl)) {
          throw new Error('mappingKey must be provided when providerUrl.value is a token');
        }
        mappingKey = providerUrl;
      }

      let roleMapping: any = {
        ambiguousRoleResolution: prop.resolveAmbiguousRoles ? 'AuthenticatedRole' : 'Deny',
        type: prop.useToken ? 'Token' : 'Rules',
        identityProvider: prop.providerUrl.value,
      };
      if (roleMapping.type === 'Rules') {
        if (!prop.rules) {
          throw new Error('IdentityPoolRoleMapping.rules is required when useToken is false');
        }
        roleMapping.rulesConfiguration = {
          rules: prop.rules.map(rule => {
            return {
              claim: rule.claim,
              value: rule.claimValue,
              matchType: rule.matchType || RoleMappingMatchType.EQUALS,
              roleArn: rule.mappedRole.roleArn,
            };
          }),
        };
      }
      acc[mappingKey] = roleMapping;
      return acc;
    }, {} as { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty });
  }
}
