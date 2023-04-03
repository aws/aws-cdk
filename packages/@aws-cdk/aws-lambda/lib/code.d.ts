import * as ecr from '@aws-cdk/aws-ecr';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents the Lambda Handler Code.
 */
export declare abstract class Code {
    /**
     * Lambda handler code as an S3 object.
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     */
    static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code;
    /**
     * DEPRECATED
     * @deprecated use `fromBucket`
     */
    static bucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code;
    /**
     * Inline code for Lambda handler
     * @returns `LambdaInlineCode` with inline code.
     * @param code The actual handler code (limited to 4KiB)
     */
    static fromInline(code: string): InlineCode;
    /**
     * DEPRECATED
     * @deprecated use `fromInline`
     */
    static inline(code: string): InlineCode;
    /**
     * Loads the function code from a local disk path.
     *
     * @param path Either a directory with the Lambda code bundle or a .zip file
     */
    static fromAsset(path: string, options?: s3_assets.AssetOptions): AssetCode;
    /**
     * Loads the function code from an asset created by a Docker build.
     *
     * By default, the asset is expected to be located at `/asset` in the
     * image.
     *
     * @param path The path to the directory containing the Docker file
     * @param options Docker build options
     */
    static fromDockerBuild(path: string, options?: DockerBuildAssetOptions): AssetCode;
    /**
     * DEPRECATED
     * @deprecated use `fromAsset`
     */
    static asset(path: string): AssetCode;
    /**
     * Creates a new Lambda source defined using CloudFormation parameters.
     *
     * @returns a new instance of `CfnParametersCode`
     * @param props optional construction properties of `CfnParametersCode`
     */
    static fromCfnParameters(props?: CfnParametersCodeProps): CfnParametersCode;
    /**
     * DEPRECATED
     * @deprecated use `fromCfnParameters`
     */
    static cfnParameters(props?: CfnParametersCodeProps): CfnParametersCode;
    /**
     * Use an existing ECR image as the Lambda code.
     * @param repository the ECR repository that the image is in
     * @param props properties to further configure the selected image
     */
    static fromEcrImage(repository: ecr.IRepository, props?: EcrImageCodeProps): EcrImageCode;
    /**
     * Create an ECR image from the specified asset and bind it as the Lambda code.
     * @param directory the directory from which the asset must be created
     * @param props properties to further configure the selected image
     */
    static fromAssetImage(directory: string, props?: AssetImageCodeProps): AssetImageCode;
    /**
     * Determines whether this Code is inline code or not.
     *
     * @deprecated this value is ignored since inline is now determined based on the
     * the `inlineCode` field of `CodeConfig` returned from `bind()`.
     */
    abstract readonly isInline: boolean;
    /**
     * Called when the lambda or layer is initialized to allow this object to bind
     * to the stack, add resources and have fun.
     *
     * @param scope The binding scope. Don't be smart about trying to down-cast or
     * assume it's initialized. You may just use it as a construct scope.
     */
    abstract bind(scope: Construct): CodeConfig;
    /**
     * Called after the CFN function resource has been created to allow the code
     * class to bind to it. Specifically it's required to allow assets to add
     * metadata for tooling like SAM CLI to be able to find their origins.
     */
    bindToResource(_resource: cdk.CfnResource, _options?: ResourceBindOptions): void;
}
/**
 * Result of binding `Code` into a `Function`.
 */
export interface CodeConfig {
    /**
     * The location of the code in S3 (mutually exclusive with `inlineCode` and `image`).
     * @default - code is not an s3 location
     */
    readonly s3Location?: s3.Location;
    /**
     * Inline code (mutually exclusive with `s3Location` and `image`).
     * @default - code is not inline code
     */
    readonly inlineCode?: string;
    /**
     * Docker image configuration (mutually exclusive with `s3Location` and `inlineCode`).
     * @default - code is not an ECR container image
     */
    readonly image?: CodeImageConfig;
}
/**
 * Result of the bind when an ECR image is used.
 */
