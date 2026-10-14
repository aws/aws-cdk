import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps, StageProps } from 'aws-cdk-lib';
import { App, CfnOutput, RemovalPolicy, Stack, Stage } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

class AppStage extends Stage {
  public readonly queueUrl: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack');
    const queue = new sqs.Queue(stack, 'Queue');
    this.queueUrl = new CfnOutput(stack, 'QueueUrl', { value: queue.queueUrl });
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
      env: { STAGE: 'beta' },
      envFromCfnOutputs: { QUEUE_URL: beta.queueUrl },
      commands: [
        'mkdir -p report',
        'aws sqs get-queue-attributes --queue-url "$QUEUE_URL" > report/queue.json',
        'export RESULT="$STAGE is healthy"',
      ],
      outputFiles: ['report/**/*'],
      computeType: codebuild.ComputeType.SMALL,
      rolePolicyStatements: [new iam.PolicyStatement({
        actions: ['sqs:GetQueueAttributes'],
        resources: ['*'],
      })],
    });

    const report = new pipelines.CommandsStep('Report', {
      input: smokeTest,
      additionalInputs: {
        '../assembly': pipeline.cloudAssemblyFileSet,
      },
      env: { RESULT: smokeTest.exportedVariable('RESULT') },
      commands: [
        'cat report/queue.json',
        'ls ../assembly',
        'echo "$RESULT"',
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
