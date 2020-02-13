// --------------------------------------------------------------------------------
// This file declares context keys that are used by the CLI to control the
// behavior of CDK apps. Contrary to feature flags (which are defined under
// `features.ts`) these options are not bound to be removed in the next major
// version.
// --------------------------------------------------------------------------------

/**
 * Enables the embedding of the "aws:cdk:path" in CloudFormation template metadata.
 */
export const PATH_METADATA_ENABLE_CONTEXT = 'aws:cdk:enable-path-metadata';

/**
 * Disable the collection and reporting of version information.
 */
export const DISABLE_VERSION_REPORTING = 'aws:cdk:disable-version-reporting';

/**
 * If this is set, asset staging is disabled. This means that assets will not be copied to
 * the output directory and will be referenced with absolute source paths.
 */
export const DISABLE_ASSET_STAGING_CONTEXT = 'aws:cdk:disable-asset-staging';

/**
 * If this context key is set, the CDK will stage assets under the specified
 * directory. Otherwise, assets will not be staged.
 * Omits stack traces from construct metadata entries.
 */
export const DISABLE_METADATA_STACK_TRACE = 'aws:cdk:disable-stack-trace';
