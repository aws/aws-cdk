import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';
/**
 * Source information.
 */
export interface SourceConfig {
    /**
     * The source bucket to deploy from.
     */
    readonly bucket: s3.IBucket;
    /**
     * An S3 object key in the source bucket that points to a zip file.
     */
    readonly zipObjectKey: string;
    /**
     * A set of markers to substitute in the source content.
     * @default - no markers
     */
    readonly markers?: Record<string, any>;
}
/**
 * Bind context for ISources
 */
export interface DeploymentSourceContext {
    /**
     * The role for the handler
     */
    readonly handlerRole: iam.IRole;
}
/**
 * Represents a source for bucket deployments.
 */
export interface ISource {
    /**
     * Binds the source to a bucket deployment.
     * @param scope The construct tree context.
     */
    bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig;
}
/**
 * Specifies bucket deployment source.
 *
 * Usage:
 *
 *     Source.bucket(bucket, key)
 *     Source.asset('/local/path/to/directory')
 *     Source.asset('/local/path/to/a/file.zip')
 *     Source.data('hello/world/file.txt', 'Hello, world!')
 *     Source.data('config.json', { baz: topic.topicArn })
 *
 */
export declare class Source {
    /**
     * Uses a .zip file stored in an S3 bucket as the source for the destination bucket contents.
     *
     * Make sure you trust the producer of the archive.
     *
     * @param bucket The S3 Bucket
     * @param zipObjectKey The S3 object key of the zip file with contents
     */
    static bucket(bucket: s3.IBucket, zipObjectKey: string): ISource;
    /**
     * Uses a local asset as the deployment source.
     *
     * If the local asset is a .zip archive, make sure you trust the
     * producer of the archive.
     *
     * @param path The path to a local .zip file or a directory
     */
    static asset(path: string, options?: s3_assets.AssetOptions): ISource;
    /**
     * Deploys an object with the specified string contents into the bucket. The
     * content can include deploy-time values (such as `snsTopic.topicArn`) that
     * will get resolved only during deployment.
     *
     * To store a JSON object use `Source.jsonData()`.
     *
     * @param objectKey The destination S3 object key (relative to the root of the
     * S3 deployment).
     * @param data The data to be stored in the object.
     */
    static data(objectKey: string, data: string): ISource;
    /**
     * Deploys an object with the specified JSON object into the bucket. The
     * object can include deploy-time values (such as `snsTopic.topicArn`) that
     * will get resolved only during deployment.
     *
     * @param objectKey The destination S3 object key (relative to the root of the
     * S3 deployment).
     * @param obj A JSON object.
     */
    static jsonData(objectKey: string, obj: any): ISource;
    private constructor();
}
