import { Stage } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CodePipelineBackend } from './codepipeline';
import { AssetPublisher, Backend, CdkStageDeployment } from './frontend';
import { IApprover, IArtifactable, IDeployment } from './frontend/artifactable';
import { Workflow, RolloutWorkflow } from './workflow';

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
  readonly approvers?: IApprover[];
}

export interface PipelineProps {
  /**
   * Build step
   */
  readonly buildStep: IArtifactable;

  /**
   * Asset publishing strategy
   */
  readonly assetPublishing?: AssetPublisher;

  /**
   * Deployment backend
   *
   * @default CodePipeline
   */
  readonly backend?: Backend;
}

export class Pipeline extends CoreConstruct {
  private readonly workflow = new RolloutWorkflow();
  private readonly backend: Backend;
  private readonly assetPublishing: AssetPublisher;
  private built = false;

  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id);

    this.backend = props.backend ?? new CodePipelineBackend();
    this.assetPublishing = props.assetPublishing ?? AssetPublisher.prepublishAll();

    props.buildStep.addToWorkflow({ parent: this.workflow.buildStage, workflow: this.workflow, scope: this });
  }

  public addApplicationStage(stage: Stage, options?: AddApplicationOptions): void {
    if (this.built) {
      throw new Error('Immutable');
    }

    this.addDeployment(new CdkStageDeployment(stage, options));
  }

  public addDeploymentGroup(name: string): PipelineDeploymentGroup {
    if (this.built) {
      throw new Error('Immutable');
    }
    const phase = new Workflow(name);
    this.workflow.add(phase);

    const self = this;
    return new class extends PipelineDeploymentGroup {
      public addApplicationStage(stage: Stage, options?: AddApplicationOptions): void {
        this.addDeployment(new CdkStageDeployment(stage, options));
      }

      public addDeployment(deployment: IDeployment): void {
        deployment.addToWorkflow({
          scope: self,
          workflow: self.workflow,
          assetPublisher: self.assetPublishing,
          parent: self.workflow,
        });
      }
    }();
  }

  public renderToBackend() {
    if (this.built) {
      throw new Error('Can only call build() once');
    }
    this.backend.renderBackend({ scope: this, workflow: this.workflow });
    this.built = true;
  }

  protected prepare() {
    if (!this.built) {
      this.renderToBackend();
    }
  }

  private addDeployment(deployment: IDeployment) {
    // Deployments are expected to add an ExecutionGraph of their own
    deployment.addToWorkflow({
      scope: this,
      workflow: this.workflow,
      assetPublisher: this.assetPublishing,
      parent: this.workflow,
    });
  }
}

export abstract class PipelineDeploymentGroup {
  public abstract addApplicationStage(stage: Stage, options?: AddApplicationOptions): void;
}
