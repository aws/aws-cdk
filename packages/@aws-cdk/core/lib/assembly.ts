import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from './construct-compat';
import { Environment } from './environment';
import { synthesize } from './private/synthesis';

/**
 * Initialization props for an assembly.
 */
export interface AssemblyProps {
  /**
   * Assembly name
   *
   * Will be prepended to default stack names of stacks defined under this assembly.
   *
   * Stack names can be overridden at the Stack level.
   *
   * @default - Same as the construct id
   */
  readonly assemblyName?: string;

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
 * An application modeling unit consisting of Stacks that should be deployed together
 *
 * Derive a subclass of this construct and use it to model a single
 * instance of your application.
 *
 * You can then instantiate your subclass multiple times to model multiple
 * copies of your application which should be be deployed to different
 * environments.
 */
export class Assembly extends Construct {
  /**
   * Return the containing Stage object of a construct, if available
   */
  public static of(construct: IConstruct): Assembly | undefined {
    return construct.node.scopes.reverse().slice(1).find(Assembly.isAssembly);
  }

  /**
   * Test whether the given construct is a Assembly object
   */
  public static isAssembly(x: any ): x is Assembly {
    return x !== null && x instanceof Assembly;
  }

  /**
   * The default region for all resources defined within this assembly.
   */
  public readonly region?: string;

  /**
   * The default account for all resources defined within this assembly.
   */
  public readonly account?: string;

  /**
   * The Cloud Assembly builder that is being used for this App
   *
   * @experimental
   */
  public readonly assemblyBuilder: cxapi.CloudAssemblyBuilder;

  /**
   * The name of the assembly.
   */
  public readonly assemblyName: string;

  /**
   * The parent assembly or `undefined` if this is the app.
   */
  public readonly parentAssembly?: Assembly;

  /**
   * The cached assembly if it was already built
   */
  private assembly?: cxapi.CloudAssembly;

  constructor(scope: Construct, id: string, props: AssemblyProps = {}) {
    super(scope, id);

    this.parentAssembly = Assembly.of(this);

    this.region = props.env?.region;
    this.account = props.env?.account;

    // Need to determine fixed output directory already, because we must know where
    // to write sub-assemblies (which must happen before we actually get to this app's
    // synthesize() phase).
    this.assemblyBuilder = this.parentAssembly
      ? this.parentAssembly.assemblyBuilder.openEmbeddedAssembly(this.assemblyArtifactId)
      : new cxapi.CloudAssemblyBuilder(props.outdir ?? process.env[cxapi.OUTDIR_ENV]);   // TODO: << should; come; from; app;

    this.assemblyName = props.assemblyName ?? (this.parentAssembly?.assemblyName ? `${this.parentAssembly.assemblyName}-${id}` : id);
  }

  /**
   * Artifact ID of embedded assembly
   *
   * Derived from the construct path.
   */
  public get assemblyArtifactId() {
    return `sub-${this.node.path.replace(/\//g, '-').replace(/^-+|-+$/g, '')}`;
  }

  /**
   * Synthesize this assembly.
   *
   * Once an assembly has been synthesized, it cannot be modified. Subsequent calls will return the same assembly.
   */
  public synth(options: AssemblySynthesisOptions = { }): cxapi.CloudAssembly {
    if (!this.assembly) {
      this.assembly = synthesize(this, options);
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
