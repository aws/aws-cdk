import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-stepfunctions');

const sourceOutput = new codepipeline.Artifact();

const startState = new stepfunctions.Pass(stack, 'StartState');
const simpleStateMachine = new stepfunctions.StateMachine(stack, 'SimpleStateMachine', {
  definition: startState,
});

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
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
