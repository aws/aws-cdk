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
 * Version of Cloud Assembly expected by CDK CLI.
 *
 * CLI started emitting this at 1.10.1
 */
export const CLI_ASM_VERSION_ENV = 'CDK_CLI_ASM_VERSION';

/**
 * Version of the CLI currently running.
 *
 * CLI started emitting this at 1.10.1
 */
export const CLI_VERSION_ENV = 'CDK_CLI_VERSION';

/**
 * If a context value is an object with this key, it indicates an error
 */
export const PROVIDER_ERROR_KEY = '$providerError';