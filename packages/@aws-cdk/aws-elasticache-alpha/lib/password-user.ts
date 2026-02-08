import { CfnUser } from 'aws-cdk-lib/aws-elasticache';
import type { SecretValue } from 'aws-cdk-lib/core';
import { ValidationError } from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { UserEngine } from './common';
import type { UserBaseProps } from './user-base';
import { UserBase } from './user-base';

const ELASTICACHE_PASSWORDUSER_SYMBOL = Symbol.for('@aws-cdk/aws-elasticache.PasswordUser');

/**
 * Properties for defining an ElastiCache user with password authentication.
 */
export interface PasswordUserProps extends UserBaseProps {
  /**
   * The name of the user.
   *
   * @default - Same as userId.
   */
  readonly userName?: string;
  /**
   * The passwords for the user.
   * Password authentication requires using 1-2 passwords.
   */
  readonly passwords: SecretValue[];
}

/**
 * Define an ElastiCache user with password authentication.
 *
 * @resource AWS::ElastiCache::User
 */
@propertyInjectable
export class PasswordUser extends UserBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-elasticache.PasswordUser';

  /**
   * Return whether the given object is a `PasswordUser`.
   */
  public static isPasswordUser(x: any) : x is PasswordUser {
    return x !== null && typeof(x) === 'object' && ELASTICACHE_PASSWORDUSER_SYMBOL in x;
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

  constructor(scope: Construct, id: string, props: PasswordUserProps) {
    super(scope, id);

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.engine = props.engine ?? UserEngine.VALKEY;
    this.userId = props.userId;
    this.userName = props.userName ?? props.userId;
    this.accessString = props.accessControl.accessString;

    if (props.passwords.length < 1 || props.passwords.length > 2) {
      throw new ValidationError('Password authentication requires 1-2 passwords.', this);
    }

    this.resource = new CfnUser(this, 'Resource', {
      engine: this.engine,
      userId: props.userId,
      userName: this.userName,
      accessString: this.accessString,
      authenticationMode: {
        Type: 'password',
        Passwords: props.passwords.map(p => p.unsafeUnwrap()),
      },
      noPasswordRequired: false,
      passwords: undefined,
    });

    this.userArn = this.resource.attrArn;
    this.userStatus = this.resource.attrStatus;

    Object.defineProperty(this, ELASTICACHE_PASSWORDUSER_SYMBOL, { value: true });
  }
}
