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
  Names,
} from '@aws-cdk/core';
import {
  Construct,
} from 'constructs';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from './cognito.generated';
import {
  IUserPoolAuthenticationProvider,
} from './user-pool-authentication-provider';

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
   * The User Pool Authentication Provider associated with this Identity Pool
   * @default - no User Pools Associated
   */
  readonly userPool?: IUserPoolAuthenticationProvider;

  /**
   * The OpenIdConnect Provider associated with this Identity Pool
   * @default - no OpenIdConnectProvider
  */
  readonly openIdConnectProvider?: IOpenIdConnectProvider;

  /**
   * The Security Assertion Markup Language Provider associated with this Identity Pool
   * @default - no SamlProvider
  */
  readonly samlProvider?: ISamlProvider;

  /**
   * The Developer Provider Name to associate with this Identity Pool
   * @default - no Custom Provider
  */
  readonly customProvider?: string;
}

/**
 * Represents an Identity Pool Role Attachment
 */
export interface IIdentityPoolRoleAttachment extends IResource {
  /**
   * Id of the Attachments Underlying Identity Pool
   */
  readonly identityPoolId: string;
}

/**
 * Props for an Identity Pool Role Attachment
 */
export interface IdentityPoolRoleAttachmentProps {

  /**
   * The name of the Identity Pool Role Attachment
   * @default - automatically generated name by CloudFormation at deploy time
   */
  readonly identityPoolRoleAttachmentName?: string;

  /**
   * Id of the Attachments Underlying Identity Pool
   */
  readonly identityPool: IIdentityPool;

  /**
   * Default roles to apply when no role mapping conditions are met
   * @default - Default roles will be created
   */
  readonly roles?: IdentityPoolDefaultRoles

  /**
   * Rules for mapping roles to users
   * @default - no Role Mappings
   */
  readonly roleMappings?: IdentityPoolRoleMapping[];
}

/**
 * Default Roles Attached to Identity Pools
 */
export interface IdentityPoolDefaultRoles {
  /**
   * Default Authenticated (User) Role
   * @default - No default role will be added
   */
  readonly authenticated?: IRole;

  /**
   * Default Unauthenticated (Guest) Role
   * @default - No default role will be added
   */
  readonly unauthenticated?: IRole;
}

/**
 * Map roles to users in the identity pool based on claims from the Identity Provider
 *  @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypoolroleattachment.html
 */
export interface IdentityPoolRoleMapping {
  /**
   * The url of the provider of for which the role is mapped
   */
  readonly providerUrl: IdentityPoolProviderUrl;

  /**
   *  If true then mapped roles must be passed through the cognito:roles or cognito:preferred_role claims from identity provider.
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
   * @default - No Rule Mapping Rule
   */
  readonly rules?: RoleMappingRule[];
}

/**
 * Types of matches allowed for Role Mapping
 */
export enum RoleMappingMatchType {
  /**
   * The Claim from the token must equal the given value in order for a match
   */
  EQUALS = 'Equals',

  /**
   * The Claim from the token must contain the given value in order for a match
   */
  CONTAINS = 'Contains',

  /**
   * The Claim from the token must start with the given value in order for a match
   */
  STARTS_WITH = 'StartsWith',

  /**
   * The Claim from the token must not equal the given value in order for a match
   */
  NOTEQUAL = 'NotEqual',
}

/**
 * Represents an Identity Pool Role Attachment Role Mapping Rule
 */
export interface RoleMappingRule {
  /**
   * The key sent in the token by the federated identity provider.
   */
  readonly claim: string;

  /**
   * The Role to be assumed when Claim Value is matched.
   */
  readonly mappedRole: IRole;

  /**
   * The value of the claim that must be matched
   */
  readonly claimValue: string;

  /**
   * How to match with the Claim value
   * @default RoleMappingMatchType.EQUALS
  */
  readonly matchType?: RoleMappingMatchType
}

/**
 * Defines an Identity Pool Role Attachment
 */
export class IdentityPoolRoleAttachment extends Resource implements IIdentityPoolRoleAttachment {

