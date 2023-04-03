import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a Public Key
 */
export interface IPublicKey extends IResource {
    /**
     * The ID of the key group.
     * @attribute
     */
    readonly publicKeyId: string;
}
/**
 * Properties for creating a Public Key
 */
export interface PublicKeyProps {
    /**
     * A name to identify the public key.
     * @default - generated from the `id`
     */
    readonly publicKeyName?: string;
    /**
     * A comment to describe the public key.
     * @default - no comment
     */
    readonly comment?: string;
    /**
     * The public key that you can use with signed URLs and signed cookies, or with field-level encryption.
     * The `encodedKey` parameter must include `-----BEGIN PUBLIC KEY-----` and `-----END PUBLIC KEY-----` lines.
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html
     */
    readonly encodedKey: string;
}
/**
 * A Public Key Configuration
 *
 * @resource AWS::CloudFront::PublicKey
 */
export declare class PublicKey extends Resource implements IPublicKey {
    /** Imports a Public Key from its id. */
    static fromPublicKeyId(scope: Construct, id: string, publicKeyId: string): IPublicKey;
    readonly publicKeyId: string;
    constructor(scope: Construct, id: string, props: PublicKeyProps);
    private generateName;
}
