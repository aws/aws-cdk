import { Construct } from 'constructs';
import { ExecutionPipeline } from '../graph';
import { CodePipelineBackend, CodePipelineBackendProps } from './codepipeline';

export interface RenderBackendOptions {
  readonly scope: Construct;
  readonly executionGraph: ExecutionPipeline;
}


export abstract class Backend {
  public static codePipeline(props: CodePipelineBackendProps = {}): CodePipelineBackend {
    return new CodePipelineBackend(props);
  }
  public abstract renderBackend(options: RenderBackendOptions): void;
}

