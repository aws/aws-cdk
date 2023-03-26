import { IResource, Resource, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IUser } from './user';
/**
 * Valid statuses for an IAM Access Key.
 */
export declare enum AccessKeyStatus {
    /**
     * An active access key. An active key can be used to make API calls.
     */
    ACTIVE = "Active",
    /**
     * An inactive access key. An inactive key cannot be used to make API calls.
     */
    INACTIVE = "Inactive"
}
/**
 * Represents an IAM Access Key.
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
 */
export interface IAccessKey extends IResource {
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
export declare class AccessKey extends Resource implements IAccessKey {
    readonly accessKeyId: string;
    readonly secretAccessKey: SecretValue;
    constructor(scope: Construct, id: string, props: AccessKeyProps);
}
