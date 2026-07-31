// output directory into which to emit synthesis outputs. CDK doesn't allow outdir
// to be specified both through the CDK_OUTDIR environment variable and the through
// aws:cdk:outdir context.
export const OUTDIR_ENV = 'CDK_OUTDIR';
export const CONTEXT_ENV = 'CDK_CONTEXT_JSON';

/**
 * If this environment variable is set, error codes of CDK-specific errors will be written to it.
 */
export const ERRORFILE_ENV = 'CDK_ERROR_FILE';

/**
 * If this environment variable is set, performance counters will be written to this file.
 */
export const PERF_COUNTERS_FILE_ENV = 'CDK_PERF_COUNTERS_FILE';

/**
 * The name of the temporary file where the context is stored.
 */
export const CONTEXT_OVERFLOW_LOCATION_ENV = 'CONTEXT_OVERFLOW_LOCATION_ENV';

/**
 * Environment variable set by the CDK CLI with the default AWS account ID.
 */
export const DEFAULT_ACCOUNT_ENV = 'CDK_DEFAULT_ACCOUNT';

/**
 * Environment variable set by the CDK CLI with the default AWS region.
 */
export const DEFAULT_REGION_ENV = 'CDK_DEFAULT_REGION';

/**
 * Version of Cloud Assembly expected by CDK Toolkit.
 *
 * Despite its name, this value applies to all version of the CDK Toolkit, not just the CLI.
 *
 * CLI started emitting this at 1.10.1
 */
export const CLI_ASM_VERSION_ENV = 'CDK_CLI_ASM_VERSION';

/**
 * Version of the CLI currently running.
 *
 * CLI started emitting this at 1.10.1
 * Will not be present if the CDK app is run by any Toolkit variation other than the CLI.
 */
export const CLI_VERSION_ENV = 'CDK_CLI_VERSION';

/**
 * Package & version of the CDK Toolkit running the app.
 *
 * In the format "<package>@x.y.z", e.g  "aws-cdk@2.1006.0" or "@aws-cdk/toolkit-lib@1.0.0"
 */
export const TOOLKIT_VERSION_ENV = 'CDK_TOOLKIT_VERSION';

/**
 * Context key to control whether validation errors cause synthesis to fail.
 *
 * When set to `true` (the default), validation failures will print errors to
 * stderr and set a non-zero exit code. Set to `false` to only write the JSON
 * report without failing synthesis.
 */
export const FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT = '@aws-cdk/core:failSynthOnValidationErrors';

/**
 * File name for the new validation report format (v2).
 *
 * Written to the cloud assembly directory during synthesis.
 */
export const VALIDATION_REPORT_FILE = 'validation-report.json';

/**
 * File name for the legacy validation report format.
 *
 * Only written when `VALIDATION_REPORT_JSON_CONTEXT` is set to `true`.
 */
export const LEGACY_VALIDATION_REPORT_FILE = 'policy-validation-report.json';

/**
 * Context key to opt-in to writing the legacy `policy-validation-report.json`.
 * Set to `true` for backwards compatibility with older CDK CLI versions that
 * expect the old report shape.
 */
export const VALIDATION_REPORT_JSON_CONTEXT = '@aws-cdk/core:validationReportJson';

/**
 * Context key to opt-in to strict CloudFormation validation errors.
 *
 * Set to `true` to fail synthesis even if CloudFormation validation produces as
 * much as warnings. We set this during testing, so that the default infrastructure
 * we ship doesn't produce warnings.
 *
 * If the tests produce unavaidable warnings, the test should explicitly acknowledge
 * the warnings.
 */
export const STRICT_CFN_VALIDATE_ERRORS = '@aws-cdk/core:strictCfnValidateErrors';

/**
 * Environment variable set by the CLI to indicate that the CDK app is running as a subprocess of the CLI, or not.
 *
 * Valid values: 'process' | 'inmemory'
 *
 * The app may make use this to producer nicer output for the given environment.
 * For example, in a subprocess, print a nice error message and exit with a
 * non-zero code, instead of throwing an exception.
 */
export const CDK_APP_MODE_ENV = 'CDK_APP_MODE';

/**
 * App mode, but configured via context
 */
export const CDK_APP_MODE_CONTEXT = '@aws-cdk/core:appMode';

