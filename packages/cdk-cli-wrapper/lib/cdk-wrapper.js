"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkCliWrapper = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const commands_1 = require("./commands");
const utils_1 = require("./utils");
/**
 * Provides a programmatic interface for interacting with the CDK CLI by
 * wrapping the CLI with exec
 */
class CdkCliWrapper {
    constructor(options) {
        try {
            jsiiDeprecationWarnings.cdk_cli_wrapper_CdkCliWrapperOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CdkCliWrapper);
            }
            throw error;
        }
        this.directory = options.directory;
        this.env = options.env;
        this.showOutput = options.showOutput ?? false;
        try {
            this.cdk = options.cdkExecutable ?? 'cdk';
        }
        catch {
            throw new Error(`could not resolve path to cdk executable: "${options.cdkExecutable ?? 'cdk'}"`);
        }
    }
    validateArgs(options) {
        if (!options.stacks && !options.all) {
            throw new Error('one of "app" or "stacks" must be provided');
        }
    }
    list(options) {
        try {
            jsiiDeprecationWarnings.cdk_cli_wrapper_ListOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.list);
            }
            throw error;
        }
        const listCommandArgs = [
            ...renderBooleanArg('long', options.long),
            ...this.createDefaultArguments(options),
        ];
        return (0, utils_1.exec)([this.cdk, 'ls', ...listCommandArgs], {
            cwd: this.directory,
            verbose: this.showOutput,
            env: this.env,
        });
    }
    /**
     * cdk deploy
     */
    deploy(options) {
        try {
            jsiiDeprecationWarnings.cdk_cli_wrapper_DeployOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.deploy);
            }
            throw error;
        }
        const deployCommandArgs = [
            ...renderBooleanArg('ci', options.ci),
            ...renderBooleanArg('execute', options.execute),
            ...renderBooleanArg('exclusively', options.exclusively),
            ...renderBooleanArg('force', options.force),
            ...renderBooleanArg('previous-parameters', options.usePreviousParameters),
            ...renderBooleanArg('rollback', options.rollback),
            ...renderBooleanArg('staging', options.staging),
            ...options.reuseAssets ? renderArrayArg('--reuse-assets', options.reuseAssets) : [],
            ...options.notificationArns ? renderArrayArg('--notification-arns', options.notificationArns) : [],
            ...options.parameters ? renderMapArrayArg('--parameters', options.parameters) : [],
            ...options.outputsFile ? ['--outputs-file', options.outputsFile] : [],
            ...options.requireApproval ? ['--require-approval', options.requireApproval] : [],
            ...options.changeSetName ? ['--change-set-name', options.changeSetName] : [],
            ...options.toolkitStackName ? ['--toolkit-stack-name', options.toolkitStackName] : [],
            ...options.progress ? ['--progress', options.progress] : ['--progress', commands_1.StackActivityProgress.EVENTS],
            ...this.createDefaultArguments(options),
        ];
        (0, utils_1.exec)([this.cdk, 'deploy', ...deployCommandArgs], {
            cwd: this.directory,
            verbose: this.showOutput,
            env: this.env,
        });
    }
    /**
     * cdk destroy
     */
    destroy(options) {
        try {
            jsiiDeprecationWarnings.cdk_cli_wrapper_DestroyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.destroy);
            }
            throw error;
        }
        const destroyCommandArgs = [
            ...renderBooleanArg('force', options.force),
            ...renderBooleanArg('exclusively', options.exclusively),
            ...this.createDefaultArguments(options),
        ];
        (0, utils_1.exec)([this.cdk, 'destroy', ...destroyCommandArgs], {
            cwd: this.directory,
            verbose: this.showOutput,
            env: this.env,
        });
    }
    /**
     * cdk synth
     */
    synth(options) {
        try {
            jsiiDeprecationWarnings.cdk_cli_wrapper_SynthOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synth);
            }
            throw error;
        }
        const synthCommandArgs = [
            ...renderBooleanArg('validation', options.validation),
            ...renderBooleanArg('quiet', options.quiet),
            ...renderBooleanArg('exclusively', options.exclusively),
            ...this.createDefaultArguments(options),
        ];
        (0, utils_1.exec)([this.cdk, 'synth', ...synthCommandArgs], {
            cwd: this.directory,
            verbose: this.showOutput,
            env: this.env,
        });
    }
    /**
     * Do a CDK synth, mimicking the CLI (without actually using it)
     *
     * The CLI has a pretty slow startup time because of all the modules it needs to load,
     * Bypass it to be quicker!
     */
    synthFast(options) {
        try {
            jsiiDeprecationWarnings.cdk_cli_wrapper_SynthFastOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthFast);
            }
            throw error;
        }
        (0, utils_1.exec)(options.execCmd, {
            cwd: this.directory,
            verbose: this.showOutput,
            env: {
                CDK_CONTEXT_JSON: JSON.stringify(options.context),
                CDK_OUTDIR: options.output,
                ...this.env,
                ...options.env,
            },
        });
    }
    createDefaultArguments(options) {
        this.validateArgs(options);
        const stacks = options.stacks ?? [];
        return [
            ...options.app ? ['--app', options.app] : [],
            ...renderBooleanArg('strict', options.strict),
            ...renderBooleanArg('trace', options.trace),
            ...renderBooleanArg('lookups', options.lookups),
            ...renderBooleanArg('ignore-errors', options.ignoreErrors),
            ...renderBooleanArg('json', options.json),
            ...renderBooleanArg('verbose', options.verbose),
            ...renderBooleanArg('debug', options.debug),
            ...renderBooleanArg('ec2creds', options.ec2Creds),
            ...renderBooleanArg('version-reporting', options.versionReporting),
            ...renderBooleanArg('path-metadata', options.pathMetadata),
            ...renderBooleanArg('asset-metadata', options.assetMetadata),
            ...renderBooleanArg('notices', options.notices),
            ...renderBooleanArg('color', options.color),
            ...options.context ? renderMapArrayArg('--context', options.context) : [],
            ...options.profile ? ['--profile', options.profile] : [],
            ...options.proxy ? ['--proxy', options.proxy] : [],
            ...options.caBundlePath ? ['--ca-bundle-path', options.caBundlePath] : [],
            ...options.roleArn ? ['--role-arn', options.roleArn] : [],
            ...options.output ? ['--output', options.output] : [],
            ...stacks,
            ...options.all ? ['--all'] : [],
        ];
    }
}
_a = JSII_RTTI_SYMBOL_1;
CdkCliWrapper[_a] = { fqn: "cdk-cli-wrapper.CdkCliWrapper", version: "0.0.0" };
exports.CdkCliWrapper = CdkCliWrapper;
function renderMapArrayArg(flag, parameters) {
    const params = [];
    for (const [key, value] of Object.entries(parameters)) {
        params.push(`${key}=${value}`);
    }
    return renderArrayArg(flag, params);
}
function renderArrayArg(flag, values) {
    let args = [];
    for (const value of values ?? []) {
        args.push(flag, value);
    }
    return args;
}
function renderBooleanArg(val, arg) {
    if (arg) {
        return [`--${val}`];
    }
    else if (arg === undefined) {
        return [];
    }
    else {
        return [`--no-${val}`];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBZ0k7QUFDaEksbUNBQStCO0FBc0gvQjs7O0dBR0c7QUFDSCxNQUFhLGFBQWE7SUFNeEIsWUFBWSxPQUE2Qjs7Ozs7OytDQU45QixhQUFhOzs7O1FBT3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztRQUM5QyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQztTQUMzQztRQUFDLE1BQU07WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxPQUFPLENBQUMsYUFBYSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDbEc7S0FDRjtJQUVPLFlBQVksQ0FBQyxPQUEwQjtRQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQzlEO0tBQ0Y7SUFFTSxJQUFJLENBQUMsT0FBb0I7Ozs7Ozs7Ozs7UUFDOUIsTUFBTSxlQUFlLEdBQWE7WUFDaEMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN6QyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUM7U0FDeEMsQ0FBQztRQUVGLE9BQU8sSUFBQSxZQUFJLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxFQUFFO1lBQ2hELEdBQUcs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ekYsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNoQztJQUNELE9BQU8sY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBWSxFQUFFLE1BQWlCO0lBQ3JELElBQUksSUFBSSxHQUFhLEVBQUUsQ0FBQztJQUN4QixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sSUFBSSxFQUFFLEVBQUU7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEdBQVcsRUFBRSxHQUFhO0lBQ2xELElBQUksR0FBRyxFQUFFO1FBQ1AsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQztLQUNyQjtTQUFNLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUM1QixPQUFPLEVBQUUsQ0FBQztLQUNYO1NBQU07UUFDTCxPQUFPLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlZmF1bHRDZGtPcHRpb25zLCBEZXBsb3lPcHRpb25zLCBEZXN0cm95T3B0aW9ucywgU3ludGhPcHRpb25zLCBMaXN0T3B0aW9ucywgU3RhY2tBY3Rpdml0eVByb2dyZXNzIH0gZnJvbSAnLi9jb21tYW5kcyc7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogQVdTIENESyBDTEkgb3BlcmF0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElDZGsge1xuXG4gIC8qKlxuICAgKiBjZGsgZGVwbG95XG4gICAqL1xuICBkZXBsb3kob3B0aW9uczogRGVwbG95T3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIGNkayBzeW50aFxuICAgKi9cbiAgc3ludGgob3B0aW9uczogU3ludGhPcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogY2RrIGRlc3Ryb3lcbiAgICovXG4gIGRlc3Ryb3kob3B0aW9uczogRGVzdHJveU9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBjZGsgbGlzdFxuICAgKi9cbiAgbGlzdChvcHRpb25zOiBMaXN0T3B0aW9ucyk6IHN0cmluZztcblxuICAvKipcbiAgICogY2RrIHN5bnRoIGZhc3RcbiAgICovXG4gIHN5bnRoRmFzdChvcHRpb25zOiBTeW50aEZhc3RPcHRpb25zKTogdm9pZDtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBzeW50aGluZyBhbmQgYnlwYXNzaW5nIHRoZSBDREsgQ0xJXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3ludGhGYXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgY29tbWFuZCB0byB1c2UgdG8gZXhlY3V0ZSB0aGUgYXBwLlxuICAgKiBUaGlzIGlzIHR5cGljYWxseSB0aGUgc2FtZSB0aGluZyB0aGF0IG5vcm1hbGx5XG4gICAqIGdldHMgcGFzc2VkIHRvIGAtLWFwcGBcbiAgICpcbiAgICogZS5nLiBcIm5vZGUgJ2Jpbi9teS1hcHAudHMnXCJcbiAgICogb3IgJ2dvIHJ1biBtYWluLmdvJ1xuICAgKi9cbiAgcmVhZG9ubHkgZXhlY0NtZDogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBzeW50aGVzaXplZCBjbG91ZCBhc3NlbWJseSBpbnRvIGEgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBkZWZhdWx0IGNkay5vdXRcbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dD86IHN0cmluZyxcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBjb250ZXh0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBjb250ZXh0XG4gICAqL1xuICByZWFkb25seSBjb250ZXh0PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPixcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gc2V0IGluIHRoZVxuICAgKiBleGVjdXRpb24gZW52aXJvbm1lbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIGVudlxuICAgKi9cbiAgcmVhZG9ubHkgZW52PzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nOyB9LFxufVxuXG4vKipcbiAqIEFkZGl0aW9uYWwgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHNldCBpbiB0aGUgZXhlY3V0aW9uIGVudmlyb25tZW50XG4gKlxuICogQGRlcHJlY2F0ZWQgVXNlIHJhdyBwcm9wZXJ0eSBiYWdzIGluc3RlYWQgKG9iamVjdCBsaXRlcmFscywgYE1hcDxTdHJpbmcsT2JqZWN0PmAsIGV0Yy4uLiApXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnQge1xuICAvKipcbiAgICogVGhpcyBpbmRleCBzaWduYXR1cmUgaXMgbm90IHVzYWJsZSBpbiBub24tVHlwZVNjcmlwdC9KYXZhU2NyaXB0IGxhbmd1YWdlcy5cbiAgICpcbiAgICogQGpzaWkgaWdub3JlXG4gICAqL1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWRcbn1cblxuLyoqXG4gKiBBV1MgQ0RLIGNsaWVudCB0aGF0IHByb3ZpZGVzIGFuIEFQSSB0byBwcm9ncmFtYXRpY2FsbHkgZXhlY3V0ZSB0aGUgQ0RLIENMSVxuICogYnkgd3JhcHBpbmcgY2FsbHMgdG8gZXhlYyB0aGUgQ0xJXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2RrQ2xpV3JhcHBlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGRpcmVjdG9yeSB0byBydW4gdGhlIGNkayBjb21tYW5kcyBmcm9tXG4gICAqL1xuICByZWFkb25seSBkaXJlY3Rvcnk6IHN0cmluZyxcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gc2V0XG4gICAqIGluIHRoZSBleGVjdXRpb24gZW52aXJvbm1lbnQgdGhhdCB3aWxsIGJlIHJ1bm5pbmdcbiAgICogdGhlIGNkayBjb21tYW5kc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgZW52IHZhcnNcbiAgICovXG4gIHJlYWRvbmx5IGVudj86IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9LFxuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgY2RrIGV4ZWN1dGFibGVcbiAgICpcbiAgICogQGRlZmF1bHQgJ2F3cy1jZGsvYmluL2NkaydcbiAgICovXG4gIHJlYWRvbmx5IGNka0V4ZWN1dGFibGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIG91dHB1dCBmcm9tIHJ1bm5pbmcgdGhlIENESyBDTElcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNob3dPdXRwdXQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgcHJvZ3JhbW1hdGljIGludGVyZmFjZSBmb3IgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgQ0RLIENMSSBieVxuICogd3JhcHBpbmcgdGhlIENMSSB3aXRoIGV4ZWNcbiAqL1xuZXhwb3J0IGNsYXNzIENka0NsaVdyYXBwZXIgaW1wbGVtZW50cyBJQ2RrIHtcbiAgcHJpdmF0ZSByZWFkb25seSBkaXJlY3Rvcnk6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBlbnY/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWQ7IH07XG4gIHByaXZhdGUgcmVhZG9ubHkgY2RrOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2hvd091dHB1dDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBDZGtDbGlXcmFwcGVyT3B0aW9ucykge1xuICAgIHRoaXMuZGlyZWN0b3J5ID0gb3B0aW9ucy5kaXJlY3Rvcnk7XG4gICAgdGhpcy5lbnYgPSBvcHRpb25zLmVudjtcbiAgICB0aGlzLnNob3dPdXRwdXQgPSBvcHRpb25zLnNob3dPdXRwdXQgPz8gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2RrID0gb3B0aW9ucy5jZGtFeGVjdXRhYmxlID8/ICdjZGsnO1xuICAgIH0gY2F0Y2gge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBjb3VsZCBub3QgcmVzb2x2ZSBwYXRoIHRvIGNkayBleGVjdXRhYmxlOiBcIiR7b3B0aW9ucy5jZGtFeGVjdXRhYmxlID8/ICdjZGsnfVwiYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUFyZ3Mob3B0aW9uczogRGVmYXVsdENka09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAoIW9wdGlvbnMuc3RhY2tzICYmICFvcHRpb25zLmFsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvbmUgb2YgXCJhcHBcIiBvciBcInN0YWNrc1wiIG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbGlzdChvcHRpb25zOiBMaXN0T3B0aW9ucyk6IHN0cmluZyB7XG4gICAgY29uc3QgbGlzdENvbW1hbmRBcmdzOiBzdHJpbmdbXSA9IFtcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2xvbmcnLCBvcHRpb25zLmxvbmcpLFxuICAgICAgLi4udGhpcy5jcmVhdGVEZWZhdWx0QXJndW1lbnRzKG9wdGlvbnMpLFxuICAgIF07XG5cbiAgICByZXR1cm4gZXhlYyhbdGhpcy5jZGssICdscycsIC4uLmxpc3RDb21tYW5kQXJnc10sIHtcbiAgICAgIGN3ZDogdGhpcy5kaXJlY3RvcnksXG4gICAgICB2ZXJib3NlOiB0aGlzLnNob3dPdXRwdXQsXG4gICAgICBlbnY6IHRoaXMuZW52LFxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBjZGsgZGVwbG95XG4gICAqL1xuICBwdWJsaWMgZGVwbG95KG9wdGlvbnM6IERlcGxveU9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBkZXBsb3lDb21tYW5kQXJnczogc3RyaW5nW10gPSBbXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdjaScsIG9wdGlvbnMuY2kpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZXhlY3V0ZScsIG9wdGlvbnMuZXhlY3V0ZSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdleGNsdXNpdmVseScsIG9wdGlvbnMuZXhjbHVzaXZlbHkpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZm9yY2UnLCBvcHRpb25zLmZvcmNlKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3ByZXZpb3VzLXBhcmFtZXRlcnMnLCBvcHRpb25zLnVzZVByZXZpb3VzUGFyYW1ldGVycyksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdyb2xsYmFjaycsIG9wdGlvbnMucm9sbGJhY2spLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnc3RhZ2luZycsIG9wdGlvbnMuc3RhZ2luZyksXG4gICAgICAuLi5vcHRpb25zLnJldXNlQXNzZXRzID8gcmVuZGVyQXJyYXlBcmcoJy0tcmV1c2UtYXNzZXRzJywgb3B0aW9ucy5yZXVzZUFzc2V0cykgOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMubm90aWZpY2F0aW9uQXJucyA/IHJlbmRlckFycmF5QXJnKCctLW5vdGlmaWNhdGlvbi1hcm5zJywgb3B0aW9ucy5ub3RpZmljYXRpb25Bcm5zKSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5wYXJhbWV0ZXJzID8gcmVuZGVyTWFwQXJyYXlBcmcoJy0tcGFyYW1ldGVycycsIG9wdGlvbnMucGFyYW1ldGVycykgOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMub3V0cHV0c0ZpbGUgPyBbJy0tb3V0cHV0cy1maWxlJywgb3B0aW9ucy5vdXRwdXRzRmlsZV0gOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMucmVxdWlyZUFwcHJvdmFsID8gWyctLXJlcXVpcmUtYXBwcm92YWwnLCBvcHRpb25zLnJlcXVpcmVBcHByb3ZhbF0gOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMuY2hhbmdlU2V0TmFtZSA/IFsnLS1jaGFuZ2Utc2V0LW5hbWUnLCBvcHRpb25zLmNoYW5nZVNldE5hbWVdIDogW10sXG4gICAgICAuLi5vcHRpb25zLnRvb2xraXRTdGFja05hbWUgPyBbJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgb3B0aW9ucy50b29sa2l0U3RhY2tOYW1lXSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5wcm9ncmVzcyA/IFsnLS1wcm9ncmVzcycsIG9wdGlvbnMucHJvZ3Jlc3NdIDogWyctLXByb2dyZXNzJywgU3RhY2tBY3Rpdml0eVByb2dyZXNzLkVWRU5UU10sXG4gICAgICAuLi50aGlzLmNyZWF0ZURlZmF1bHRBcmd1bWVudHMob3B0aW9ucyksXG4gICAgXTtcblxuICAgIGV4ZWMoW3RoaXMuY2RrLCAnZGVwbG95JywgLi4uZGVwbG95Q29tbWFuZEFyZ3NdLCB7XG4gICAgICBjd2Q6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgdmVyYm9zZTogdGhpcy5zaG93T3V0cHV0LFxuICAgICAgZW52OiB0aGlzLmVudixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjZGsgZGVzdHJveVxuICAgKi9cbiAgcHVibGljIGRlc3Ryb3kob3B0aW9uczogRGVzdHJveU9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0cm95Q29tbWFuZEFyZ3M6IHN0cmluZ1tdID0gW1xuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZm9yY2UnLCBvcHRpb25zLmZvcmNlKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2V4Y2x1c2l2ZWx5Jywgb3B0aW9ucy5leGNsdXNpdmVseSksXG4gICAgICAuLi50aGlzLmNyZWF0ZURlZmF1bHRBcmd1bWVudHMob3B0aW9ucyksXG4gICAgXTtcblxuICAgIGV4ZWMoW3RoaXMuY2RrLCAnZGVzdHJveScsIC4uLmRlc3Ryb3lDb21tYW5kQXJnc10sIHtcbiAgICAgIGN3ZDogdGhpcy5kaXJlY3RvcnksXG4gICAgICB2ZXJib3NlOiB0aGlzLnNob3dPdXRwdXQsXG4gICAgICBlbnY6IHRoaXMuZW52LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNkayBzeW50aFxuICAgKi9cbiAgcHVibGljIHN5bnRoKG9wdGlvbnM6IFN5bnRoT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IHN5bnRoQ29tbWFuZEFyZ3M6IHN0cmluZ1tdID0gW1xuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygndmFsaWRhdGlvbicsIG9wdGlvbnMudmFsaWRhdGlvbiksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdxdWlldCcsIG9wdGlvbnMucXVpZXQpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZXhjbHVzaXZlbHknLCBvcHRpb25zLmV4Y2x1c2l2ZWx5KSxcbiAgICAgIC4uLnRoaXMuY3JlYXRlRGVmYXVsdEFyZ3VtZW50cyhvcHRpb25zKSxcbiAgICBdO1xuXG4gICAgZXhlYyhbdGhpcy5jZGssICdzeW50aCcsIC4uLnN5bnRoQ29tbWFuZEFyZ3NdLCB7XG4gICAgICBjd2Q6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgdmVyYm9zZTogdGhpcy5zaG93T3V0cHV0LFxuICAgICAgZW52OiB0aGlzLmVudixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEbyBhIENESyBzeW50aCwgbWltaWNraW5nIHRoZSBDTEkgKHdpdGhvdXQgYWN0dWFsbHkgdXNpbmcgaXQpXG4gICAqXG4gICAqIFRoZSBDTEkgaGFzIGEgcHJldHR5IHNsb3cgc3RhcnR1cCB0aW1lIGJlY2F1c2Ugb2YgYWxsIHRoZSBtb2R1bGVzIGl0IG5lZWRzIHRvIGxvYWQsXG4gICAqIEJ5cGFzcyBpdCB0byBiZSBxdWlja2VyIVxuICAgKi9cbiAgcHVibGljIHN5bnRoRmFzdChvcHRpb25zOiBTeW50aEZhc3RPcHRpb25zKTogdm9pZCB7XG4gICAgZXhlYyhvcHRpb25zLmV4ZWNDbWQsIHtcbiAgICAgIGN3ZDogdGhpcy5kaXJlY3RvcnksXG4gICAgICB2ZXJib3NlOiB0aGlzLnNob3dPdXRwdXQsXG4gICAgICBlbnY6IHtcbiAgICAgICAgQ0RLX0NPTlRFWFRfSlNPTjogSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5jb250ZXh0KSxcbiAgICAgICAgQ0RLX09VVERJUjogb3B0aW9ucy5vdXRwdXQsXG4gICAgICAgIC4uLnRoaXMuZW52LFxuICAgICAgICAuLi5vcHRpb25zLmVudixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURlZmF1bHRBcmd1bWVudHMob3B0aW9uczogRGVmYXVsdENka09wdGlvbnMpOiBzdHJpbmdbXSB7XG4gICAgdGhpcy52YWxpZGF0ZUFyZ3Mob3B0aW9ucyk7XG4gICAgY29uc3Qgc3RhY2tzID0gb3B0aW9ucy5zdGFja3MgPz8gW107XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLm9wdGlvbnMuYXBwID8gWyctLWFwcCcsIG9wdGlvbnMuYXBwXSA6IFtdLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnc3RyaWN0Jywgb3B0aW9ucy5zdHJpY3QpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygndHJhY2UnLCBvcHRpb25zLnRyYWNlKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2xvb2t1cHMnLCBvcHRpb25zLmxvb2t1cHMpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnaWdub3JlLWVycm9ycycsIG9wdGlvbnMuaWdub3JlRXJyb3JzKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2pzb24nLCBvcHRpb25zLmpzb24pLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygndmVyYm9zZScsIG9wdGlvbnMudmVyYm9zZSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdkZWJ1ZycsIG9wdGlvbnMuZGVidWcpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZWMyY3JlZHMnLCBvcHRpb25zLmVjMkNyZWRzKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3ZlcnNpb24tcmVwb3J0aW5nJywgb3B0aW9ucy52ZXJzaW9uUmVwb3J0aW5nKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3BhdGgtbWV0YWRhdGEnLCBvcHRpb25zLnBhdGhNZXRhZGF0YSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdhc3NldC1tZXRhZGF0YScsIG9wdGlvbnMuYXNzZXRNZXRhZGF0YSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdub3RpY2VzJywgb3B0aW9ucy5ub3RpY2VzKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2NvbG9yJywgb3B0aW9ucy5jb2xvciksXG4gICAgICAuLi5vcHRpb25zLmNvbnRleHQgPyByZW5kZXJNYXBBcnJheUFyZygnLS1jb250ZXh0Jywgb3B0aW9ucy5jb250ZXh0KSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5wcm9maWxlID8gWyctLXByb2ZpbGUnLCBvcHRpb25zLnByb2ZpbGVdIDogW10sXG4gICAgICAuLi5vcHRpb25zLnByb3h5ID8gWyctLXByb3h5Jywgb3B0aW9ucy5wcm94eV0gOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMuY2FCdW5kbGVQYXRoID8gWyctLWNhLWJ1bmRsZS1wYXRoJywgb3B0aW9ucy5jYUJ1bmRsZVBhdGhdIDogW10sXG4gICAgICAuLi5vcHRpb25zLnJvbGVBcm4gPyBbJy0tcm9sZS1hcm4nLCBvcHRpb25zLnJvbGVBcm5dIDogW10sXG4gICAgICAuLi5vcHRpb25zLm91dHB1dCA/IFsnLS1vdXRwdXQnLCBvcHRpb25zLm91dHB1dF0gOiBbXSxcbiAgICAgIC4uLnN0YWNrcyxcbiAgICAgIC4uLm9wdGlvbnMuYWxsID8gWyctLWFsbCddIDogW10sXG4gICAgXTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJNYXBBcnJheUFyZyhmbGFnOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZCB9KTogc3RyaW5nW10ge1xuICBjb25zdCBwYXJhbXM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHBhcmFtZXRlcnMpKSB7XG4gICAgcGFyYW1zLnB1c2goYCR7a2V5fT0ke3ZhbHVlfWApO1xuICB9XG4gIHJldHVybiByZW5kZXJBcnJheUFyZyhmbGFnLCBwYXJhbXMpO1xufVxuXG5mdW5jdGlvbiByZW5kZXJBcnJheUFyZyhmbGFnOiBzdHJpbmcsIHZhbHVlcz86IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBsZXQgYXJnczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMgPz8gW10pIHtcbiAgICBhcmdzLnB1c2goZmxhZywgdmFsdWUpO1xuICB9XG4gIHJldHVybiBhcmdzO1xufVxuXG5mdW5jdGlvbiByZW5kZXJCb29sZWFuQXJnKHZhbDogc3RyaW5nLCBhcmc/OiBib29sZWFuKTogc3RyaW5nW10ge1xuICBpZiAoYXJnKSB7XG4gICAgcmV0dXJuIFtgLS0ke3ZhbH1gXTtcbiAgfSBlbHNlIGlmIChhcmcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBbXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW2AtLW5vLSR7dmFsfWBdO1xuICB9XG59XG4iXX0=