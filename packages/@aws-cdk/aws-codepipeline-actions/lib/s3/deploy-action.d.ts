import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Used for HTTP cache-control header, which influences downstream caches.
 * Use the provided static factory methods to construct instances of this class.
 * Used in the `S3DeployActionProps.cacheControl` property.
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
 */
export declare class CacheControl {
    value: string;
    /** The 'must-revalidate' cache control directive. */
    static mustRevalidate(): CacheControl;
    /** The 'no-cache' cache control directive. */
    static noCache(): CacheControl;
    /** The 'no-transform' cache control directive. */
    static noTransform(): CacheControl;
    /** The 'public' cache control directive. */
    static setPublic(): CacheControl;
    /** The 'private' cache control directive. */
    static setPrivate(): CacheControl;
    /** The 'proxy-revalidate' cache control directive. */
    static proxyRevalidate(): CacheControl;
    /** The 'max-age' cache control directive. */
    static maxAge(t: Duration): CacheControl;
    /** The 's-max-age' cache control directive. */
    static sMaxAge(t: Duration): CacheControl;
    /**
     * Allows you to create an arbitrary cache control directive,
     * in case our support is missing a method for a particular directive.
     */
    static fromString(s: string): CacheControl;
    /** @param value the actual text value of the created directive */
    private constructor();
}
/**
 * Construction properties of the `S3DeployAction S3 deploy Action`.
 */
export interface S3DeployActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * Should the deploy action extract the artifact before deploying to Amazon S3.
     *
     * @default true
     */
    readonly extract?: boolean;
    /**
     * The key of the target object. This is required if extract is false.
     */
    readonly objectKey?: string;
    /**
     * The input Artifact to deploy to Amazon S3.
     */
    readonly input: codepipeline.Artifact;
    /**
     * The Amazon S3 bucket that is the deploy target.
     */
    readonly bucket: s3.IBucket;
    /**
     * The specified canned ACL to objects deployed to Amazon S3.
     * This overwrites any existing ACL that was applied to the object.
     *
     * @default - the original object ACL
     */
    readonly accessControl?: s3.BucketAccessControl;
    /**
     * The caching behavior for requests/responses for objects in the bucket.
     * The final cache control property will be the result of joining all of the provided array elements with a comma
     * (plus a space after the comma).
     *
     * @default - none, decided by the HTTP client
     */
    readonly cacheControl?: CacheControl[];
    /**
     * The AWS KMS encryption key for the host bucket.
     * The encryptionKey parameter encrypts uploaded artifacts with the provided AWS KMS key.
     * For a KMS key, you can use the key ID, the key ARN, or the alias ARN.
     * @default - none
     */
    readonly encryptionKey?: kms.IKey;
}
/**
 * Deploys the sourceArtifact to Amazon S3.
 */
export declare class S3DeployAction extends Action {
    private readonly props;
    constructor(props: S3DeployActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
