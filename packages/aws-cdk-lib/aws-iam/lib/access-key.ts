import { Construct } from 'constructs';
import { AccessKeyReference, CfnAccessKey, IAccessKeyRef } from './iam.generated';
import { IUser } from './user';
import { IResource, Resource, SecretValue } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Valid statuses for an IAM Access Key.
 */
export enum AccessKeyStatus {
  /**
   * An active access key. An active key can be used to make API calls.
   */
  ACTIVE = 'Active',

  /**
   * An inactive access key. An inactive key cannot be used to make API calls.
   */
  INACTIVE = 'Inactive',

  /**
   * An expired access key.
   */
  EXPIRED = 'Expired',
}

/**
 * Represents an IAM Access Key.
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
 */
export interface IAccessKey extends IResource, IAccessKeyRef {
  /**
   * The Access Key ID.
   *
   * @attribute
   */
  readonly accessKeyId: string;

  /**
   * The Secret Access Key.
   *
   * @attribute
   */
  readonly secretAccessKey: SecretValue;
}

/**
 * Properties for defining an IAM access key.
 */
export interface AccessKeyProps {
  /**
   * A CloudFormation-specific value that signifies the access key should be
   * replaced/rotated. This value can only be incremented. Incrementing this
   * value will cause CloudFormation to replace the Access Key resource.
   *
   * @default - No serial value
   */
  readonly serial?: number;

  /**
   * The status of the access key. An Active access key is allowed to be used
   * to make API calls; An Inactive key cannot.
   *
   * @default - The access key is active
   */
  readonly status?: AccessKeyStatus;

  /**
   * The IAM user this key will belong to.
   *
   * Changing this value will result in the access key being deleted and a new
   * access key (with a different ID and secret value) being assigned to the new
   * user.
   */
  readonly user: IUser;
}

/**
 * Define a new IAM Access Key.
 */
@propertyInjectable
export class AccessKey extends Resource implements IAccessKey {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-iam.AccessKey';
  public readonly accessKeyRef: AccessKeyReference;
  public readonly accessKeyId: string;
  public readonly secretAccessKey: SecretValue;

  constructor(scope: Construct, id: string, props: AccessKeyProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    const accessKey = new CfnAccessKey(this, 'Resource', {
      userName: props.user.userName,
      serial: props.serial,
      status: props.status,
    });

    this.accessKeyId = accessKey.ref;
    this.accessKeyRef = accessKey.accessKeyRef;

    this.secretAccessKey = SecretValue.resourceAttribute(accessKey.attrSecretAccessKey);
  }
}
