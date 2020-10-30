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
 * Enable the collection and reporting of version information.
 */
export const ANALYTICS_REPORTING_ENABLED_CONTEXT = 'aws:cdk:version-reporting';

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
export const DISABLE_ASSET_STAGING_CONTEXT = 'aws:cdk:disable-asset-staging';

/**
 * If this context key is set, the CDK will stage assets under the specified
 * directory. Otherwise, assets will not be staged.
 * Omits stack traces from construct metadata entries.
 */
export const DISABLE_METADATA_STACK_TRACE = 'aws:cdk:disable-stack-trace';

/**
 * Run bundling for stacks specified in this context key
 */
export const BUNDLING_STACKS = 'aws:cdk:bundling-stacks';
