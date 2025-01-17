import { IConstruct, Construct, Node } from 'constructs';
import { Environment } from './environment';
import { FeatureFlags } from './feature-flags';
import { PermissionsBoundary } from './permissions-boundary';
import { synthesize } from './private/synthesis';
import { IPolicyValidationPluginBeta1 } from './validation';
import * as cxapi from '../../cx-api';

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

  /**
   * The cached set of construct paths. Empty if assembly was not yet built.
   */
  private constructPathsCache: Set<string>;

  /**
   * Validation plugins to run during synthesis. If any plugin reports any violation,
   * synthesis will be interrupted and the report displayed to the user.
   *
   * @default - no validation plugins are used
   */
  public readonly policyValidationBeta1: IPolicyValidationPluginBeta1[] = [];

  constructor(scope: Construct, id: string, props: StageProps = {}) {
    super(scope, id);

    if (id !== '' && !/^[a-z][a-z0-9\-\_\.]+$/i.test(id)) {
      throw new Error(`invalid stage name "${id}". Stage name must start with a letter and contain only alphanumeric characters, hypens ('-'), underscores ('_') and periods ('.')`);
    }

    Object.defineProperty(this, STAGE_SYMBOL, { value: true });

    this.constructPathsCache = new Set<string>();
    this.parentStage = Stage.of(this);

    this.region = props.env?.region ?? this.parentStage?.region;
    this.account = props.env?.account ?? this.parentStage?.account;

    props.permissionsBoundary?._bind(this);

    this._assemblyBuilder = this.createBuilder(props.outdir);
    this.stageName = [this.parentStage?.stageName, props.stageName ?? id].filter(x => x).join('-');

    if (props.policyValidationBeta1) {
      this.policyValidationBeta1 = props.policyValidationBeta1;
    }
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

    let newConstructPaths = this.listAllConstructPaths(this);

    // If the assembly cache is uninitiazed, run synthesize and reset construct paths cache
    if (this.constructPathsCache.size == 0 || !this.assembly || options.force) {
      this.assembly = synthesize(this, {
        skipValidation: options.skipValidation,
        validateOnSynthesis: options.validateOnSynthesis,
        aspectStabilization: options.aspectStabilization ?? FeatureFlags.of(this).isEnabled(cxapi.ASPECT_STABILIZATION) ?? false,
      });
      newConstructPaths = this.listAllConstructPaths(this);
      this.constructPathsCache = newConstructPaths;
    }

    // If the construct paths set has changed
    if (!this.constructPathSetsAreEqual(this.constructPathsCache, newConstructPaths)) {
      const errorMessage = 'Synthesis has been called multiple times and the construct tree was modified after the first synthesis.';
      if (options.errorOnDuplicateSynth ?? true) {
        throw new Error(errorMessage + ' This is not allowed. Remove multple synth() calls and do not modify the construct tree after the first synth().');
      } else {
        // eslint-disable-next-line no-console
        console.error(errorMessage + ' Only the results of the first synth() call are used, and modifications done after it are ignored. Avoid construct tree mutations after synth() has been called unless this is intentional.');
      }
    }

    // Reset construct paths cache
    this.constructPathsCache = newConstructPaths;

    return this.assembly;
  }

  // Function that lists all construct paths and returns them as a set
  private listAllConstructPaths(construct: IConstruct): Set<string> {
    const paths = new Set<string>();
    function recurse(root: IConstruct) {
      paths.add(root.node.path);
      for (const child of root.node.children) {
        if (!Stage.isStage(child)) {
          recurse(child);
        }
      }
    }
    recurse(construct);
    return paths;
  }

  // Checks if sets of construct paths are equal
  private constructPathSetsAreEqual(set1: Set<string>, set2: Set<string>): boolean {
    if (set1.size !== set2.size) return false;
    for (const id of set1) {
      if (!set2.has(id)) {
        return false;
      }
    }
    return true;
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

  /**
   * Whether or not to throw a warning instead of an error if the construct tree has
   * been mutated since the last synth.
   * @default true
   */
  readonly errorOnDuplicateSynth?: boolean;

  /**
   * Whether or not run the stabilization loop while invoking Aspects.
   *
   * The stabilization loop runs multiple passes of the construct tree when invoking
   * Aspects. Without the stabilization loop, Aspects that are created by other Aspects
   * are not run and new nodes that are created at higher points on the construct tree by
   * an Aspect will not inherit their parent aspects.
   * @default false
   */
  readonly aspectStabilization?: boolean;
}
