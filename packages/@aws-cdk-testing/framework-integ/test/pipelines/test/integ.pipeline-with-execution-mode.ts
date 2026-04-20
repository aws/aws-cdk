import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, Stack, StackProps, Stage, StageProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as integ from '@aws-cdk/integ-tests-alpha';

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      executionMode: codepipeline.ExecutionMode.QUEUED,
      pipelineType: codepipeline.PipelineType.V2,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(new AppStage(this, 'Beta'));
  }
}

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new Stack(this, 'Stack1');
    new sqs.Queue(stack1, 'Queue');
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});
const stack = new PipelineStack(app, 'PipelineStack');

new integ.IntegTest(app, 'PipelineStackIntegWithExecutionMode', {
  testCases: [stack],
});

app.synth();
