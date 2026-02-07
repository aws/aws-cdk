import { CfnUser } from 'aws-cdk-lib/aws-elasticache';
import { ValidationError } from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { UserEngine } from './common';
import type { UserBaseProps } from './user-base';
import { UserBase } from './user-base';

const ELASTICACHE_NOPASSWORDUSER_SYMBOL = Symbol.for('@aws-cdk/aws-elasticache.NoPasswordUser');

/**
 * List of engines that support no-password authentication.
 */
const SUPPORTED_NO_PASSWORD_ENGINES = [UserEngine.REDIS];

/**
 * Properties for defining an ElastiCache user with no password authentication.
 */
export interface NoPasswordUserProps extends UserBaseProps {
  /**
   * The name of the user.
   *
   * @default - Same as userId.
   */
  readonly userName?: string;
}

/**
 * Define an ElastiCache user with no password authentication.
 *
 * @resource AWS::ElastiCache::User
 */
@propertyInjectable
export class NoPasswordUser extends UserBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-elasticache.NoPasswordUser';

  /**
   * Return whether the given object is a `NoPasswordUser`.
   */
  public static isNoPasswordUser(x: any): x is NoPasswordUser {
    return x !== null && typeof (x) === 'object' && ELASTICACHE_NOPASSWORDUSER_SYMBOL in x;
  }

  /**
   * The engine for the user.
   */
  public readonly engine?: UserEngine;
  /**
   * The user's ID.
   *
   * @attribute
   */
  public readonly userId: string;
  /**
   * The user's name.
   *
   * @attribute
   */
  public readonly userName?: string;
  /**
   * The access string that defines the user's permissions.
   */
  public readonly accessString: string;
  /**
   * The user's ARN.
   *
   * @attribute
   */
  public readonly userArn: string;
  /**
   * The user's status.
   * Can be 'active', 'modifying', 'deleting'.
   *
   * @attribute
   */
  public readonly userStatus: string;

  private readonly resource: CfnUser;

  constructor(scope: Construct, id: string, props: NoPasswordUserProps) {
    super(scope, id);

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.engine = props.engine ?? UserEngine.REDIS;
    this.userId = props.userId;
    this.userName = props.userName ?? props.userId;
    this.accessString = props.accessControl.accessString;

    if (!SUPPORTED_NO_PASSWORD_ENGINES.includes(this.engine)) {
      throw new ValidationError(`Engine '${this.engine}' does not support no-password authentication. Supported engines: ${SUPPORTED_NO_PASSWORD_ENGINES.join(', ')}.`, this);
    }

    this.resource = new CfnUser(this, 'Resource', {
      engine: this.engine,
      userId: props.userId,
      userName: this.userName,
      accessString: this.accessString,
      authenticationMode: {
        Type: 'no-password-required',
      },
      noPasswordRequired: true,
      passwords: undefined,
    });

    this.userArn = this.resource.attrArn;
    this.userStatus = this.resource.attrStatus;

    Object.defineProperty(this, ELASTICACHE_NOPASSWORDUSER_SYMBOL, { value: true });
  }
}
