import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as path from 'path';
import { App } from './app';
import { Construct, IConstruct, ISynthesisSession } from './construct-compat';
import { Environment } from './environment';
import { containingAssembler } from './private/scopes';

/**
 * Properties for a Stage
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
   * Stage name
   *
   * Will be prepended to default Stack names of stacks in this Stage.
   *
   * Stack names can be overridden at the Stack level.
   *
   * @default - Same as the construct id
   */
  readonly stageName?: string;
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
export class Stage extends Construct {
  /**
   * Return the containing Stage object of a construct, if available
   */
  public static of(scope: IConstruct): Stage | undefined {
    return scope.node.scopes.reverse().slice(1).find(Stage.isStage);
  }

  /**
   * Test whether the given construct is a Stage object
   */
  public static isStage(x: any ): x is Stage {
    return x !== null && typeof(x) === 'object' && STAGE_SYMBOL in x;
  }

  /**
   * The region configured on this Stage
   */
  public readonly region?: string;

  /**
   * The account configured on this Stage
   */
  public readonly account?: string;

  /**
   * Stage name of this stage
   */
  public readonly stageName: string;

  /**
   * The cached assembly if it was already built
   */
  private assembly?: cxapi.CloudAssembly;

  constructor(scope: Construct, id: string, props: StageProps = {}) {
    super(scope, id);

    Object.defineProperty(this, STAGE_SYMBOL, { value: true });

    this.region = props.env?.region;
    this.account = props.env?.account;
    this.stageName = props.stageName ?? this.generateStageName();
  }

  /**
   * Synthesize this Stage to a Cloud Assembly
   */
  public synth(): cxapi.CloudAssembly {
    if (this.assembly) {
      return this.assembly;
    }

    // Get the final output directory
    const outdir = path.join(App.of(this).assemblyBuilder.outdir, this.assemblyArtifactId);

    const builder = new cxapi.CloudAssemblyBuilder(outdir);
    for (const child of this.node.children) {
      child.node.host.synthesize({
        outdir,
        assembly: builder,
      });
    }

    this.assembly = builder.buildAssembly();
    return this.assembly;
  }

  /**
   * Synthesize this stage to a sub-cloud-assembly
   */
  protected synthesize(session: ISynthesisSession): void {
    // Force synthesis (or reuse the already synth'ed cloud assembly)
    this.synth();

    // Add to parent's manifest
    session.assembly.addArtifact(this.assemblyArtifactId, {
      type: cxschema.ArtifactType.EMBEDDED_CLOUD_ASSEMBLY,
      properties: {
        directoryName: this.assemblyArtifactId,
        displayName: this.node.path,
      } as cxschema.EmbeddedCloudAssemblyProperties,
    });
  }

  /**
   * Calculate default stage name
   *
   * Use enclosing stages' names and current id only. This gives the best
   * defaults results when creating Stages as part of a Pipeline construct.
   */
  private generateStageName(): string {
    const container = containingAssembler(this);

    const containerName = Stage.isStage(container) ? `${container.stageName}-` : '';

    return `${containerName}${this.node.id}`;
  }

  /**
   * Artifact ID of embedded assembly
   *
   * Derived from the construct path.
   */
  private get assemblyArtifactId() {
    return `sub-${this.node.path.replace(/\//g, '-').replace(/^-+|-+$/g, '')}`;
  }
}

const STAGE_SYMBOL = Symbol.for('@aws-cdk/core.Stage');