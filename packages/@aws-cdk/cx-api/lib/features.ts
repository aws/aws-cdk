
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
 * If this is set, multiple stacks can use the same stack name (e.g. deployed to
 * different environments). This means that the name of the synthesized template
 * file will be based on the construct path and not on the defined `stackName`
 * of the stack.
 *
 * This is a "future flag": the feature is disabled by default for backwards
 * compatibility, but new projects created using `cdk init` will have this
 * enabled through the generated `cdk.json`.
 */
export const ENABLE_STACK_NAME_DUPLICATES_CONTEXT = '@aws-cdk/core:enableStackNameDuplicates';