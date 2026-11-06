import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps, StageProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack, Stage } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack');
    new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.SQS_MANAGED });
  }
}

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const source = pipelines.CodePipelineSource.s3(sourceBucket, 'key');

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineType: codepipeline.PipelineType.V2,
      synth: new pipelines.ShellStep('Synth', {
        input: source,
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });

    const beta = new AppStage(this, 'Beta');

    const smokeTest = new pipelines.CommandsStep('SmokeTest', {
      input: source,
      commands: [
        'mkdir -p report',
        'aws sqs list-queues > report/queues.json',
        'export RESULT="beta is healthy"',
      ],
      outputFiles: ['report/**/*'],
      computeType: codebuild.ComputeType.SMALL,
      rolePolicyStatements: [new iam.PolicyStatement({
        actions: ['sqs:ListQueues'],
        resources: ['*'],
      })],
    });

    const report = new pipelines.CommandsStep('Report', {
      input: smokeTest,
      commands: [
        'cat report/queues.json',
        `echo "${smokeTest.exportedVariable('RESULT')}"`,
      ],
    });

    pipeline.addStage(beta, {
      post: [smokeTest, report],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new PipelineStack(app, 'PipelineWithCommandsStep');

new IntegTest(app, 'PipelineWithCommandsStepTest', {
  testCases: [stack],
});

app.synth();
