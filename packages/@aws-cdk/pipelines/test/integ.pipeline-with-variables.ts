// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VariablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import { GitHubTrigger } from '@aws-cdk/aws-codepipeline-actions';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as pipelines from '../lib';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('cdklabs/construct-hub-probe', 'main', {
          trigger: GitHubTrigger.POLL,
        }),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    const producer = new pipelines.CodeBuildStep('Produce', {
      commands: ['export MY_VAR=hello'],
    });

    const consumer = new pipelines.CodeBuildStep('Consume', {
      env: {
        THE_VAR: producer.exportedVariable('MY_VAR'),
      },
      commands: [
        'echo "The variable was: $THE_VAR"',
      ],
    });

    // WHEN
    pipeline.addWave('MyWave', {
      post: [consumer, producer],
    });
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
  },
});

new PipelineStack(app, 'VariablePipelineStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

app.synth();