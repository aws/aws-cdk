import { Construct } from 'constructs';
import { ICustomSynthesis } from './private/synthesis';
import { IReusableStackSynthesizer } from './stack-synthesizers';
import { Stage } from './stage';
import { IPolicyValidationPluginBeta1 } from './validation/validation';
/**
 * Initialization props for apps.
 */
export interface AppProps {
    /**
     * Automatically call `synth()` before the program exits.
     *
     * If you set this, you don't have to call `synth()` explicitly. Note that
     * this feature is only available for certain programming languages, and
     * calling `synth()` is still recommended.
     *
     * @default true if running via CDK CLI (`CDK_OUTDIR` is set), `false`
     * otherwise
     */
    readonly autoSynth?: boolean;
    /**
     * The output directory into which to emit synthesized artifacts.
     *
     * You should never need to set this value. By default, the value you pass to
     * the CLI's `--output` flag will be used, and if you change it to a different
     * directory the CLI will fail to pick up the generated Cloud Assembly.
     *
     * This property is intended for internal and testing use.
     *
     * @default - If this value is _not_ set, considers the environment variable `CDK_OUTDIR`.
     *            If `CDK_OUTDIR` is not defined, uses a temp directory.
     */
    readonly outdir?: string;
    /**
     * Include construct creation stack trace in the `aws:cdk:trace` metadata key of all constructs.
     * @default true stack traces are included unless `aws:cdk:disable-stack-trace` is set in the context.
     */
    readonly stackTraces?: boolean;
    /**
     * Include runtime versioning information in the Stacks of this app
     *
     * @deprecated use `versionReporting` instead
     * @default Value of 'aws:cdk:version-reporting' context key
     */
    readonly runtimeInfo?: boolean;
    /**
     * Include runtime versioning information in the Stacks of this app
     *
     * @default Value of 'aws:cdk:version-reporting' context key
     */
    readonly analyticsReporting?: boolean;
    /**
     * Additional context values for the application.
     *
     * Context set by the CLI or the `context` key in `cdk.json` has precedence.
     *
     * Context can be read from any construct using `node.getContext(key)`.
     *
     * @default - no additional context
     */
    readonly context?: {
        [key: string]: any;
    };
    /**
     * Additional context values for the application.
     *
     * Context provided here has precedence over context set by:
     *
     * - The CLI via --context
     * - The `context` key in `cdk.json`
     * - The `AppProps.context` property
     *
     * This property is recommended over the `AppProps.context` property since you
     * can make final decision over which context value to take in your app.
     *
     * Context can be read from any construct using `node.getContext(key)`.
     *
     * @example
     * // context from the CLI and from `cdk.json` are stored in the
     * // CDK_CONTEXT env variable
     * const cliContext = JSON.parse(process.env.CDK_CONTEXT!);
     *
     * // determine whether to take the context passed in the CLI or not
     * const determineValue = process.env.PROD ? cliContext.SOMEKEY : 'my-prod-value';
     * new App({
     *   postCliContext: {
     *     SOMEKEY: determineValue,
     *   },
     * });
     *
     * @default - no additional context
     */
    readonly postCliContext?: {
        [key: string]: any;
    };
    /**
     * Include construct tree metadata as part of the Cloud Assembly.
     *
     * @default true
     */
    readonly treeMetadata?: boolean;
    /**
     * The stack synthesizer to use by default for all Stacks in the App
     *
     * The Stack Synthesizer controls aspects of synthesis and deployment,
     * like how assets are referenced and what IAM roles to use. For more
     * information, see the README of the main CDK package.
     *
     * @default - A `DefaultStackSynthesizer` with default settings
     */
    readonly defaultStackSynthesizer?: IReusableStackSynthesizer;
    /**
     * Validation plugins to run after synthesis
     *
     * @default - no validation plugins
     */
    readonly policyValidationBeta1?: IPolicyValidationPluginBeta1[];
}
/**
 * A construct which represents an entire CDK app. This construct is normally
 * the root of the construct tree.
 *
 * You would normally define an `App` instance in your program's entrypoint,
 * then define constructs where the app is used as the parent scope.
 *
 * After all the child constructs are defined within the app, you should call
 * `app.synth()` which will emit a "cloud assembly" from this app into the
 * directory specified by `outdir`. Cloud assemblies includes artifacts such as
 * CloudFormation templates and assets that are needed to deploy this app into
 * the AWS cloud.
 *
 * @see https://docs.aws.amazon.com/cdk/latest/guide/apps.html
 */
export declare class App extends Stage {
    /**
     * Checks if an object is an instance of the `App` class.
     * @returns `true` if `obj` is an `App`.
     * @param obj The object to evaluate
     */
    static isApp(obj: any): obj is App;
    /**
     * Include construct tree metadata as part of the Cloud Assembly.
     *
     * @internal
     */
    readonly _treeMetadata: boolean;
    /**
     * Initializes a CDK application.
     * @param props initialization properties
     */
    constructor(props?: AppProps);
    private loadContext;
    private readContextFromTempFile;
    private readContextFromEnvironment;
}
/**
 * Add a custom synthesis for the given construct
 *
 * When the construct is being synthesized, this allows it to add additional items
 * into the Cloud Assembly output.
 *
 * This feature is intended for use by official AWS CDK libraries only; 3rd party
 * library authors and CDK users should not use this function. That's why it's not
 * exposed via jsii.
 */
export declare function attachCustomSynthesis(construct: Construct, synthesis: ICustomSynthesis): void;