export interface CodeImageConfig {
    /**
     * URI to the Docker image.
     */
    readonly imageUri: string;
    /**
     * Specify or override the CMD on the specified Docker image or Dockerfile.
     * This needs to be in the 'exec form', viz., `[ 'executable', 'param1', 'param2' ]`.
     * @see https://docs.docker.com/engine/reference/builder/#cmd
     * @default - use the CMD specified in the docker image or Dockerfile.
     */
    readonly cmd?: string[];
    /**
     * Specify or override the ENTRYPOINT on the specified Docker image or Dockerfile.
     * An ENTRYPOINT allows you to configure a container that will run as an executable.
     * This needs to be in the 'exec form', viz., `[ 'executable', 'param1', 'param2' ]`.
     * @see https://docs.docker.com/engine/reference/builder/#entrypoint
     * @default - use the ENTRYPOINT in the docker image or Dockerfile.
     */
    readonly entrypoint?: string[];
    /**
     * Specify or override the WORKDIR on the specified Docker image or Dockerfile.
     * A WORKDIR allows you to configure the working directory the container will use.
     * @see https://docs.docker.com/engine/reference/builder/#workdir
     * @default - use the WORKDIR in the docker image or Dockerfile.
     */
    readonly workingDirectory?: string;
}
/**
 * Lambda code from an S3 archive.
 */
export declare class S3Code extends Code {
    private key;
    private objectVersion?;
    readonly isInline = false;
    private bucketName;
    constructor(bucket: s3.IBucket, key: string, objectVersion?: string | undefined);
    bind(_scope: Construct): CodeConfig;
}
/**
 * Lambda code from an inline string.
 */
export declare class InlineCode extends Code {
    private code;
    readonly isInline = true;
    constructor(code: string);
    bind(_scope: Construct): CodeConfig;
}
/**
 * Lambda code from a local directory.
 */
export declare class AssetCode extends Code {
    readonly path: string;
    private readonly options;
    readonly isInline = false;
    private asset?;
    /**
     * @param path The path to the asset file or directory.
     */
    constructor(path: string, options?: s3_assets.AssetOptions);
    bind(scope: Construct): CodeConfig;
    bindToResource(resource: cdk.CfnResource, options?: ResourceBindOptions): void;
}
export interface ResourceBindOptions {
    /**
     * The name of the CloudFormation property to annotate with asset metadata.
     * @see https://github.com/aws/aws-cdk/issues/1432
     * @default Code
     */
    readonly resourceProperty?: string;
}
/**
 * Construction properties for `CfnParametersCode`.
 */
export interface CfnParametersCodeProps {
    /**
     * The CloudFormation parameter that represents the name of the S3 Bucket
     * where the Lambda code will be located in.
     * Must be of type 'String'.
     *
     * @default a new parameter will be created
     */
    readonly bucketNameParam?: cdk.CfnParameter;
    /**
     * The CloudFormation parameter that represents the path inside the S3 Bucket
     * where the Lambda code will be located at.
     * Must be of type 'String'.
     *
     * @default a new parameter will be created
     */
    readonly objectKeyParam?: cdk.CfnParameter;
}
/**
 * Lambda code defined using 2 CloudFormation parameters.
 * Useful when you don't have access to the code of your Lambda from your CDK code, so you can't use Assets,
 * and you want to deploy the Lambda in a CodePipeline, using CloudFormation Actions -
 * you can fill the parameters using the `#assign` method.
 */
export declare class CfnParametersCode extends Code {
    readonly isInline = false;
    private _bucketNameParam?;
    private _objectKeyParam?;
    constructor(props?: CfnParametersCodeProps);
    bind(scope: Construct): CodeConfig;
    /**
     * Create a parameters map from this instance's CloudFormation parameters.
     *
     * It returns a map with 2 keys that correspond to the names of the parameters defined in this Lambda code,
     * and as values it contains the appropriate expressions pointing at the provided S3 location
     * (most likely, obtained from a CodePipeline Artifact by calling the `artifact.s3Location` method).
     * The result should be provided to the CloudFormation Action
     * that is deploying the Stack that the Lambda with this code is part of,
     * in the `parameterOverrides` property.
     *
     * @param location the location of the object in S3 that represents the Lambda code
     */
    assign(location: s3.Location): {
        [name: string]: any;
    };
    get bucketNameParam(): string;
    get objectKeyParam(): string;
}
/**
 * Properties to initialize a new EcrImageCode
 */
