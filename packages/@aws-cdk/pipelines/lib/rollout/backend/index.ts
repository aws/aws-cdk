import { Construct } from 'constructs';
import { PipelineGraph } from '../graph';

export interface RenderBackendOptions {
  readonly scope: Construct;
  readonly executionGraph: PipelineGraph;
}


export abstract class Backend {
  public static codePipeline(props: CodePipelineBackendProps = {}): CodePipelineBackend {
    return new CodePipelineBackend(props);
  }
  public abstract renderBackend(options: RenderBackendOptions): void;
}

import { CodePipelineBackend, CodePipelineBackendProps } from './codepipeline';
export { CodePipelineBackend, CodePipelineBackendProps } from './codepipeline';
export * from './codepipeline/codepipeline-image';