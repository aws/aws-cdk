
/// !cdk-integ RetryPipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { StackProps, StageProps } from 'aws-cdk-lib';
import { App, Stack, RemovalPolicy, Stage } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

class BucketStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new s3.Bucket(this, 'Bucket');
  }
}

class PlainStackApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack');
  }
}

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
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    // Add a stage with retryMode via addStage
    pipeline.addStage(new PlainStackApp(this, 'StageWithRetry'), {
      retryMode: pipelines.RetryMode.FAILED_ACTIONS,
    });

    // Add a wave with retryMode via addWave
    const wave = pipeline.addWave('WaveWithRetry', {
      retryMode: pipelines.RetryMode.ALL_ACTIONS,
    });
    wave.addStage(new PlainStackApp(this, 'WaveApp1'));
    wave.addStage(new PlainStackApp(this, 'WaveApp2'));
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new PipelineStack(app, 'RetryPipelineStack');

new integ.IntegTest(app, 'RetryPipelineTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
