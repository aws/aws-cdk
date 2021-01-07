import { ExecutionGraph, PipelineGraph } from '../../graph';

export abstract class Approver {
  public static shellScript(): Approver {
    throw new Error('Method not implemented.');
  }
  public abstract addToExecutionGraph(options: AddApproverToGraphOptions): void;
}

export interface AddApproverToGraphOptions {
  readonly pipelineGraph: PipelineGraph;
  readonly deploymentGraph: ExecutionGraph;
}

