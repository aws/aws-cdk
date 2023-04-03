import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, Construct } from 'constructs';
import { Environment } from './environment';
import { PermissionsBoundary } from './permissions-boundary';
import { IPolicyValidationPluginBeta1 } from './validation';
/**
 * Initialization props for a stage.
 */
export interface StageProps {
    /**
     * Default AWS environment (account/region) for `Stack`s in this `Stage`.
     *
     * Stacks defined inside this `Stage` with either `region` or `account` missing
     * from its env will use the corresponding field given here.
     *
     * If either `region` or `account`is is not configured for `Stack` (either on
     * the `Stack` itself or on the containing `Stage`), the Stack will be
     * *environment-agnostic*.
     *
     * Environment-agnostic stacks can be deployed to any environment, may not be
     * able to take advantage of all features of the CDK. For example, they will
     * not be able to use environmental context lookups, will not automatically
     * translate Service Principals to the right format based on the environment's
     * AWS partition, and other such enhancements.
     *
     * @example
     *
     * // Use a concrete account and region to deploy this Stage to
     * new Stage(app, 'Stage1', {
     *   env: { account: '123456789012', region: 'us-east-1' },
     * });
     *
     * // Use the CLI's current credentials to determine the target environment
     * new Stage(app, 'Stage2', {
     *   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
     * });
     *
     * @default - The environments should be configured on the `Stack`s.
     */
    readonly env?: Environment;
    /**
     * The output directory into which to emit synthesized artifacts.
     *
     * Can only be specified if this stage is the root stage (the app). If this is
     * specified and this stage is nested within another stage, an error will be
     * thrown.
     *
     * @default - for nested stages, outdir will be determined as a relative
     * directory to the outdir of the app. For apps, if outdir is not specified, a
     * temporary directory will be created.
     */
    readonly outdir?: string;
    /**
     * Name of this stage.
     *
     * @default - Derived from the id.
     */
    readonly stageName?: string;
    /**
     * Options for applying a permissions boundary to all IAM Roles
     * and Users created within this Stage
     *
     * @default - no permissions boundary is applied
     */
    readonly permissionsBoundary?: PermissionsBoundary;
    /**
     * Validation plugins to run during synthesis. If any plugin reports any violation,
     * synthesis will be interrupted and the report displayed to the user.
     *
     * @default - no validation plugins are used
     */
    readonly policyValidationBeta1?: IPolicyValidationPluginBeta1[];
}
/**
 * An abstract application modeling unit consisting of Stacks that should be
 * deployed together.
 *
 * Derive a subclass of `Stage` and use it to model a single instance of your
 * application.
 *
 * You can then instantiate your subclass multiple times to model multiple
 * copies of your application which should be be deployed to different
 * environments.
 */
export declare class Stage extends Construct {
    /**
     * Return the stage this construct is contained with, if available. If called
     * on a nested stage, returns its parent.
     *
     */
    static of(construct: IConstruct): Stage | undefined;
    /**
     * Test whether the given construct is a stage.
     *
     */
    static isStage(x: any): x is Stage;
    /**
     * The default region for all resources defined within this stage.
     *
     */
    readonly region?: string;
    /**
     * The default account for all resources defined within this stage.
     *
     */
    readonly account?: string;
    /**
     * The cloud assembly builder that is being used for this App
     *
     * @internal
     */
    readonly _assemblyBuilder: cxapi.CloudAssemblyBuilder;
    /**
     * The name of the stage. Based on names of the parent stages separated by
     * hypens.
     *
     */
    readonly stageName: string;
    /**
     * The parent stage or `undefined` if this is the app.
     * *
     */
    readonly parentStage?: Stage;
    /**
     * The cached assembly if it was already built
     */
    private assembly?;
    /**
     * Validation plugins to run during synthesis. If any plugin reports any violation,
     * synthesis will be interrupted and the report displayed to the user.
     *
     * @default - no validation plugins are used
     */
    readonly policyValidationBeta1: IPolicyValidationPluginBeta1[];
    constructor(scope: Construct, id: string, props?: StageProps);
    /**
     * The cloud assembly output directory.
     */
    get outdir(): string;
    /**
     * The cloud assembly asset output directory.
     */
    get assetOutdir(): string;
    /**
     * Artifact ID of the assembly if it is a nested stage. The root stage (app)
     * will return an empty string.
     *
     * Derived from the construct path.
     *
     */
    get artifactId(): string;
    /**
     * Synthesize this stage into a cloud assembly.
     *
     * Once an assembly has been synthesized, it cannot be modified. Subsequent
     * calls will return the same assembly.
     */
    synth(options?: StageSynthesisOptions): cxapi.CloudAssembly;
    private createBuilder;
}
/**
 * Options for assembly synthesis.
 */
export interface StageSynthesisOptions {
    /**
     * Should we skip construct validation.
     * @default - false
     */
    readonly skipValidation?: boolean;
    /**
     * Whether the stack should be validated after synthesis to check for error metadata
     *
     * @default - false
     */
    readonly validateOnSynthesis?: boolean;
    /**
     * Force a re-synth, even if the stage has already been synthesized.
     * This is used by tests to allow for incremental verification of the output.
     * Do not use in production.
     * @default false
     */
    readonly force?: boolean;
}
