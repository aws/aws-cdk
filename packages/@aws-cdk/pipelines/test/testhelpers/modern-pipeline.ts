/* eslint-disable import/no-extraneous-dependencies */
import { Construct } from 'constructs';
import * as cdkp from '../../lib';

export type ModernTestGitHubNpmPipelineProps = Partial<cdkp.SynthStepProps> & { synthStep?: cdkp.Step, engine?: cdkp.IDeploymentEngine };

export class ModernTestGitHubNpmPipeline extends cdkp.Pipeline {
  public readonly gitHubSource: cdkp.CodePipelineSource;
  public readonly synthStep: cdkp.Step;

  constructor(scope: Construct, id: string, props?: ModernTestGitHubNpmPipelineProps) {
    const source = cdkp.CodePipelineSource.gitHub('test/test');
    const synthStep = props?.synthStep ?? new cdkp.SynthStep('Synth', {
      input: source,
      installCommands: ['npm ci'],
      commands: ['npx cdk synth'],
      ...props,
    });

    super(scope, id, {
      synthStep,
      engine: props?.engine ?? new cdkp.CodePipelineEngine(),
    });

    this.gitHubSource = source;
    this.synthStep = synthStep;
  }
}