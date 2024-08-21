import {
  CfnIdentityPoolRoleAttachment,
} from 'aws-cdk-lib/aws-cognito';
import {
  IRole,
} from 'aws-cdk-lib/aws-iam';
import {
  Resource,
  IResource,
  Token,
  IResolvable,
} from 'aws-cdk-lib/core';
import {
  Construct,
} from 'constructs';
import {
  IIdentityPool,
  IdentityPoolProviderUrl,
} from './identitypool';

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
   * Id of the Attachments Underlying Identity Pool
   */
  readonly identityPool: IIdentityPool;

  /**
   * Default Authenticated (User) Role
   * @default - No default authenticated role will be added
   */
  readonly authenticatedRole?: IRole;

  /**
    * Default Unauthenticated (Guest) Role
    * @default - No default unauthenticated role will be added
    */
  readonly unauthenticatedRole?: IRole;

  /**
   * Rules for mapping roles to users
   * @default - no Role Mappings
   */
  readonly roleMappings?: IdentityPoolRoleMapping[];
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
   * The key used for the role mapping in the role mapping hash. Required if the providerUrl is a token.
   * @default - the provided providerUrl
   */
  readonly mappingKey?: string;

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
  readonly matchType?: RoleMappingMatchType;
}

/**
 * Defines an Identity Pool Role Attachment
 *
 * @resource AWS::Cognito::IdentityPoolRoleAttachment
 */
export class IdentityPoolRoleAttachment extends Resource implements IIdentityPoolRoleAttachment {
  /**
   * Id of the underlying identity pool
   */
  public readonly identityPoolId: string

  /**
   * The CloudFormation resource of the attachment
   */
  public readonly resource: CfnIdentityPoolRoleAttachment;

  private roleMappings: { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty };

  constructor(scope: Construct, id: string, props: IdentityPoolRoleAttachmentProps) {
    super(scope, id);
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
    this.roleMappings = roleMappings || null;
    this.resource = new CfnIdentityPoolRoleAttachment(this, 'Resource', {
      identityPoolId: props.identityPool.identityPoolId,
      roles,
      roleMappings,
    });
  }

  /**
   * Update the role mappings of the Identity Pool Role Attachment
   * @param roleMappings The new role mappings for the Identity Pool
   */
  public updateRoleMappings(...roleMappings: IdentityPoolRoleMapping[]) {
    const newMappings = this.configureRoleMappings(...roleMappings);
    let updatedMappings: any = {};
    for (const mapping in newMappings) {
      const properties: CfnIdentityPoolRoleAttachment.RoleMappingProperty = newMappings[mapping];
      this.roleMappings[mapping] = properties;

      // If overriding, properties need to be capitalized
      let revisedProperties: {[name:string]: string | IResolvable | {[name:string]: {[name:string]: string}}} = {};
      revisedProperties.Type = properties.type;
      if (properties.ambiguousRoleResolution) {
        revisedProperties.AmbiguousRoleResolution = properties.ambiguousRoleResolution;
      }
      if (properties.identityProvider) {
        revisedProperties.IdentityProvider = properties.identityProvider;
      }
      if (properties.rulesConfiguration) {
        if ('rules' in properties.rulesConfiguration) {
          let rules: {[index: string]: string} = {};
          if ('claim' in properties.rulesConfiguration.rules) {
            rules.Claim = properties.rulesConfiguration.rules.claim as string;
          }
          if ('matchType' in properties.rulesConfiguration.rules) {
            rules.MatchType = properties.rulesConfiguration.rules.matchType as string;
          }
          if ('roleArn' in properties.rulesConfiguration.rules) {
            rules.RoleARN = properties.rulesConfiguration.rules.roleArn as string;
          }
          if ('value' in properties.rulesConfiguration.rules) {
            rules.Value = properties.rulesConfiguration.rules.value as string;
          }
          revisedProperties.RulesConfiguration = {'Rules': rules};
        } else {
          revisedProperties.RulesConfiguration = properties.rulesConfiguration;
        }
      }
      updatedMappings[mapping] = revisedProperties;
    }
    this.resource.addPropertyOverride('RoleMappings', updatedMappings);
  }

  /**
   * Configures Role Mappings for Identity Pool Role Attachment
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
      };
      acc[mappingKey] = roleMapping;
      return acc;
    }, {} as { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty });
  }
}