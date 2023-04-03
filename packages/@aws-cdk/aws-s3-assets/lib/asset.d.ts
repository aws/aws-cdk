import { CopyOptions } from '@aws-cdk/assets';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
export interface AssetOptions extends CopyOptions, cdk.FileCopyOptions, cdk.AssetOptions {
    /**
     * A list of principals that should be able to read this asset from S3.
     * You can use `asset.grantRead(principal)` to grant read permissions later.
     *
     * @default - No principals that can read file asset.
     */
    readonly readers?: iam.IGrantable[];
    /**
     * Custom hash to use when identifying the specific version of the asset. For consistency,
     * this custom hash will be SHA256 hashed and encoded as hex. The resulting hash will be
     * the asset hash.
     *
     * NOTE: the source hash is used in order to identify a specific revision of the asset,
     * and used for optimizing and caching deployment activities related to this asset such as
     * packaging, uploading to Amazon S3, etc. If you chose to customize the source hash,
     * you will need to make sure it is updated every time the source changes, or otherwise
     * it is possible that some deployments will not be invalidated.
     *
     * @default - automatically calculate source hash based on the contents
     * of the source file or directory.
     *
     * @deprecated see `assetHash` and `assetHashType`
     */
    readonly sourceHash?: string;
}
export interface AssetProps extends AssetOptions {
    /**
     * The disk location of the asset.
     *
     * The path should refer to one of the following:
     * - A regular file or a .zip file, in which case the file will be uploaded as-is to S3.
     * - A directory, in which case it will be archived into a .zip file and uploaded to S3.
     */
    readonly path: string;
}
/**
 * An asset represents a local file or directory, which is automatically uploaded to S3
 * and then can be referenced within a CDK application.
 */
export declare class Asset extends Construct implements cdk.IAsset {
    /**
     * Attribute that represents the name of the bucket this asset exists in.
     */
    readonly s3BucketName: string;
    /**
     * Attribute which represents the S3 object key of this asset.
     */
    readonly s3ObjectKey: string;
    /**
     * Attribute which represents the S3 URL of this asset.
     * @deprecated use `httpUrl`
     */
    readonly s3Url: string;
    /**
     * Attribute which represents the S3 HTTP URL of this asset.
     * For example, `https://s3.us-west-1.amazonaws.com/bucket/key`
     */
    readonly httpUrl: string;
    /**
     * Attribute which represents the S3 URL of this asset.
     * For example, `s3://bucket/key`
     */
    readonly s3ObjectUrl: string;
    /**
     * The path to the asset, relative to the current Cloud Assembly
     *
     * If asset staging is disabled, this will just be the original path.
     * If asset staging is enabled it will be the staged path.
     */
    readonly assetPath: string;
    /**
     * The S3 bucket in which this asset resides.
     */
    readonly bucket: s3.IBucket;
    /**
     * Indicates if this asset is a single file. Allows constructs to ensure that the
     * correct file type was used.
     */
    readonly isFile: boolean;
    /**
     * Indicates if this asset is a zip archive. Allows constructs to ensure that the
     * correct file type was used.
     */
    readonly isZipArchive: boolean;
    /**
     * A cryptographic hash of the asset.
     *
     * @deprecated see `assetHash`
     */
    readonly sourceHash: string;
    readonly assetHash: string;
    /**
     * Indicates if this asset got bundled before staged, or not.
     */
    private readonly isBundled;
    constructor(scope: Construct, id: string, props: AssetProps);
    /**
     * Adds CloudFormation template metadata to the specified resource with
     * information that indicates which resource property is mapped to this local
     * asset. This can be used by tools such as SAM CLI to provide local
     * experience such as local invocation and debugging of Lambda functions.
     *
     * Asset metadata will only be included if the stack is synthesized with the
     * "aws:cdk:enable-asset-metadata" context key defined, which is the default
     * behavior when synthesizing via the CDK Toolkit.
     *
     * @see https://github.com/aws/aws-cdk/issues/1432
     *
     * @param resource The CloudFormation resource which is using this asset [disable-awslint:ref-via-interface]
     * @param resourceProperty The property name where this asset is referenced
     * (e.g. "Code" for AWS::Lambda::Function)
     */
    addResourceMetadata(resource: cdk.CfnResource, resourceProperty: string): void;
    /**
     * Grants read permissions to the principal on the assets bucket.
     */
    grantRead(grantee: iam.IGrantable): void;
}
