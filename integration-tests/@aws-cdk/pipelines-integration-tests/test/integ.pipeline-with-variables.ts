// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VariablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import { Construct } from 'constructs';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        // input: pipelines.CodePipelineSource.gitHub('cdklabs/construct-hub-probe', 'main', {
        //   trigger: GitHubTrigger.POLL,
        // }),
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

new PipelineStack(app, 'VariablePipelineStack');
app.synth();
