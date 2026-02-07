import { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';
import type { IResource } from 'aws-cdk-lib/core';
import { Resource, ArnFormat, Stack, Lazy, ValidationError, UnscopedValidationError, Names } from 'aws-cdk-lib/core';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { UserEngine } from './common';
import type { IUser } from './user-base';

const ELASTICACHE_USERGROUP_SYMBOL = Symbol.for('@aws-cdk/aws-elasticache.UserGroup');

/**
 * Properties for defining an ElastiCache UserGroup
 */
export interface UserGroupProps {
  /**
   * Enforces a particular physical user group name.
   * @default <generated>
   */
  readonly userGroupName?: string;
  /**
   * The engine type for the user group
   * Enum options: UserEngine.VALKEY, UserEngine.REDIS
   *
   * @default UserEngine.VALKEY
   */
  readonly engine?: UserEngine;
  /**
   * List of users inside the user group
   *
   * @default - no users
   */
  readonly users?: IUser[];
}

/**
 * Represents an ElastiCache UserGroup
 */
export interface IUserGroup extends IResource {
  /**
   * The name of the user group
   *
   * @attribute
   */
  readonly userGroupName: string;
  /**
   * The engine type for the user group
   */
  readonly engine?: UserEngine;
  /**
   * List of users in the user group
   */
  readonly users?: IUser[];
  /**
   * The ARN of the user group
   *
   * @attribute
   */
  readonly userGroupArn: string;
  /**
   * Add a user to this user group
   *
   * @param user The user to add
   */
  addUser(user: IUser): void;
}

/**
 * Base class for UserGroup constructs
 */
export abstract class UserGroupBase extends Resource implements IUserGroup {
  /**
   * The name of the user group
   *
   * @attribute
   */
  public abstract readonly userGroupName: string;
  /**
   * The engine type for the user group
   */
  public abstract readonly engine?: UserEngine;
  /**
   * List of users in the user group
   */
  public abstract readonly users?: IUser[];
  /**
   * The ARN of the user group
   * @attribute
   */
  public abstract readonly userGroupArn: string;
  /**
   * Add a user to this user group
   *
   * @param _user The user to add
   */
  public addUser(_user: IUser): void {
    throw new UnscopedValidationError('Cannot add users to an imported UserGroup. Only UserGroups created in this stack can be modified.');
  }
}

/**
 * Attributes that can be specified when importing a UserGroup
 */
export interface UserGroupAttributes {
  /**
   * The name of the user group
   *
   * One of `userGroupName` or `userGroupArn` is required.
   *
   * @default - derived from userGroupArn
   */
  readonly userGroupName?: string;
  /**
   * The engine type for the user group
   *
   * @default - engine type is unknown
   */
  readonly engine?: UserEngine;
  /**
   * List of users in the user group
   *
   * @default - users are unknown
   */
  readonly users?: IUser[];
  /**
   * The ARN of the user group
   *
   * One of `userGroupName` or `userGroupArn` is required.
   *
   * @default - derived from userGroupName
   */
  readonly userGroupArn?: string;
}

/**
 * An ElastiCache UserGroup
 *
 * @resource AWS::ElastiCache::UserGroup
 */
@propertyInjectable
export class UserGroup extends UserGroupBase {
  /**
   * Uniquely identifies this class
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-elasticache.UserGroup';

  /**
   * Return whether the given object is a `UserGroup`
   */
  public static isUserGroup(x: any): x is UserGroup {
    return x !== null && typeof (x) === 'object' && ELASTICACHE_USERGROUP_SYMBOL in x;
  }

  /**
   * Import an existing user group by name
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param userGroupName The name of the existing user group
   */
  public static fromUserGroupName(scope: Construct, id: string, userGroupName: string): IUserGroup {
    return UserGroup.fromUserGroupAttributes(scope, id, { userGroupName });
  }

  /**
   * Import an existing user group by ARN
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param userGroupArn The ARN of the existing user group
   */
  public static fromUserGroupArn(scope: Construct, id: string, userGroupArn: string): IUserGroup {
    return UserGroup.fromUserGroupAttributes(scope, id, { userGroupArn });
  }

  /**
   * Import an existing user group using attributes
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param attrs A `UserGroupAttributes` object
   */
  public static fromUserGroupAttributes(scope: Construct, id: string, attrs: UserGroupAttributes): IUserGroup {
    let userGroupName: string;
    let userGroupArn: string;
    const stack = Stack.of(scope);

    if (attrs.userGroupArn && attrs.userGroupName) {
      throw new ValidationError('Only one of userGroupArn or userGroupName can be provided.', scope);
    }

    if (attrs.userGroupArn) {
      userGroupArn = attrs.userGroupArn;
      const extractedUserGroupName = stack.splitArn(attrs.userGroupArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
      if (!extractedUserGroupName) {
        throw new ValidationError('Unable to extract user group name from ARN.', scope);
      }
      userGroupName = extractedUserGroupName;
    } else if (attrs.userGroupName) {
      userGroupName = attrs.userGroupName;
      userGroupArn = stack.formatArn({
        service: 'elasticache',
        resource: 'usergroup',
        resourceName: attrs.userGroupName,
      });
    } else {
      throw new ValidationError('One of userGroupName or userGroupArn is required.', scope);
    }

    class Import extends UserGroupBase {
      public readonly engine?: UserEngine;
      public readonly userGroupName: string;
      public readonly userGroupArn: string;

      public get users(): IUser[] | undefined {
        return attrs.users ? [...attrs.users] : undefined;
      }

      constructor(_userGroupArn: string, _userGroupName: string) {
        super(scope, id);
        this.userGroupArn = _userGroupArn;
        this.userGroupName = _userGroupName;
        this.engine = attrs.engine;
      }
    }

    return new Import(userGroupArn, userGroupName);
  }

  public readonly engine?: UserEngine;
  public readonly userGroupName: string;
  private readonly _users: IUser[] = [];
  /**
   * The ARN of the user group
   *
   * @attribute
   */
  public readonly userGroupArn: string;
  /**
   * The status of the user group
   * Can be 'creating', 'active', 'modifying', 'deleting'
   *
   * @attribute
   */
  public readonly userGroupStatus: string;

  private readonly resource: CfnUserGroup;

  constructor(scope: Construct, id: string, props: UserGroupProps = {}) {
    super(scope, id, {});

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.engine = props.engine ?? UserEngine.VALKEY;
    this.userGroupName = props.userGroupName ?? Lazy.string({
      // ElastiCache is allowing only uppercase and max 40 characters for user group id
      produce: () => Names.uniqueResourceName(this, { maxLength: 40 }).toLocaleLowerCase(),
    });

    if (props.users) {
      this._users.push(...props.users);
    }

    this.resource = new CfnUserGroup(this, 'Resource', {
      engine: this.engine,
      userGroupId: this.userGroupName,
      userIds: Lazy.list({
        produce: () => {
          this.validateUsers();
          return this._users.map(user => user.userId);
        },
      }),
    });

    if (props.users) {
      props.users.forEach(user => this.addUserDependency(user));
    }

    this.userGroupArn = this.resource.attrArn;
    this.userGroupStatus = this.resource.attrStatus;

    Object.defineProperty(this, ELASTICACHE_USERGROUP_SYMBOL, { value: true });
  }

  /**
   * Add a CloudFormation dependency on the user resource to ensure proper creation order.
   */
  private addUserDependency(user: IUser): void {
    this.resource.node.addDependency(user);
  }

  /**
   * Array of users in the user group
   *
   * Do not push directly to this array.
   * Use addUser() instead to ensure proper validation and dependency management.
   */
  public get users(): IUser[] | undefined {
    return this._users;
  }

  /**
   * Validates users in the user group for duplicate usernames and Redis-specific requirements.
   */
  private validateUsers(): void {
    const userNames = this._users.map(user => user.userName);
    const duplicates = userNames.filter((name, index) => userNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      throw new ValidationError('User group cannot have users with the same user name.', this);
    }

    if (this.engine === UserEngine.REDIS) {
      this._users.forEach(user => {
        if (user.engine !== UserEngine.REDIS) {
          throw new ValidationError('Redis user group can only contain Redis users.', this);
        }
      });
      const hasDefaultUser = this._users.some(user => user.userName === 'default');
      if (!hasDefaultUser) {
        throw new ValidationError('Redis user groups need to contain a user with the user name "default".', this);
      }
    }
  }

  /**
   * Add a user to this user group
   *
   * @param user The user to add to the group
   */
  @MethodMetadata()
  public addUser(user: IUser): void {
    this._users.push(user);
    this.addUserDependency(user);
  }
}
