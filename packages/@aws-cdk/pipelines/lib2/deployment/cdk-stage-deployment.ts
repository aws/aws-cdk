import { Stage } from '@aws-cdk/core';
import { Approver } from '../approver';
import { ExecutionGraph } from '../graph';
import { AddDeploymentToGraphOptions, Deployment } from './index';

export interface CdkStageDeploymentProps {
  /**
   * Approver for the app
   *
   * Run after the app is deployed
   */
  readonly approvers?: Approver[];
}

export class CdkStageDeployment extends Deployment {
  constructor(private readonly stage: Stage, private readonly options: CdkStageDeploymentProps = {}) {
    super();
  }

  public addToExecutionGraph(options: AddDeploymentToGraphOptions): void {
    const graph = new ExecutionGraph(this.stage.stageName);
    options.parent.add(graph);

    // TODO: Turn Stacks into actions here
    // TODO: publish assets
    // options.assetPublishing.publishAsset();
    for (const approver of this.options.approvers ?? []) {
      approver.addToExecutionGraph({ root: options.root, deploymentGraph: graph });
    }
  }
}

