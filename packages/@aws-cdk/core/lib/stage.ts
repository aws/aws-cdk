import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, Construct, Node } from 'constructs';
import { Environment } from './environment';
import { PermissionsBoundary } from './permissions-boundary';
import { synthesize } from './private/synthesis';

const STAGE_SYMBOL = Symbol.for('@aws-cdk/core.Stage');

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
export class Stage extends Construct {
  /**
   * Return the stage this construct is contained with, if available. If called
   * on a nested stage, returns its parent.
   *
   */
  public static of(construct: IConstruct): Stage | undefined {
    return Node.of(construct).scopes.reverse().slice(1).find(Stage.isStage);
  }

  /**
   * Test whether the given construct is a stage.
   *
   */
  public static isStage(x: any ): x is Stage {
    return x !== null && typeof(x) === 'object' && STAGE_SYMBOL in x;
  }

  /**
   * The default region for all resources defined within this stage.
   *
   */
  public readonly region?: string;

  /**
   * The default account for all resources defined within this stage.
   *
   */
  public readonly account?: string;

  /**
   * The cloud assembly builder that is being used for this App
   *
   * @internal
   */
  public readonly _assemblyBuilder: cxapi.CloudAssemblyBuilder;

  /**
   * The name of the stage. Based on names of the parent stages separated by
   * hypens.
   *
   */
  public readonly stageName: string;

  /**
   * The parent stage or `undefined` if this is the app.
   * *
   */
  public readonly parentStage?: Stage;

  /**
   * The cached assembly if it was already built
   */
  private assembly?: cxapi.CloudAssembly;

  constructor(scope: Construct, id: string, props: StageProps = {}) {
    super(scope, id);

    if (id !== '' && !/^[a-z][a-z0-9\-\_\.]+$/i.test(id)) {
      throw new Error(`invalid stage name "${id}". Stage name must start with a letter and contain only alphanumeric characters, hypens ('-'), underscores ('_') and periods ('.')`);
    }

    Object.defineProperty(this, STAGE_SYMBOL, { value: true });

    this.parentStage = Stage.of(this);

    this.region = props.env?.region ?? this.parentStage?.region;
    this.account = props.env?.account ?? this.parentStage?.account;


    props.permissionsBoundary?._bind(this);

    this._assemblyBuilder = this.createBuilder(props.outdir);
    this.stageName = [this.parentStage?.stageName, props.stageName ?? id].filter(x => x).join('-');
  }

  /**
   * The cloud assembly output directory.
   */
  public get outdir() {
    return this._assemblyBuilder.outdir;
  }

  /**
   * The cloud assembly asset output directory.
   */
  public get assetOutdir() {
    return this._assemblyBuilder.assetOutdir;
  }

  /**
   * Artifact ID of the assembly if it is a nested stage. The root stage (app)
   * will return an empty string.
   *
   * Derived from the construct path.
   *
   */
  public get artifactId() {
    if (!this.node.path) { return ''; }
    return `assembly-${this.node.path.replace(/\//g, '-').replace(/^-+|-+$/g, '')}`;
  }

  /**
   * Synthesize this stage into a cloud assembly.
   *
   * Once an assembly has been synthesized, it cannot be modified. Subsequent
   * calls will return the same assembly.
   */
  public synth(options: StageSynthesisOptions = { }): cxapi.CloudAssembly {
    if (!this.assembly || options.force) {
      this.assembly = synthesize(this, {
        skipValidation: options.skipValidation,
        validateOnSynthesis: options.validateOnSynthesis,
      });
    }

    return this.assembly;
  }

  private createBuilder(outdir?: string) {
    // cannot specify "outdir" if we are a nested stage
    if (this.parentStage && outdir) {
      throw new Error('"outdir" cannot be specified for nested stages');
    }

    // Need to determine fixed output directory already, because we must know where
    // to write sub-assemblies (which must happen before we actually get to this app's
    // synthesize() phase).
    return this.parentStage
      ? this.parentStage._assemblyBuilder.createNestedAssembly(this.artifactId, this.node.path)
      : new cxapi.CloudAssemblyBuilder(outdir);
  }
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
