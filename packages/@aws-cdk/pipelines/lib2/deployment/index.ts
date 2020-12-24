import { Construct } from 'constructs';
import { AssetPublishingStrategy } from '../asset-publishing';
import { ExecutionGraph, PipelineGraph } from '../graph';

export abstract class Deployment {
  public abstract produceExecutionGraph(options: AddDeploymentToGraphOptions): ExecutionGraph;
}

export interface AddDeploymentToGraphOptions {
  readonly scope: Construct;
  readonly pipelineGraph: PipelineGraph;
  readonly assetPublishing: AssetPublishingStrategy;
}

export * from './cdk-stage-deployment';