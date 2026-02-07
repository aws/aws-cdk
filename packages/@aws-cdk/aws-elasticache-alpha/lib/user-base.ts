import type { IResource } from 'aws-cdk-lib/core';
import { Resource, ArnFormat, Stack, ValidationError } from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import type { UserEngine } from './common';

/**
 * Access control configuration for ElastiCache users.
 */
export abstract class AccessControl {
  /**
   * Create access control from an access string.
   *
   * @param accessString The access string defining user permissions.
   */
  public static fromAccessString(accessString: string): AccessControl {
    return new AccessControlString(accessString);
  }

  /**
   * The access string that defines user's permissions.
   */
  public abstract readonly accessString: string;
}

/**
 * Access control implementation using a raw access string.
 */
class AccessControlString extends AccessControl {
  /**
   * The access string that defines user's permissions.
   */
  public readonly accessString: string;

  constructor(accessString: string) {
    super();
    this.accessString = accessString;
  }
}

/**
 * Properties for defining an ElastiCache base user.
 */
export interface UserBaseProps {
  /**
   * The engine type for the user.
   * Enum options: UserEngine.VALKEY, UserEngine.REDIS.
   *
   * @default - UserEngine.REDIS for NoPasswordUser, UserEngine.VALKEY for all other user types.
   */
  readonly engine?: UserEngine;
  /**
   * The ID of the user.
   */
  readonly userId: string;
  /**
   * Access control configuration for the user.
   */
  readonly accessControl: AccessControl;
}

/**
 * Represents an ElastiCache base user.
 */
export interface IUser extends IResource {
  /**
   * The user's ID.
   *
   * @attribute
   */
  readonly userId: string;
  /**
   * The engine for the user.
   */
  readonly engine?: UserEngine;
  /**
   * The user's name.
   *
   * @attribute
   */
  readonly userName?: string;
  /**
   * The user's ARN.
   *
   * @attribute
   */
  readonly userArn: string;
}

/**
 * Attributes for importing an existing ElastiCache user.
 */
export interface UserBaseAttributes {
  /**
   * The ID of the user.
   * One of `userId` or `userArn` is required.
   *
   * @default - derived from userArn.
   */
  readonly userId?: string;
  /**
   * The engine type for the user.
   *
   * @default - engine type is unknown.
   */
  readonly engine?: UserEngine;
  /**
   * The user's name.
   *
   * @default - name is unknown.
   */
  readonly userName?: string;
  /**
   * The ARN of the user.
   *
   * One of `userId` or `userArn` is required.
   *
   * @default - derived from userId.
   */
  readonly userArn?: string;
}

/**
 * Base class for ElastiCache users.
 */
export abstract class UserBase extends Resource implements IUser {
  /**
   * Import an existing user by ID.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param userId The ID of the existing user.
   */
  public static fromUserId(scope: Construct, id: string, userId: string): IUser {
    return UserBase.fromUserAttributes(scope, id, { userId });
  }

  /**
   * Import an existing user by ARN.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param userArn The ARN of the existing user.
   */
  public static fromUserArn(scope: Construct, id: string, userArn: string): IUser {
    return UserBase.fromUserAttributes(scope, id, { userArn });
  }

  /**
   * Import an existing user using attributes.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `UserBaseAttributes` object.
   */
  public static fromUserAttributes(scope: Construct, id: string, attrs: UserBaseAttributes): IUser {
    let userId: string;
    let userArn: string;
    const stack = Stack.of(scope);

    if (attrs.userArn && attrs.userId) {
      throw new ValidationError('Only one of userArn or userId can be provided.', scope);
    }

    if (attrs.userArn) {
      userArn = attrs.userArn;
      const extractedUserId = stack.splitArn(attrs.userArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
      if (!extractedUserId) {
        throw new ValidationError('Unable to extract user id from ARN.', scope);
      }
      userId = extractedUserId;
    } else if (attrs.userId) {
      userId = attrs.userId;
      userArn = stack.formatArn({
        service: 'elasticache',
        resource: 'user',
        resourceName: attrs.userId,
      });
    } else {
      throw new ValidationError('One of userId or userArn is required.', scope);
    }

    class Import extends Resource implements IUser {
      public readonly engine?: UserEngine;
      public readonly userId: string;
      public readonly userArn: string;
      readonly userName?: string;

      constructor(_userArn: string, _userId: string) {
        super(scope, id);
        this.userArn = _userArn;
        this.userId = _userId;
        this.engine = attrs.engine;
        this.userName = attrs.userName;
      }
    }

    return new Import(userArn, userId);
  }

  /**
   * The user's ID.
   *
   * @attribute
   */
  public abstract readonly userId: string;
  /**
   * The engine for the user.
   */
  public abstract readonly engine?: UserEngine;
  /**
   * The user's name.
   *
   * @attribute
   */
  public abstract readonly userName?: string;
  /**
   * The user's ARN.
   *
   * @attribute
   */
  public abstract readonly userArn: string;
}
