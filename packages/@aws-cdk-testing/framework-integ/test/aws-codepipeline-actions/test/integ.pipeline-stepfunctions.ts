import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-stepfunctions');

const sourceOutput = new codepipeline.Artifact();

const startState = new stepfunctions.Pass(stack, 'StartState');
const simpleStateMachine = new stepfunctions.StateMachine(stack, 'SimpleStateMachine', {
  definition: startState,
});

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  crossAccountKeys: true,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [
    new cpactions.S3SourceAction({
      actionName: 'Source',
      bucket: new s3.Bucket(stack, 'MyBucket'),
      bucketKey: 'some/path/to',
      output: sourceOutput,
      trigger: cpactions.S3Trigger.POLL,
    }),
  ],
});
pipeline.addStage({
  stageName: 'Invoke',
  actions: [
    new cpactions.StepFunctionInvokeAction({
      actionName: 'Invoke',
      stateMachine: simpleStateMachine,
      stateMachineInput: cpactions.StateMachineInput.literal({ IsHelloWorldExample: true }),
    }),
  ],
});

app.synth();