export interface EcrImageCodeProps {
    /**
     * Specify or override the CMD on the specified Docker image or Dockerfile.
     * This needs to be in the 'exec form', viz., `[ 'executable', 'param1', 'param2' ]`.
     * @see https://docs.docker.com/engine/reference/builder/#cmd
     * @default - use the CMD specified in the docker image or Dockerfile.
     */
    readonly cmd?: string[];
    /**
     * Specify or override the ENTRYPOINT on the specified Docker image or Dockerfile.
     * An ENTRYPOINT allows you to configure a container that will run as an executable.
     * This needs to be in the 'exec form', viz., `[ 'executable', 'param1', 'param2' ]`.
     * @see https://docs.docker.com/engine/reference/builder/#entrypoint
     * @default - use the ENTRYPOINT in the docker image or Dockerfile.
     */
    readonly entrypoint?: string[];
    /**
     * Specify or override the WORKDIR on the specified Docker image or Dockerfile.
     * A WORKDIR allows you to configure the working directory the container will use.
     * @see https://docs.docker.com/engine/reference/builder/#workdir
     * @default - use the WORKDIR in the docker image or Dockerfile.
     */
    readonly workingDirectory?: string;
    /**
     * The image tag to use when pulling the image from ECR.
     * @default 'latest'
     * @deprecated use `tagOrDigest`
     */
    readonly tag?: string;
    /**
     * The image tag or digest to use when pulling the image from ECR (digests must start with `sha256:`).
     * @default 'latest'
     */
    readonly tagOrDigest?: string;
}
/**
 * Represents a Docker image in ECR that can be bound as Lambda Code.
 */
export declare class EcrImageCode extends Code {
    private readonly repository;
    private readonly props;
    readonly isInline: boolean;
    constructor(repository: ecr.IRepository, props?: EcrImageCodeProps);
    bind(_: Construct): CodeConfig;
}
/**
 * Properties to initialize a new AssetImage
 */
export interface AssetImageCodeProps extends ecr_assets.DockerImageAssetOptions {
    /**
     * Specify or override the CMD on the specified Docker image or Dockerfile.
     * This needs to be in the 'exec form', viz., `[ 'executable', 'param1', 'param2' ]`.
     * @see https://docs.docker.com/engine/reference/builder/#cmd
     * @default - use the CMD specified in the docker image or Dockerfile.
     */
    readonly cmd?: string[];
    /**
     * Specify or override the ENTRYPOINT on the specified Docker image or Dockerfile.
     * An ENTRYPOINT allows you to configure a container that will run as an executable.
     * This needs to be in the 'exec form', viz., `[ 'executable', 'param1', 'param2' ]`.
     * @see https://docs.docker.com/engine/reference/builder/#entrypoint
     * @default - use the ENTRYPOINT in the docker image or Dockerfile.
     */
    readonly entrypoint?: string[];
    /**
     * Specify or override the WORKDIR on the specified Docker image or Dockerfile.
     * A WORKDIR allows you to configure the working directory the container will use.
     * @see https://docs.docker.com/engine/reference/builder/#workdir
     * @default - use the WORKDIR in the docker image or Dockerfile.
     */
    readonly workingDirectory?: string;
}
/**
 * Represents an ECR image that will be constructed from the specified asset and can be bound as Lambda code.
 */
export declare class AssetImageCode extends Code {
    private readonly directory;
    private readonly props;
    readonly isInline: boolean;
    private asset?;
    constructor(directory: string, props: AssetImageCodeProps);
    bind(scope: Construct): CodeConfig;
    bindToResource(resource: cdk.CfnResource, options?: ResourceBindOptions): void;
}
/**
 * Options when creating an asset from a Docker build.
 */
export interface DockerBuildAssetOptions extends cdk.DockerBuildOptions {
    /**
     * The path in the Docker image where the asset is located after the build
     * operation.
     *
     * @default /asset
     */
    readonly imagePath?: string;
    /**
     * The path on the local filesystem where the asset will be copied
     * using `docker cp`.
     *
     * @default - a unique temporary directory in the system temp directory
     */
    readonly outputPath?: string;
}
