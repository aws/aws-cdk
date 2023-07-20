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
        catch (e) {
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
        return utils_1.exec([this.cdk, 'ls', ...listCommandArgs], {
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
        utils_1.exec([this.cdk, 'deploy', ...deployCommandArgs], {
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
        utils_1.exec([this.cdk, 'destroy', ...destroyCommandArgs], {
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
        utils_1.exec([this.cdk, 'synth', ...synthCommandArgs], {
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
        utils_1.exec(options.execCmd, {
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
exports.CdkCliWrapper = CdkCliWrapper;
_a = JSII_RTTI_SYMBOL_1;
CdkCliWrapper[_a] = { fqn: "cdk-cli-wrapper.CdkCliWrapper", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXdyYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstd3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBZ0k7QUFDaEksbUNBQStCO0FBaUgvQjs7O0dBR0c7QUFDSCxNQUFhLGFBQWE7SUFNeEIsWUFBWSxPQUE2Qjs7Ozs7OytDQU45QixhQUFhOzs7O1FBT3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztRQUM5QyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQztTQUMzQztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsT0FBTyxDQUFDLGFBQWEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2xHO0tBQ0Y7SUFFTyxZQUFZLENBQUMsT0FBMEI7UUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUM5RDtLQUNGO0lBRU0sSUFBSSxDQUFDLE9BQW9COzs7Ozs7Ozs7O1FBQzlCLE1BQU0sZUFBZSxHQUFhO1lBQ2hDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDekMsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDO1NBQ3hDLENBQUM7UUFFRixPQUFPLFlBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLEVBQUU7WUFDaEQs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YSxFQUFFLENBQUM7SUFDNUIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUFZLEVBQUUsTUFBaUI7SUFDckQsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO0lBQ3hCLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxJQUFJLEVBQUUsRUFBRTtRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN4QjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsR0FBVyxFQUFFLEdBQWE7SUFDbEQsSUFBSSxHQUFHLEVBQUU7UUFDUCxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3JCO1NBQU0sSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQzVCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7U0FBTTtRQUNMLE9BQU8sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDeEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVmYXVsdENka09wdGlvbnMsIERlcGxveU9wdGlvbnMsIERlc3Ryb3lPcHRpb25zLCBTeW50aE9wdGlvbnMsIExpc3RPcHRpb25zLCBTdGFja0FjdGl2aXR5UHJvZ3Jlc3MgfSBmcm9tICcuL2NvbW1hbmRzJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiBBV1MgQ0RLIENMSSBvcGVyYXRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNkayB7XG5cbiAgLyoqXG4gICAqIGNkayBkZXBsb3lcbiAgICovXG4gIGRlcGxveShvcHRpb25zOiBEZXBsb3lPcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogY2RrIHN5bnRoXG4gICAqL1xuICBzeW50aChvcHRpb25zOiBTeW50aE9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBjZGsgZGVzdHJveVxuICAgKi9cbiAgZGVzdHJveShvcHRpb25zOiBEZXN0cm95T3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIGNkayBsaXN0XG4gICAqL1xuICBsaXN0KG9wdGlvbnM6IExpc3RPcHRpb25zKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBjZGsgc3ludGggZmFzdFxuICAgKi9cbiAgc3ludGhGYXN0KG9wdGlvbnM6IFN5bnRoRmFzdE9wdGlvbnMpOiB2b2lkO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHN5bnRoaW5nIGFuZCBieXBhc3NpbmcgdGhlIENESyBDTElcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTeW50aEZhc3RPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBjb21tYW5kIHRvIHVzZSB0byBleGVjdXRlIHRoZSBhcHAuXG4gICAqIFRoaXMgaXMgdHlwaWNhbGx5IHRoZSBzYW1lIHRoaW5nIHRoYXQgbm9ybWFsbHlcbiAgICogZ2V0cyBwYXNzZWQgdG8gYC0tYXBwYFxuICAgKlxuICAgKiBlLmcuIFwibm9kZSAnYmluL215LWFwcC50cydcIlxuICAgKiBvciAnZ28gcnVuIG1haW4uZ28nXG4gICAqL1xuICByZWFkb25seSBleGVjQ21kOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIHN5bnRoZXNpemVkIGNsb3VkIGFzc2VtYmx5IGludG8gYSBkaXJlY3RvcnlcbiAgICpcbiAgICogQGRlZmF1bHQgY2RrLm91dFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0Pzogc3RyaW5nLFxuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGNvbnRleHRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIGNvbnRleHRcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRleHQ/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBzZXQgaW4gdGhlXG4gICAqIGV4ZWN1dGlvbiBlbnZpcm9ubWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgZW52XG4gICAqL1xuICByZWFkb25seSBlbnY/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfVxufVxuXG4vKipcbiAqIEFkZGl0aW9uYWwgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHNldFxuICogaW4gdGhlIGV4ZWN1dGlvbiBlbnZpcm9ubWVudCB0aGF0IHdpbGwgYmUgcnVubmluZ1xuICogdGhlIGNkayBjb21tYW5kc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudmlyb25tZW50IHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkXG59XG5cbi8qKlxuICogQVdTIENESyBjbGllbnQgdGhhdCBwcm92aWRlcyBhbiBBUEkgdG8gcHJvZ3JhbWF0aWNhbGx5IGV4ZWN1dGUgdGhlIENESyBDTElcbiAqIGJ5IHdyYXBwaW5nIGNhbGxzIHRvIGV4ZWMgdGhlIENMSVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENka0NsaVdyYXBwZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBkaXJlY3RvcnkgdG8gcnVuIHRoZSBjZGsgY29tbWFuZHMgZnJvbVxuICAgKi9cbiAgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmcsXG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHNldFxuICAgKiBpbiB0aGUgZXhlY3V0aW9uIGVudmlyb25tZW50IHRoYXQgd2lsbCBiZSBydW5uaW5nXG4gICAqIHRoZSBjZGsgY29tbWFuZHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIGVudiB2YXJzXG4gICAqL1xuICByZWFkb25seSBlbnY/OiBFbnZpcm9ubWVudCxcblxuICAvKipcbiAgICogVGhlIHBhdGggdG8gdGhlIGNkayBleGVjdXRhYmxlXG4gICAqXG4gICAqIEBkZWZhdWx0ICdhd3MtY2RrL2Jpbi9jZGsnXG4gICAqL1xuICByZWFkb25seSBjZGtFeGVjdXRhYmxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTaG93IHRoZSBvdXRwdXQgZnJvbSBydW5uaW5nIHRoZSBDREsgQ0xJXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzaG93T3V0cHV0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIHByb2dyYW1tYXRpYyBpbnRlcmZhY2UgZm9yIGludGVyYWN0aW5nIHdpdGggdGhlIENESyBDTEkgYnlcbiAqIHdyYXBwaW5nIHRoZSBDTEkgd2l0aCBleGVjXG4gKi9cbmV4cG9ydCBjbGFzcyBDZGtDbGlXcmFwcGVyIGltcGxlbWVudHMgSUNkayB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgZW52PzogRW52aXJvbm1lbnQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2RrOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2hvd091dHB1dDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBDZGtDbGlXcmFwcGVyT3B0aW9ucykge1xuICAgIHRoaXMuZGlyZWN0b3J5ID0gb3B0aW9ucy5kaXJlY3Rvcnk7XG4gICAgdGhpcy5lbnYgPSBvcHRpb25zLmVudjtcbiAgICB0aGlzLnNob3dPdXRwdXQgPSBvcHRpb25zLnNob3dPdXRwdXQgPz8gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2RrID0gb3B0aW9ucy5jZGtFeGVjdXRhYmxlID8/ICdjZGsnO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgY291bGQgbm90IHJlc29sdmUgcGF0aCB0byBjZGsgZXhlY3V0YWJsZTogXCIke29wdGlvbnMuY2RrRXhlY3V0YWJsZSA/PyAnY2RrJ31cImApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVBcmdzKG9wdGlvbnM6IERlZmF1bHRDZGtPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKCFvcHRpb25zLnN0YWNrcyAmJiAhb3B0aW9ucy5hbGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb25lIG9mIFwiYXBwXCIgb3IgXCJzdGFja3NcIiBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGxpc3Qob3B0aW9uczogTGlzdE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxpc3RDb21tYW5kQXJnczogc3RyaW5nW10gPSBbXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdsb25nJywgb3B0aW9ucy5sb25nKSxcbiAgICAgIC4uLnRoaXMuY3JlYXRlRGVmYXVsdEFyZ3VtZW50cyhvcHRpb25zKSxcbiAgICBdO1xuXG4gICAgcmV0dXJuIGV4ZWMoW3RoaXMuY2RrLCAnbHMnLCAuLi5saXN0Q29tbWFuZEFyZ3NdLCB7XG4gICAgICBjd2Q6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgdmVyYm9zZTogdGhpcy5zaG93T3V0cHV0LFxuICAgICAgZW52OiB0aGlzLmVudixcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogY2RrIGRlcGxveVxuICAgKi9cbiAgcHVibGljIGRlcGxveShvcHRpb25zOiBEZXBsb3lPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc3QgZGVwbG95Q29tbWFuZEFyZ3M6IHN0cmluZ1tdID0gW1xuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnY2knLCBvcHRpb25zLmNpKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2V4ZWN1dGUnLCBvcHRpb25zLmV4ZWN1dGUpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZXhjbHVzaXZlbHknLCBvcHRpb25zLmV4Y2x1c2l2ZWx5KSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2ZvcmNlJywgb3B0aW9ucy5mb3JjZSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdwcmV2aW91cy1wYXJhbWV0ZXJzJywgb3B0aW9ucy51c2VQcmV2aW91c1BhcmFtZXRlcnMpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygncm9sbGJhY2snLCBvcHRpb25zLnJvbGxiYWNrKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3N0YWdpbmcnLCBvcHRpb25zLnN0YWdpbmcpLFxuICAgICAgLi4ub3B0aW9ucy5yZXVzZUFzc2V0cyA/IHJlbmRlckFycmF5QXJnKCctLXJldXNlLWFzc2V0cycsIG9wdGlvbnMucmV1c2VBc3NldHMpIDogW10sXG4gICAgICAuLi5vcHRpb25zLm5vdGlmaWNhdGlvbkFybnMgPyByZW5kZXJBcnJheUFyZygnLS1ub3RpZmljYXRpb24tYXJucycsIG9wdGlvbnMubm90aWZpY2F0aW9uQXJucykgOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMucGFyYW1ldGVycyA/IHJlbmRlck1hcEFycmF5QXJnKCctLXBhcmFtZXRlcnMnLCBvcHRpb25zLnBhcmFtZXRlcnMpIDogW10sXG4gICAgICAuLi5vcHRpb25zLm91dHB1dHNGaWxlID8gWyctLW91dHB1dHMtZmlsZScsIG9wdGlvbnMub3V0cHV0c0ZpbGVdIDogW10sXG4gICAgICAuLi5vcHRpb25zLnJlcXVpcmVBcHByb3ZhbCA/IFsnLS1yZXF1aXJlLWFwcHJvdmFsJywgb3B0aW9ucy5yZXF1aXJlQXBwcm92YWxdIDogW10sXG4gICAgICAuLi5vcHRpb25zLmNoYW5nZVNldE5hbWUgPyBbJy0tY2hhbmdlLXNldC1uYW1lJywgb3B0aW9ucy5jaGFuZ2VTZXROYW1lXSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy50b29sa2l0U3RhY2tOYW1lID8gWyctLXRvb2xraXQtc3RhY2stbmFtZScsIG9wdGlvbnMudG9vbGtpdFN0YWNrTmFtZV0gOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMucHJvZ3Jlc3MgPyBbJy0tcHJvZ3Jlc3MnLCBvcHRpb25zLnByb2dyZXNzXSA6IFsnLS1wcm9ncmVzcycsIFN0YWNrQWN0aXZpdHlQcm9ncmVzcy5FVkVOVFNdLFxuICAgICAgLi4udGhpcy5jcmVhdGVEZWZhdWx0QXJndW1lbnRzKG9wdGlvbnMpLFxuICAgIF07XG5cbiAgICBleGVjKFt0aGlzLmNkaywgJ2RlcGxveScsIC4uLmRlcGxveUNvbW1hbmRBcmdzXSwge1xuICAgICAgY3dkOiB0aGlzLmRpcmVjdG9yeSxcbiAgICAgIHZlcmJvc2U6IHRoaXMuc2hvd091dHB1dCxcbiAgICAgIGVudjogdGhpcy5lbnYsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY2RrIGRlc3Ryb3lcbiAgICovXG4gIHB1YmxpYyBkZXN0cm95KG9wdGlvbnM6IERlc3Ryb3lPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc3QgZGVzdHJveUNvbW1hbmRBcmdzOiBzdHJpbmdbXSA9IFtcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2ZvcmNlJywgb3B0aW9ucy5mb3JjZSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdleGNsdXNpdmVseScsIG9wdGlvbnMuZXhjbHVzaXZlbHkpLFxuICAgICAgLi4udGhpcy5jcmVhdGVEZWZhdWx0QXJndW1lbnRzKG9wdGlvbnMpLFxuICAgIF07XG5cbiAgICBleGVjKFt0aGlzLmNkaywgJ2Rlc3Ryb3knLCAuLi5kZXN0cm95Q29tbWFuZEFyZ3NdLCB7XG4gICAgICBjd2Q6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgdmVyYm9zZTogdGhpcy5zaG93T3V0cHV0LFxuICAgICAgZW52OiB0aGlzLmVudixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjZGsgc3ludGhcbiAgICovXG4gIHB1YmxpYyBzeW50aChvcHRpb25zOiBTeW50aE9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBzeW50aENvbW1hbmRBcmdzOiBzdHJpbmdbXSA9IFtcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3ZhbGlkYXRpb24nLCBvcHRpb25zLnZhbGlkYXRpb24pLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygncXVpZXQnLCBvcHRpb25zLnF1aWV0KSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2V4Y2x1c2l2ZWx5Jywgb3B0aW9ucy5leGNsdXNpdmVseSksXG4gICAgICAuLi50aGlzLmNyZWF0ZURlZmF1bHRBcmd1bWVudHMob3B0aW9ucyksXG4gICAgXTtcblxuICAgIGV4ZWMoW3RoaXMuY2RrLCAnc3ludGgnLCAuLi5zeW50aENvbW1hbmRBcmdzXSwge1xuICAgICAgY3dkOiB0aGlzLmRpcmVjdG9yeSxcbiAgICAgIHZlcmJvc2U6IHRoaXMuc2hvd091dHB1dCxcbiAgICAgIGVudjogdGhpcy5lbnYsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRG8gYSBDREsgc3ludGgsIG1pbWlja2luZyB0aGUgQ0xJICh3aXRob3V0IGFjdHVhbGx5IHVzaW5nIGl0KVxuICAgKlxuICAgKiBUaGUgQ0xJIGhhcyBhIHByZXR0eSBzbG93IHN0YXJ0dXAgdGltZSBiZWNhdXNlIG9mIGFsbCB0aGUgbW9kdWxlcyBpdCBuZWVkcyB0byBsb2FkLFxuICAgKiBCeXBhc3MgaXQgdG8gYmUgcXVpY2tlciFcbiAgICovXG4gIHB1YmxpYyBzeW50aEZhc3Qob3B0aW9uczogU3ludGhGYXN0T3B0aW9ucyk6IHZvaWQge1xuICAgIGV4ZWMob3B0aW9ucy5leGVjQ21kLCB7XG4gICAgICBjd2Q6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgdmVyYm9zZTogdGhpcy5zaG93T3V0cHV0LFxuICAgICAgZW52OiB7XG4gICAgICAgIENES19DT05URVhUX0pTT046IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuY29udGV4dCksXG4gICAgICAgIENES19PVVRESVI6IG9wdGlvbnMub3V0cHV0LFxuICAgICAgICAuLi50aGlzLmVudixcbiAgICAgICAgLi4ub3B0aW9ucy5lbnYsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEZWZhdWx0QXJndW1lbnRzKG9wdGlvbnM6IERlZmF1bHRDZGtPcHRpb25zKTogc3RyaW5nW10ge1xuICAgIHRoaXMudmFsaWRhdGVBcmdzKG9wdGlvbnMpO1xuICAgIGNvbnN0IHN0YWNrcyA9IG9wdGlvbnMuc3RhY2tzID8/IFtdO1xuICAgIHJldHVybiBbXG4gICAgICAuLi5vcHRpb25zLmFwcCA/IFsnLS1hcHAnLCBvcHRpb25zLmFwcF0gOiBbXSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3N0cmljdCcsIG9wdGlvbnMuc3RyaWN0KSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3RyYWNlJywgb3B0aW9ucy50cmFjZSksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdsb29rdXBzJywgb3B0aW9ucy5sb29rdXBzKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2lnbm9yZS1lcnJvcnMnLCBvcHRpb25zLmlnbm9yZUVycm9ycyksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdqc29uJywgb3B0aW9ucy5qc29uKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ3ZlcmJvc2UnLCBvcHRpb25zLnZlcmJvc2UpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnZGVidWcnLCBvcHRpb25zLmRlYnVnKSxcbiAgICAgIC4uLnJlbmRlckJvb2xlYW5BcmcoJ2VjMmNyZWRzJywgb3B0aW9ucy5lYzJDcmVkcyksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCd2ZXJzaW9uLXJlcG9ydGluZycsIG9wdGlvbnMudmVyc2lvblJlcG9ydGluZyksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdwYXRoLW1ldGFkYXRhJywgb3B0aW9ucy5wYXRoTWV0YWRhdGEpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnYXNzZXQtbWV0YWRhdGEnLCBvcHRpb25zLmFzc2V0TWV0YWRhdGEpLFxuICAgICAgLi4ucmVuZGVyQm9vbGVhbkFyZygnbm90aWNlcycsIG9wdGlvbnMubm90aWNlcyksXG4gICAgICAuLi5yZW5kZXJCb29sZWFuQXJnKCdjb2xvcicsIG9wdGlvbnMuY29sb3IpLFxuICAgICAgLi4ub3B0aW9ucy5jb250ZXh0ID8gcmVuZGVyTWFwQXJyYXlBcmcoJy0tY29udGV4dCcsIG9wdGlvbnMuY29udGV4dCkgOiBbXSxcbiAgICAgIC4uLm9wdGlvbnMucHJvZmlsZSA/IFsnLS1wcm9maWxlJywgb3B0aW9ucy5wcm9maWxlXSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5wcm94eSA/IFsnLS1wcm94eScsIG9wdGlvbnMucHJveHldIDogW10sXG4gICAgICAuLi5vcHRpb25zLmNhQnVuZGxlUGF0aCA/IFsnLS1jYS1idW5kbGUtcGF0aCcsIG9wdGlvbnMuY2FCdW5kbGVQYXRoXSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5yb2xlQXJuID8gWyctLXJvbGUtYXJuJywgb3B0aW9ucy5yb2xlQXJuXSA6IFtdLFxuICAgICAgLi4ub3B0aW9ucy5vdXRwdXQgPyBbJy0tb3V0cHV0Jywgb3B0aW9ucy5vdXRwdXRdIDogW10sXG4gICAgICAuLi5zdGFja3MsXG4gICAgICAuLi5vcHRpb25zLmFsbCA/IFsnLS1hbGwnXSA6IFtdLFxuICAgIF07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyTWFwQXJyYXlBcmcoZmxhZzogc3RyaW5nLCBwYXJhbWV0ZXJzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWQgfSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcGFyYW1zOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwYXJhbWV0ZXJzKSkge1xuICAgIHBhcmFtcy5wdXNoKGAke2tleX09JHt2YWx1ZX1gKTtcbiAgfVxuICByZXR1cm4gcmVuZGVyQXJyYXlBcmcoZmxhZywgcGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQXJyYXlBcmcoZmxhZzogc3RyaW5nLCB2YWx1ZXM/OiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgbGV0IGFyZ3M6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzID8/IFtdKSB7XG4gICAgYXJncy5wdXNoKGZsYWcsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gYXJncztcbn1cblxuZnVuY3Rpb24gcmVuZGVyQm9vbGVhbkFyZyh2YWw6IHN0cmluZywgYXJnPzogYm9vbGVhbik6IHN0cmluZ1tdIHtcbiAgaWYgKGFyZykge1xuICAgIHJldHVybiBbYC0tJHt2YWx9YF07XG4gIH0gZWxzZSBpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gW107XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtgLS1uby0ke3ZhbH1gXTtcbiAgfVxufVxuIl19