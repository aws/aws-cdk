import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as s3 from 'aws-cdk-lib/aws-s3';
import type { StackProps, StageProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack, Stage } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';

/**
 * A stage with two independent stacks (no cross-stack references).
 * Independence is required for `deployGate`: all "Prepare" (change set)
 * actions must be able to run before any stack is deployed.
 */
class IndependentStacksStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack1 = new Stack(this, 'Stack1');
    new sqs.Queue(stack1, 'Queue');

    const stack2 = new Stack(this, 'Stack2');
    new sqs.Queue(stack2, 'OtherQueue');
  }
}

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Source', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.s3(bucket, 'source.zip'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new IndependentStacksStage(this, 'Prod'), {
      deployGate: [new pipelines.ManualApprovalStep('ReviewAllChangeSets')],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});
const stack = new PipelineStack(app, 'PipelineStackDeployGate');
/** Integration test that ensures a pipeline with `deployGate` synthesizes and
 * deploys correctly: all Prepare actions run before the gate, and all Deploy
 * actions run after the gate. */
new integ.IntegTest(app, 'PipelineStackDeployGate-integ', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
