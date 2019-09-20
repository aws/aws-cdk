// output directory into which to emit synthesis outputs. CDK doesn't allow outdir
// to be specified both through the CDK_OUTDIR environment variable and the through
// aws:cdk:outdir context.
export const OUTDIR_ENV = 'CDK_OUTDIR';
export const CONTEXT_ENV = 'CDK_CONTEXT_JSON';

/**
 * Environment variable set by the CDK CLI with the default AWS account ID.
 */
export const DEFAULT_ACCOUNT_ENV = 'CDK_DEFAULT_ACCOUNT';

/**
 * Environment variable set by the CDK CLI with the default AWS region.
 */
export const DEFAULT_REGION_ENV = 'CDK_DEFAULT_REGION';

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

/**
 * If a context value is an object with this key, it indicates an error
 */
export const PROVIDER_ERROR_KEY = '$providerError';