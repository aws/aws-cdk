/* eslint-disable import/no-extraneous-dependencies */
import { Construct } from 'constructs';
import * as cdkp from '../../lib';

export type ModernTestGitHubNpmPipelineProps = Partial<cdkp.SynthStepProps> & { synthStep?: cdkp.Step, engine?: cdkp.IDeploymentEngine };
export class ModernTestGitHubNpmPipeline extends cdkp.Pipeline {
  constructor(scope: Construct, id: string, props?: ModernTestGitHubNpmPipelineProps) {
    super(scope, id, {
      synthStep: props?.synthStep ?? new cdkp.SynthStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test'),
        installCommands: ['npm ci'],
        commands: ['npx cdk synth'],
        ...props,
      }),
      engine: props?.engine ?? new cdkp.CodePipelineEngine(),
    });
  }
}