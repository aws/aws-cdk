import { IBucket, Location } from '@aws-cdk/aws-s3';
import { AssetOptions } from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';
/**
 * Constructs for types of environment files
 */
export declare abstract class EnvironmentFile {
    /**
     * Loads the environment file from a local disk path.
     *
     * @param path Local disk path
     * @param options
     */
    static fromAsset(path: string, options?: AssetOptions): AssetEnvironmentFile;
    /**
     * Loads the environment file from an S3 bucket.
     *
     * @returns `S3EnvironmentFile` associated with the specified S3 object.
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     */
    static fromBucket(bucket: IBucket, key: string, objectVersion?: string): S3EnvironmentFile;
    /**
     * Called when the container is initialized to allow this object to bind
     * to the stack.
     *
     * @param scope The binding scope
     */
    abstract bind(scope: Construct): EnvironmentFileConfig;
}
/**
 * Environment file from a local directory.
 */
export declare class AssetEnvironmentFile extends EnvironmentFile {
    readonly path: string;
    private readonly options;
    private asset?;
    /**
     * @param path The path to the asset file or directory.
     * @param options
     */
    constructor(path: string, options?: AssetOptions);
    bind(scope: Construct): EnvironmentFileConfig;
}
/**
 * Environment file from S3.
 */
export declare class S3EnvironmentFile extends EnvironmentFile {
    private key;
    private objectVersion?;
    private readonly bucketName;
    constructor(bucket: IBucket, key: string, objectVersion?: string | undefined);
    bind(_scope: Construct): EnvironmentFileConfig;
}
/**
 * Configuration for the environment file
 */
export interface EnvironmentFileConfig {
    /**
     * The type of environment file
     */
    readonly fileType: EnvironmentFileType;
    /**
     * The location of the environment file in S3
     */
    readonly s3Location: Location;
}
/**
 * Type of environment file to be included in the container definition
 */
export declare enum EnvironmentFileType {
    /**
     * Environment file hosted on S3, referenced by object ARN
     */
    S3 = "s3"
}
