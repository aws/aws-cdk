import { Construct } from 'constructs';
import { Step } from '../blueprint';
import { Pipeline } from '../main/pipeline';
import { CodePipelineEngine, CodePipelineEngineProps } from './codepipeline-engine';

export interface CodePipelineProps extends CodePipelineEngineProps {
  readonly synthStep: Step;

}

export class CodePipeline extends Pipeline {
  constructor(scope: Construct, id: string, props: CodePipelineProps) {
    super(scope, id, {
      synthStep: props.synthStep,
      // This needs to not be a construct because we can't root it under `CodePipeline` here.
      engine: new CodePipelineEngine(props),
    });
  }
}