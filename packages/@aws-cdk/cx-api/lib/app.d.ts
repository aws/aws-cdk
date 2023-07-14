/**
 * Enables the embedding of the "aws:cdk:path" in CloudFormation template metadata.
 */
export declare const PATH_METADATA_ENABLE_CONTEXT = "aws:cdk:enable-path-metadata";
/**
 * Enable the collection and reporting of version information.
 */
export declare const ANALYTICS_REPORTING_ENABLED_CONTEXT = "aws:cdk:version-reporting";
/**
 * Disable asset staging (for use with SAM CLI).
 *
 * Disabling asset staging means that copyable assets will not be copied to the
 * output directory and will be referenced with absolute paths.
 *
 * Not copied to the output directory: this is so users can iterate on the
 * Lambda source and run SAM CLI without having to re-run CDK (note: we
 * cannot achieve this for bundled assets, if assets are bundled they
 * will have to re-run CDK CLI to re-bundle updated versions).
 *
 * Absolute path: SAM CLI expects `cwd`-relative paths in a resource's
 * `aws:asset:path` metadata. In order to be predictable, we will always output
 * absolute paths.
 */
export declare const DISABLE_ASSET_STAGING_CONTEXT = "aws:cdk:disable-asset-staging";
/**
 * If this context key is set, the CDK will stage assets under the specified
 * directory. Otherwise, assets will not be staged.
 * Omits stack traces from construct metadata entries.
 */
export declare const DISABLE_METADATA_STACK_TRACE = "aws:cdk:disable-stack-trace";
/**
 * If this context key is set, the CDK will not store logical ID
 * metadata in the manifest.
 */
export declare const DISABLE_LOGICAL_ID_METADATA = "aws:cdk:disable-logicalId-metadata";
/**
 * Run bundling for stacks specified in this context key
 */
export declare const BUNDLING_STACKS = "aws:cdk:bundling-stacks";
