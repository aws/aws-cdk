import { Stage } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Approver } from './approver';
import { AssetPublishingStrategy } from './asset-publishing';
import { Backend } from './backend';
import { CdkStageDeployment } from './deployment/cdk-stage-deployment';
import { ExecutionGraph, ExecutionPipeline } from './graph';
import { Source } from './source';
import { Synth } from './synth';

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
  readonly sources?: Source[];

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
}

export class CdkPipeline extends CoreConstruct {
  private readonly graph = new ExecutionPipeline();
  private readonly backend: Backend;
  private readonly assetPublishing: AssetPublishingStrategy;
  private built = false;

  constructor(scope: Construct, id: string, props: CdkPipelineProps) {
    super(scope, id);

    this.backend = props.backend ?? Backend.codePipeline();
    this.assetPublishing = props.assetPublishing ?? AssetPublishingStrategy.prepublishAll();

    for (const source of props.sources ?? []) {
      source.addToExecutionGraph({ root: this.graph, parent: this.graph.sourceStage });
    }
    props.synth.addToExecutionGraph({ parent: this.graph.synthStage, root: this.graph, scope: this });
  }

  public addApplicationStage(stage: Stage, options?: AddApplicationOptions): void {
    if (this.built) {
      throw new Error('Immutable');
    }

    const phase = new ExecutionGraph(stage.stageName);
    this.graph.add(phase);
    new CdkStageDeployment(stage, options).addToExecutionGraph({ root: this.graph, parent: phase, assetPublishing: this.assetPublishing });
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
        new CdkStageDeployment(stage, options).addToExecutionGraph({ root: self.graph, parent: phase, assetPublishing: self.assetPublishing });
      }
    }();
  }

  public build() {
    if (this.built) {
      throw new Error('Can only call build() once');
    }
    this.backend.renderBackend({ scope: this, executionGraph: this.graph });
  }

  protected prepare() {
    if (!this.built) {
      this.build();
    }
  }
}

export abstract class CdkPipelineDeploymentGroup {
  public abstract addApplicationStage(stage: Stage, options?: AddApplicationOptions): void;
}
