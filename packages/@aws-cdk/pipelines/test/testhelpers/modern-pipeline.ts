/* eslint-disable import/no-extraneous-dependencies */
import { Construct } from 'constructs';
import * as cdkp from '../../lib';

export type ModernTestGitHubNpmPipelineProps = Partial<cdkp.CodePipelineProps> & Partial<cdkp.SynthStepProps>;

export class ModernTestGitHubNpmPipeline extends cdkp.CodePipeline {
  public readonly gitHubSource: cdkp.CodePipelineSource;
  public readonly synth: cdkp.Step;

  constructor(scope: Construct, id: string, props?: ModernTestGitHubNpmPipelineProps) {
    const source = cdkp.CodePipelineSource.github('test/test');
    const synth = props?.synth ?? new cdkp.SynthStep('Synth', {
      input: source,
      installCommands: ['npm ci'],
      commands: ['npx cdk synth'],
      ...props,
    });

    super(scope, id, {
      synth: synth,
      ...props,
    });

    this.gitHubSource = source;
    this.synth = synth;
  }
}