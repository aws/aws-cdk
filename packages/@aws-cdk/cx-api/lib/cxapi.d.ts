export declare const OUTDIR_ENV = "CDK_OUTDIR";
export declare const CONTEXT_ENV = "CDK_CONTEXT_JSON";
/**
 * The name of the temporary file where the context is stored.
 */
export declare const CONTEXT_OVERFLOW_LOCATION_ENV = "CONTEXT_OVERFLOW_LOCATION_ENV";
/**
 * Environment variable set by the CDK CLI with the default AWS account ID.
 */
export declare const DEFAULT_ACCOUNT_ENV = "CDK_DEFAULT_ACCOUNT";
/**
 * Environment variable set by the CDK CLI with the default AWS region.
 */
export declare const DEFAULT_REGION_ENV = "CDK_DEFAULT_REGION";
/**
 * Version of Cloud Assembly expected by CDK CLI.
 *
 * CLI started emitting this at 1.10.1
 */
export declare const CLI_ASM_VERSION_ENV = "CDK_CLI_ASM_VERSION";
/**
 * Version of the CLI currently running.
 *
 * CLI started emitting this at 1.10.1
 */
export declare const CLI_VERSION_ENV = "CDK_CLI_VERSION";
/**
 * If a context value is an object with this key, it indicates an error
 */
export declare const PROVIDER_ERROR_KEY = "$providerError";
/**
 * This SSM parameter does not invalidate the template
 *
 * If this string occurs in the description of an SSM parameter, the CLI
 * will not assume that the stack must always be redeployed.
 */
export declare const SSMPARAM_NO_INVALIDATE = "[cdk:skip]";