  /**
   * Id of the underlying identity pool
   */
  public readonly identityPoolId: string

  constructor(scope: Construct, id: string, props: IdentityPoolRoleAttachmentProps) {
    super(scope, id, {
      physicalName: props.identityPoolRoleAttachmentName || Lazy.string({
        produce: () => Names.uniqueId(this).substring(0, 20),
      }),
    });
    this.identityPoolId = props.identityPool.identityPoolId;
    const authenticatedRole = props.roles?.authenticated;
    const unauthenticatedRole = props.roles?.unauthenticated;
    const mappings = props.roleMappings || [];
    let roles: any = undefined, roleMappings: any = undefined;
    if (authenticatedRole || unauthenticatedRole) {
      roles = {};
      if (authenticatedRole) roles.authenticated = authenticatedRole.roleArn;
      if (unauthenticatedRole) roles.unauthenticated = unauthenticatedRole.roleArn;
    }
    if (mappings) {
      roleMappings = this.configureRoleMappings(...mappings);
    }
    new CfnIdentityPoolRoleAttachment(this, id, {
      identityPoolId: this.identityPoolId,
      roles,
      roleMappings,
    });
  }

  /**
   * Configures Role Mappings for Identity Pool Role Attachment
   */
  private configureRoleMappings(
    ...props: IdentityPoolRoleMapping[]
  ): { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty } | undefined {
    if (!props || !props.length) return undefined;
    return props.reduce((acc, prop) => {
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
      };
      acc[prop.providerUrl.value] = roleMapping;
      return acc;
    }, {} as { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty });
  }
}

