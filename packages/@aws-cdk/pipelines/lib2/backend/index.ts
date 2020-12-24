import { Construct } from 'constructs';
import { ExecutionGraph } from '../graph';
import { CodePipelineBackend, CodePipelineBackendProps } from './codepipeline';

export interface RenderBackendOptions {
  readonly scope: Construct;
  readonly executionGraph: ExecutionGraph;
}


export abstract class Backend {
  public static codePipeline(props: CodePipelineBackendProps = {}): CodePipelineBackend {
    return new CodePipelineBackend(props);
  }
  public abstract renderBackend(options: RenderBackendOptions): void;
}

