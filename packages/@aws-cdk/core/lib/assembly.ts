import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from './construct-compat';
import { Environment } from './environment';
import { collectRuntimeInformation } from './private/runtime-info';
import { synthesize } from './private/synthesis';

/**
 * Initialization props for an assembly.
 */
export interface AssemblyProps {
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
   * new MyStage(app, 'Stage1', {
   *   env: { account: '123456789012', region: 'us-east-1' },
   * });
   *
   * // Use the CLI's current credentials to determine the target environment
   * new MyStage(app, 'Stage2', {
   *   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
   * });
   *
   * @default - The environments should be configured on the `Stack`s.
   */
  readonly env?: Environment;

  /**
   * The output directory into which to emit synthesized artifacts.
   *
   * @default - If this value is _not_ set, considers the environment variable `CDK_OUTDIR`.
   *            If `CDK_OUTDIR` is not defined, uses a temp directory.
   */
  readonly outdir?: string;
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
 *
 * @experimental
 */
export class Assembly extends Construct {
  /**
   * Return the containing assembly of a construct, if available. If called on a
   * nested assembly, returns its parent.
   *
   * @experimental
   */
  public static of(construct: IConstruct): Assembly | undefined {
    return construct.node.scopes.reverse().slice(1).find(Assembly.isAssembly);
  }

  /**
   * Test whether the given construct is an assembly.
   *
   * @experimental
   */
  public static isAssembly(x: any ): x is Assembly {
    return x !== null && x instanceof Assembly;
  }

  /**
   * The default region for all resources defined within this assembly.
   *
   * @experimental
   */
  public readonly region?: string;

  /**
   * The default account for all resources defined within this assembly.
   *
   * @experimental
   */
  public readonly account?: string;

  /**
   * The cloud assembly builder that is being used for this App
   *
   * @experimental
   */
  public readonly assemblyBuilder: cxapi.CloudAssemblyBuilder;

  /**
   * The name of the assembly. Based on names of the parent assemblies separated
   * by hypens.
   *
   * @experimental
   */
  public readonly assemblyName: string;

  /**
   * The parent assembly or `undefined` if this is the app.
   * *
   * @experimental
   */
  public readonly parentAssembly?: Assembly;

  /**
   * The cached assembly if it was already built
   */
  private assembly?: cxapi.CloudAssembly;

  constructor(scope: Construct, id: string, props: AssemblyProps = {}) {
    super(scope, id);

    if (id !== '' && !/^[a-z][a-z0-9\-\_\.]+$/i.test(id)) {
      throw new Error(`invalid assembly name "${id}". Assembly name must start with a letter and contain only alphanumeric characters, hypens ('-'), underscores ('_') and periods ('.')`);
    }

    this.parentAssembly = Assembly.of(this);

    this.region = props.env?.region;
    this.account = props.env?.account;

    // Need to determine fixed output directory already, because we must know where
    // to write sub-assemblies (which must happen before we actually get to this app's
    // synthesize() phase).
    this.assemblyBuilder = this.parentAssembly
      ? this.parentAssembly.assemblyBuilder.createNestedAssembly(this.assemblyArtifactId)
      : new cxapi.CloudAssemblyBuilder(props.outdir);

    this.assemblyName = [ this.parentAssembly?.assemblyName, id ].filter(x => x).join('-');
  }

  /**
   * Artifact ID of the assembly if it is a nested assembly. The root assembly
   * (app) will return an empty string.
   *
   * Derived from the construct path.
   *
   * @experimental
   */
  public get assemblyArtifactId() {
    if (!this.node.path) { return ''; }
    return `assembly-${this.node.path.replace(/\//g, '-').replace(/^-+|-+$/g, '')}`;
  }

  /**
   * Synthesize this assembly.
   *
   * Once an assembly has been synthesized, it cannot be modified. Subsequent calls will return the same assembly.
   */
  public synth(options: AssemblySynthesisOptions = { }): cxapi.CloudAssembly {
    const runtimeInfo = this.node.tryGetContext(cxapi.DISABLE_VERSION_REPORTING) ? undefined : collectRuntimeInformation();

    if (!this.assembly) {
      this.assembly = synthesize(this, {
        skipValidation: options.skipValidation,
        runtimeInfo,
      });
    }

    return this.assembly;
  }
}

/**
 * Options for assemly synthesis.
 */
export interface AssemblySynthesisOptions {
  /**
   * Should we skip construct validation.
   * @default - false
   */
  readonly skipValidation?: boolean;
}
