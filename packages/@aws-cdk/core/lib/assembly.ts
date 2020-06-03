import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as constructs from 'constructs';
import { Construct, ConstructOrder, IConstruct, ValidationError } from './construct-compat';
import { Environment } from './environment';
import { prepareApp } from './private/prepare-app';
import { collectRuntimeInformation } from './private/runtime-info';

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
export abstract class Assembly extends Construct {
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
      : new cxapi.CloudAssemblyBuilder(props.outdir ?? process.env[cxapi.OUTDIR_ENV]);

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
    if (this.assembly) {
      return this.assembly;
    }

    // find all child constructs within this assembly (sorted depth-first), and
    // include direct nested assemblies, but do not include any constructs from
    // nested assemblies as they will be covered by their assembly's synth()
    // method.
    const findChildren = () => this.node
      .findAll(ConstructOrder.POSTORDER)
      .filter(n => Assembly.of(n) === this || (Assembly.isAssembly(n) && n.parentAssembly === this));

    const children = findChildren();

    // okay, now we start by calling "synth" on all nested assemblies (which will take care of all their children)
    for (const nested of children.filter(x => x instanceof Assembly) as Assembly[]) {
      nested.synth(options);
    }

    // continue with the rest of the children (all the constructs that are not assemblies).
    const others = children.filter(x => !Assembly.isAssembly(x));

    for (const child of [ ...others, this ]) {
      (constructs.Node.of(child) as any).invokeAspects();
    }

    // invoke "prepare" on all of the children in this assembly. this is mostly here for legacy purposes
    // the framework itself does not use prepare anymore.
    for (const child of findChildren()) {
      (child as IProtectedConstructMethods).onPrepare();
    }

    // resolve references
    prepareApp(this);

    // give all children an opportunity to validate now that we've finished prepare
    if (!options.skipValidation) {
      const errors = new Array<ValidationError>();
      for (const source of others) {
        const messages = (source as IProtectedConstructMethods).onValidate();
        for (const message of messages) {
          errors.push({ message, source: source as Construct });
        }
      }

      if (errors.length > 0) {
        const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
        throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
      }
    }

    // next, we invoke "onSynthesize" on all of our children. this will allow
    // stacks to add themselves to the synthesized cloud assembly.
    for (const child of others) {
      (child as IProtectedConstructMethods).onSynthesize({
        outdir: this.assemblyBuilder.outdir,
        assembly: this.assemblyBuilder,
      });
    }

    // Add this assembly to the parent assembly manifest (if we have one)
    this.parentAssembly?.assemblyBuilder.addArtifact(this.assemblyArtifactId, {
      type: cxschema.ArtifactType.EMBEDDED_CLOUD_ASSEMBLY,
      properties: {
        directoryName: this.assemblyArtifactId,
        displayName: this.node.path,
      } as cxschema.EmbeddedCloudAssemblyProperties,
    });

    const runtimeInfo = this.node.tryGetContext(cxapi.DISABLE_VERSION_REPORTING) ? undefined : collectRuntimeInformation();
    this.assembly = this.assemblyBuilder.buildAssembly({ runtimeInfo });
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

/**
 * Interface which provides access to special methods of Construct
 *
 * @experimental
 */
interface IProtectedConstructMethods extends IConstruct {
  /**
   * Method that gets called when a construct should synthesize itself to an assembly
   */
  onSynthesize(session: constructs.ISynthesisSession): void;

  /**
   * Method that gets called to validate a construct
   */
  onValidate(): string[];

  /**
   * Method that gets called to prepare a construct
   */
  onPrepare(): void;
}
