import { AssetPublishingStrategy } from '../asset-publishing';
import { ExecutionGraph, ExecutionPipeline } from '../graph';

export abstract class Deployment {
  public abstract addToExecutionGraph(options: AddDeploymentToGraphOptions): void;
}

export interface AddDeploymentToGraphOptions {
  readonly root: ExecutionPipeline;
  readonly parent: ExecutionGraph;
  readonly assetPublishing: AssetPublishingStrategy;
}
