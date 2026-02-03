import { CfnUser } from 'aws-cdk-lib/aws-elasticache';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ValidationError } from 'aws-cdk-lib/core';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { UserEngine } from './common';
import type { UserBaseProps } from './user-base';
import { UserBase } from './user-base';

const ELASTICACHE_IAMUSER_SYMBOL = Symbol.for('@aws-cdk/aws-elasticache.IamUser');

/**
 * Properties for defining an ElastiCache user with IAM authentication.
 */
export interface IamUserProps extends UserBaseProps {
  /**
   * The name of the user.
   *
   * @default - Same as userId.
   */
  readonly userName?: string;
}

/**
 * Define an ElastiCache user with IAM authentication.
 *
 * @resource AWS::ElastiCache::User
 */
@propertyInjectable
export class IamUser extends UserBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-elasticache.IamUser';

  /**
   * Return whether the given object is an `IamUser`.
   */
  public static isIamUser(x: any): x is IamUser {
    return x !== null && typeof (x) === 'object' && ELASTICACHE_IAMUSER_SYMBOL in x;
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
   * For IAM authentication userName must be equal to userId.
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

  constructor(scope: Construct, id: string, props: IamUserProps) {
    super(scope, id);

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.engine = props.engine ?? UserEngine.VALKEY;
    this.userId = props.userId;
    this.userName = props.userName ?? props.userId;
    this.accessString = props.accessControl.accessString;

    if (this.userName !== this.userId) {
      throw new ValidationError('For IAM authentication, userName must be equal to userId.', this);
    }

    this.resource = new CfnUser(this, 'Resource', {
      engine: this.engine,
      userId: props.userId,
      userName: this.userName,
      accessString: this.accessString,
      authenticationMode: {
        Type: 'iam',
      },
      noPasswordRequired: false,
      passwords: undefined,
    });

    this.userArn = this.resource.attrArn;
    this.userStatus = this.resource.attrStatus;

    Object.defineProperty(this, ELASTICACHE_IAMUSER_SYMBOL, { value: true });
  }

  /**
   * Grant connect permissions to the given IAM identity.
   * [disable-awslint:no-grants]
   *
   * @param grantee The IAM identity to grant permissions to.
   */
  @MethodMetadata()
  public grantConnect(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'elasticache:Connect');
  }

  /**
   * Grant the given identity custom permissions.
   * [disable-awslint:no-grants]
   *
   * @param grantee The IAM identity to grant permissions to.
   * @param actions The actions to grant.
   */
  @MethodMetadata()
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.userArn],
    });
  }
}
