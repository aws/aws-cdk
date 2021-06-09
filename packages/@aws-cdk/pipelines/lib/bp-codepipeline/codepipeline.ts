import { Construct } from 'constructs';
import { Step } from '../blueprint';
import { Pipeline } from '../bp-main/pipeline';
import { CodePipelineEngine, CodePipelineEngineProps } from './codepipeline-engine';

export interface CodePipelineProps extends CodePipelineEngineProps {
  readonly synthStep: Step;

}

export class CodePipeline extends Pipeline {
  constructor(scope: Construct, id: string, props: CodePipelineProps) {
    super(scope, id, {
      synthStep: props.synthStep,
      // FIXME: Would have liked to pass 'this' here, but that's not allowed
      engine: new CodePipelineEngine(scope, `${id}CodePipeline`, props),
    });
  }
}