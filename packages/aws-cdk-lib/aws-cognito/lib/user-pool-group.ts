import { Construct } from 'constructs';
import { CfnUserPoolGroup } from './cognito.generated';
import { IUserPool } from './user-pool';
import { IRoleRef } from '../../aws-iam';
import { IResource, Resource, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Represents a user pool group.
 */
export interface IUserPoolGroup extends IResource {
  /**
   * The user group name
   * @attribute
   */
  readonly groupName: string;
}

/**
 * Options to create a UserPoolGroup
 */
export interface UserPoolGroupOptions {
  /**
   * A string containing the description of the group.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The name of the group. Must be unique.
   *
   * @default - auto generate a name
   */
  readonly groupName?: string;

  /**
   * A non-negative integer value that specifies the precedence of this group relative to the other groups
   * that a user can belong to in the user pool. Zero is the highest precedence value.
   *
   * Groups with lower Precedence values take precedence over groups with higher or null Precedence values.
   * If a user belongs to two or more groups, it is the group with the lowest precedence value
   * whose role ARN is given in the user's tokens for the cognito:roles and cognito:preferred_role claims.
   *
   * Two groups can have the same Precedence value. If this happens, neither group takes precedence over the other.
   * If two groups with the same Precedence have the same role ARN, that role is used in the cognito:preferred_role
   * claim in tokens for users in each group.
   * If the two groups have different role ARNs, the cognito:preferred_role claim isn't set in users' tokens.
   *
   * @default - null
   */
  readonly precedence?: number;

  /**
   * The role for the group.
   *
   * @default - no description
   */
  readonly role?: IRoleRef;
}

/**
 * Props for UserPoolGroup construct
 */
export interface UserPoolGroupProps extends UserPoolGroupOptions {
  /**
   * The user pool to which this group is associated.
   */
  readonly userPool: IUserPool;
}

/**
 * Define a user pool group
 */
@propertyInjectable
export class UserPoolGroup extends Resource implements IUserPoolGroup {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cognito.UserPoolGroup';

  /**
   * Import a UserPoolGroup given its group name
   */
  public static fromGroupName(scope: Construct, id: string, groupName: string): IUserPoolGroup {
    class Import extends Resource implements IUserPoolGroup {
      public readonly groupName = groupName;
    }
    return new Import(scope, id);
  }

  public readonly groupName: string;

  constructor(scope: Construct, id: string, props: UserPoolGroupProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.description !== undefined &&
      !Token.isUnresolved(props.description) &&
      (props.description.length > 2048)) {
      throw new ValidationError(`\`description\` must be between 0 and 2048 characters. Received: ${props.description.length} characters`, this);
    }

    if (props.precedence !== undefined &&
      !Token.isUnresolved(props.precedence) &&
      (props.precedence < 0 || props.precedence > 2 ** 31 - 1)) {
      throw new ValidationError(`\`precedence\` must be between 0 and 2^31-1. Received: ${props.precedence}`, this);
    }

    if (
      props.groupName !== undefined &&
      !Token.isUnresolved(props.groupName) &&
      !/^[\p{L}\p{M}\p{S}\p{N}\p{P}]{1,128}$/u.test(props.groupName)
    ) {
      throw new ValidationError('\`groupName\` must be between 1 and 128 characters and can include letters, numbers, and symbols.', this);
    }

    const resource = new CfnUserPoolGroup(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      description: props.description,
      groupName: props.groupName,
      precedence: props.precedence,
      roleArn: props.role?.roleRef.roleArn,
    });

    this.groupName = resource.ref;
  }
}