/**
 * Define a Cognito Identity Pool
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
   * The ARN of the Identity Pool
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
   * The Identity Pool Cloud Formation Construct
   */
  private cfnIdentityPool: CfnIdentityPool;

  /**
   * List of Identity Providers added in constructor for use with property overrides
   */
  private cognitoIdentityProviders: CfnIdentityPool.CognitoIdentityProviderProperty[] = [];

  /**
   * Running count of added role attachments
   */
  private roleAttachmentCount: number = 0;

  constructor(scope: Construct, private id: string, props:IdentityPoolProps = {}) {
    super(scope, id, {
      physicalName: props.identityPoolName || Lazy.string({
        produce: () => Names.uniqueId(this).substring(0, 20),
      }),
    });
    this.identityPoolName = this.physicalName;
    const authProviders: IdentityPoolAuthenticationProviders = props.authenticationProviders || {};
    const providers = this.configureUserPool(authProviders.userPool);
    if (providers && providers.length) this.cognitoIdentityProviders = providers;
    this.cfnIdentityPool = new CfnIdentityPool(this, id, {
      allowUnauthenticatedIdentities: props.allowUnauthenticatedIdentities ? true : false,
      allowClassicFlow: props.allowClassicFlow,
      identityPoolName: props.identityPoolName,
      developerProviderName: authProviders.customProvider,
      openIdConnectProviderArns: this.configureOpenIdConnectProviderArns(authProviders.openIdConnectProvider),
      samlProviderArns: this.configureSamlProviderArns(authProviders.samlProvider),
      supportedLoginProviders: this.configureLoginProviders(authProviders),
      cognitoIdentityProviders: providers,
    });
    this.identityPoolId = this.cfnIdentityPool.ref;
    this.identityPoolArn = Stack.of(scope).formatArn({
      service: 'cognito-identity',
      resource: 'identitypool',
      resourceName: this.identityPoolId,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    this.authenticatedRole = props.authenticatedRole ? props.authenticatedRole : this.configureDefaultRole('Authenticated');
    this.unauthenticatedRole = props.unauthenticatedRole ? props.unauthenticatedRole : this.configureDefaultRole('Unauthenticated');
    const attachment = new IdentityPoolRoleAttachment(this, `${this.id}DefaultRoleAttachment`, {
      identityPool: this,
      roles: {
        authenticated: this.authenticatedRole,
        unauthenticated: this.unauthenticatedRole,
      },
      roleMappings: props.roleMappings,
    });
    attachment.node.addDependency(this);
  }

  /**
   * Add a User Pool to the IdentityPool and configures User Pool Client to handle identities
   */
  public addUserPoolAuthentication(userPool: IUserPoolAuthenticationProvider): void {
    this.cognitoIdentityProviders = this.cognitoIdentityProviders
      .concat(this.configureAuthenticationProviders(userPool));
    const providers = this.cognitoIdentityProviders.map(provider => {
      return {
        ClientId: provider.clientId,
        ProviderName: provider.providerName,
        ServerSideTokenCheck: provider.serverSideTokenCheck,
      };
    }, this);
    this.cfnIdentityPool.addPropertyOverride('CognitoIdentityProviders', providers);
  }

  /**
   * Adds Role Mappings to Identity Pool
  */
  public addRoleMappings(...roleMappings: IdentityPoolRoleMapping[]): void {
    if (!roleMappings || !roleMappings.length) return;
    this.roleAttachmentCount++;
    const name = this.id + 'RoleMappingAttachment' + this.roleAttachmentCount.toString();
    const attachment = new IdentityPoolRoleAttachment(this, name, {
      identityPool: this,
      roles: {
        authenticated: this.authenticatedRole,
        unauthenticated: this.unauthenticatedRole,
      },
      roleMappings,
    });
    attachment.node.addDependency(this);
  }

  /**
   * Configure Authentication Providers for User Pools
   */
  private configureAuthenticationProviders(provider: IUserPoolAuthenticationProvider): CfnIdentityPool.CognitoIdentityProviderProperty[] {
    return provider.identityProviders.map(identityProvider => {
      return {
        clientId: provider.clientId,
        providerName: identityProvider.providerName,
        serverSideTokenCheck: provider.disableServerSideTokenCheck,
      };
    });
  }

  /**
   * Configure CognitoIdentityProviders from list of User Pools
   */
  private configureUserPool(userPool?: IUserPoolAuthenticationProvider): CfnIdentityPool.CognitoIdentityProviderProperty[] | undefined {
    if (!userPool) return undefined;
    return this.configureAuthenticationProviders(userPool);
  }

  /**
   * Converts OpenIdConnectProvider constructs to an array of Arns
   */
  private configureOpenIdConnectProviderArns(provider?: IOpenIdConnectProvider): string[] | undefined {
    if (!provider) return undefined;
    return [provider.openIdConnectProviderArn];
  }

  /**
   * Converts SamlProvider constructs to an array of Arns
   */
  private configureSamlProviderArns(provider?: ISamlProvider): string[] | undefined {
    if (!provider) return undefined;
    return [provider.samlProviderArn];
  }

  /**
   * Formats authentication providers
   */
  private configureLoginProviders(providers?: IdentityPoolProviders): any {
    if (!providers) return undefined;
    const authenticatedProviders:any = {};
    if (providers.amazon) authenticatedProviders[IdentityPoolProviderUrl.AMAZON.value] = providers.amazon.appId;
    if (providers.facebook) authenticatedProviders[IdentityPoolProviderUrl.FACEBOOK.value] = providers.facebook.appId;
    if (providers.google) authenticatedProviders[IdentityPoolProviderUrl.GOOGLE.value] = providers.google.clientId;
    if (providers.apple) authenticatedProviders[IdentityPoolProviderUrl.APPLE.value] = providers.apple.servicesId;
    if (providers.twitter) authenticatedProviders[IdentityPoolProviderUrl.TWITTER.value] = `${providers.twitter.consumerKey};${providers.twitter.consumerSecret}`;
    if (providers.digits) authenticatedProviders[IdentityPoolProviderUrl.DIGITS.value] = `${providers.digits.consumerKey};${providers.digits.consumerSecret}`;
    if (!Object.keys(authenticatedProviders).length) return undefined;
    return authenticatedProviders;
  }

  /**
   * Configure Default Roles For Identity Pool
   */
  private configureDefaultRole(type: string): IRole {
    const name = `${this.id}${type}Role`;
    const assumedBy = this.configureDefaultGrantPrincipal(type.toLowerCase());
    const role = new Role(this, name, {
      roleName: name,
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