import { Construct } from 'constructs';
import { Step } from '../blueprint';
import { Pipeline } from '../bp-main/pipeline';
import { CodePipelineEngine } from './codepipeline-engine';

export interface CodePipelineProps {
  readonly synthStep: Step;

}

export class CodePipeline extends Pipeline {
  constructor(scope: Construct, id: string, props: CodePipelineProps) {
    super(scope, id, {
      synthStep: props.synthStep,
      engine: new CodePipelineEngine({

      }),
    });
  }
}