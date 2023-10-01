import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';
import { RuntimeFamily } from './runtime';
/**
 * The code the canary should execute
 */
export declare abstract class Code {
    /**
     * Specify code inline.
     *
     * @param code The actual handler code (limited to 5MB)
     *
     * @returns `InlineCode` with inline code.
     */
    static fromInline(code: string): InlineCode;
    /**
     * Specify code from a local path. Path must include the folder structure `nodejs/node_modules/myCanaryFilename.js`.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html#CloudWatch_Synthetics_Canaries_write_from_scratch
     *
     * @param assetPath Either a directory or a .zip file
     *
     * @returns `AssetCode` associated with the specified path.
     */
    static fromAsset(assetPath: string, options?: s3_assets.AssetOptions): AssetCode;
    /**
     * Specify code from an s3 bucket. The object in the s3 bucket must be a .zip file that contains
     * the structure `nodejs/node_modules/myCanaryFilename.js`.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html#CloudWatch_Synthetics_Canaries_write_from_scratch
     *
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     *
     * @returns `S3Code` associated with the specified S3 object.
     */
    static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code;
    /**
     * Called when the canary is initialized to allow this object to bind
     * to the stack, add resources and have fun.
     *
     * @param scope The binding scope. Don't be smart about trying to down-cast or
     *              assume it's initialized. You may just use it as a construct scope.
     *
     * @returns a bound `CodeConfig`.
     */
    abstract bind(scope: Construct, handler: string, family: RuntimeFamily): CodeConfig;
}
/**
 * Configuration of the code class
 */
export interface CodeConfig {
    /**
     * The location of the code in S3 (mutually exclusive with `inlineCode`).
     *
     * @default - none
     */
    readonly s3Location?: s3.Location;
    /**
     * Inline code (mutually exclusive with `s3Location`).
     *
     * @default - none
     */
    readonly inlineCode?: string;
}
/**
 * Canary code from an Asset
 */
export declare class AssetCode extends Code {
    private assetPath;
    private options?;
    private asset?;
    /**
     * @param assetPath The path to the asset file or directory.
     */
    constructor(assetPath: string, options?: s3_assets.AssetOptions | undefined);
    bind(scope: Construct, handler: string, family: RuntimeFamily): CodeConfig;
    /**
     * Validates requirements specified by the canary resource. For example, the canary code with handler `index.handler`
     * must be found in the file structure `nodejs/node_modules/index.js`.
     *
     * Requires path to be either zip file or directory.
     * Requires asset directory to have the structure 'nodejs/node_modules'.
     * Requires canary file to be directly inside node_modules folder.
     * Requires canary file name matches the handler name.
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html
     */
    private validateCanaryAsset;
}
/**
 * Canary code from an inline string.
 */
export declare class InlineCode extends Code {
    private code;
    constructor(code: string);
    bind(_scope: Construct, handler: string, _family: RuntimeFamily): CodeConfig;
}
/**
 * S3 bucket path to the code zip file
 */
export declare class S3Code extends Code {
    private bucket;
    private key;
    private objectVersion?;
    constructor(bucket: s3.IBucket, key: string, objectVersion?: string | undefined);
    bind(_scope: Construct, _handler: string, _family: RuntimeFamily): CodeConfig;
}
