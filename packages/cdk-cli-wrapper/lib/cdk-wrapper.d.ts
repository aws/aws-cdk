import { DeployOptions, DestroyOptions, SynthOptions, ListOptions } from './commands';
/**
 * AWS CDK CLI operations
 */
export interface ICdk {
    /**
     * cdk deploy
     */
    deploy(options: DeployOptions): void;
    /**
     * cdk synth
     */
    synth(options: SynthOptions): void;
    /**
     * cdk destroy
     */
    destroy(options: DestroyOptions): void;
    /**
     * cdk list
     */
    list(options: ListOptions): string;
    /**
     * cdk synth fast
     */
    synthFast(options: SynthFastOptions): void;
}
/**
 * Options for synthing and bypassing the CDK CLI
 */
export interface SynthFastOptions {
    /**
     * The command to use to execute the app.
     * This is typically the same thing that normally
     * gets passed to `--app`
     *
     * e.g. "node 'bin/my-app.ts'"
     * or 'go run main.go'
     */
    readonly execCmd: string[];
    /**
     * Emits the synthesized cloud assembly into a directory
     *
     * @default cdk.out
     */
    readonly output?: string;
    /**
     * Additional context
     *
     * @default - no additional context
     */
    readonly context?: Record<string, string>;
    /**
     * Additional environment variables to set in the
     * execution environment
     *
     * @default - no additional env
     */
    readonly env?: {
        [name: string]: string;
    };
}
/**
 * Additional environment variables to set in the execution environment
 *
 * @deprecated Use raw property bags instead (object literals, `Map<String,Object>`, etc... )
 */
export interface Environment {
    /**
     * This index signature is not usable in non-TypeScript/JavaScript languages.
     *
     * @jsii ignore
     */
    [key: string]: string | undefined;
}
/**
 * AWS CDK client that provides an API to programatically execute the CDK CLI
 * by wrapping calls to exec the CLI
 */
export interface CdkCliWrapperOptions {
    /**
     * The directory to run the cdk commands from
     */
    readonly directory: string;
    /**
     * Additional environment variables to set
     * in the execution environment that will be running
     * the cdk commands
     *
     * @default - no additional env vars
     */
    readonly env?: {
        [name: string]: string;
    };
    /**
     * The path to the cdk executable
     *
     * @default 'aws-cdk/bin/cdk'
     */
    readonly cdkExecutable?: string;
    /**
     * Show the output from running the CDK CLI
     *
     * @default false
     */
    readonly showOutput?: boolean;
}
/**
 * Provides a programmatic interface for interacting with the CDK CLI by
 * wrapping the CLI with exec
 */
export declare class CdkCliWrapper implements ICdk {
    private readonly directory;
    private readonly env?;
    private readonly cdk;
    private readonly showOutput;
    constructor(options: CdkCliWrapperOptions);
    private validateArgs;
    list(options: ListOptions): string;
    /**
     * cdk deploy
     */
    deploy(options: DeployOptions): void;
    /**
     * cdk destroy
     */
    destroy(options: DestroyOptions): void;
    /**
     * cdk synth
     */
    synth(options: SynthOptions): void;
    /**
     * Do a CDK synth, mimicking the CLI (without actually using it)
     *
     * The CLI has a pretty slow startup time because of all the modules it needs to load,
     * Bypass it to be quicker!
     */
    synthFast(options: SynthFastOptions): void;
    private createDefaultArguments;
}
