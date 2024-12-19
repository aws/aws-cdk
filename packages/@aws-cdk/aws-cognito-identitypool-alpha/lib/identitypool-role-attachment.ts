import { CfnIdentityPoolRoleAttachment } from 'aws-cdk-lib/aws-cognito';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { Resource, IResource, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IIdentityPool, IdentityPoolProviderUrl } from './identitypool';

/**
 * Represents an Identity Pool Role Attachment
 */
export interface IIdentityPoolRoleAttachment extends IResource {
  /**
   * ID of the Attachment's underlying Identity Pool
   */
  readonly identityPoolId: string;
}

/**
 * Props for an Identity Pool Role Attachment
 */
export interface IdentityPoolRoleAttachmentProps {

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
   * ID of the underlying Identity Pool
   */
  public readonly identityPoolId: string;

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
      };
      acc[mappingKey] = roleMapping;
      return acc;
    }, {} as { [name:string]: CfnIdentityPoolRoleAttachment.RoleMappingProperty });
  }
}
