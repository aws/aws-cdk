import { Stage } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Backend } from './backend';
import { Approver } from './frontend/approver';
import { AssetPublishingStrategy } from './frontend/asset-publishing';
import { Deployment, CdkStageDeployment } from './frontend/deployment';
import { Source } from './frontend/source';
import { Synth } from './frontend/synth';
import { ExecutionGraph, PipelineGraph } from './graph';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';


//----------------------------------------------------------------------
//
//    USER API
//
//----------------------------------------------------------------------

export interface AddApplicationOptions {
  /**
   * Approver for the app
   *
   * Run after the app is deployed
   */
  readonly approvers?: Approver[];
}

export interface CdkPipelineProps {
  /**
   * Source (GitHub, ...)
   *
   * Sources are optional for some backends.
   */
  readonly source?: Source;

  /**
   * Synth commands
   */
  readonly synth: Synth;

  /**
   * Asset publishing strategy
   */
  readonly assetPublishing?: AssetPublishingStrategy;

  /**
   * Deployment backend
   *
   * @default CodePipeline
   */
  readonly backend?: Backend;

  /**
   * CLI version to use
   *
   * @default - Latest
   */
  readonly cdkCliVersion?: string;
}

export class CdkPipeline extends CoreConstruct {
  private readonly graph = new PipelineGraph();
  private readonly backend: Backend;
  private readonly assetPublishing: AssetPublishingStrategy;
  private built = false;

  constructor(scope: Construct, id: string, props: CdkPipelineProps) {
    super(scope, id);

    this.backend = props.backend ?? Backend.codePipeline();
    this.assetPublishing = props.assetPublishing ?? AssetPublishingStrategy.prepublishAll();

    props.source?.addToExecutionGraph({ root: this.graph, parent: this.graph.sourceStage });
    props.synth.addToExecutionGraph({ parent: this.graph.synthStage, root: this.graph, scope: this });
  }

  public addApplicationStage(stage: Stage, options?: AddApplicationOptions): void {
    if (this.built) {
      throw new Error('Immutable');
    }

    this.addDeployment(new CdkStageDeployment(stage, options));
  }

  public addDeploymentGroup(name: string): CdkPipelineDeploymentGroup {
    if (this.built) {
      throw new Error('Immutable');
    }
    const phase = new ExecutionGraph(name);
    this.graph.add(phase);

    const self = this;
    return new class extends CdkPipelineDeploymentGroup {
      public addApplicationStage(stage: Stage, options?: AddApplicationOptions): void {
        this.addDeployment(new CdkStageDeployment(stage, options));
      }

      public addDeployment(deployment: Deployment): void {
        phase.add(deployment.produceExecutionGraph({ scope: self, pipelineGraph: self.graph, assetPublishing: self.assetPublishing }));
      }
    }();
  }

  public renderToBackend() {
    if (this.built) {
      throw new Error('Can only call build() once');
    }
    this.backend.renderBackend({ scope: this, executionGraph: this.graph });
    this.built = true;
  }

  protected prepare() {
    if (!this.built) {
      this.renderToBackend();
    }
  }

  private addDeployment(deployment: Deployment) {
    // Deployments are expected to add an ExecutionGraph of their own
    this.graph.add(deployment.produceExecutionGraph({ scope: this, pipelineGraph: this.graph, assetPublishing: this.assetPublishing }));
  }
}

export abstract class CdkPipelineDeploymentGroup {
  public abstract addApplicationStage(stage: Stage, options?: AddApplicationOptions): void;
}
