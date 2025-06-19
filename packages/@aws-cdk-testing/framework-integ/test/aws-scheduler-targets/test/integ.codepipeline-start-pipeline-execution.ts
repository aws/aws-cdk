import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { S3SourceAction, StepFunctionInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { CodePipelineStartPipelineExecution } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * 1. Create a parameter 'MyParameter' in SystemsManager(SSM) with value '🌧️'
 * 2. The pipeline has a step function action that updates the Parameter 'MyParameter' from value '🌧️' to '🌈':
 * 3. The pipeline is invoked by the scheduler every minute (but it needs only one successful execution to pass).
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-codepipeline-start-pipeline-execution');

const payload = {
  Name: 'MyParameter',
  Value: '🌈',
};

new ssm.StringParameter(stack, 'MyParameter', {
  parameterName: payload.Name,
  stringValue: '🌧️',
});

const putParameterStep = new tasks.CallAwsService(stack, 'PutParameter', {
  service: 'ssm',
  action: 'putParameter',
  iamResources: ['*'],
  parameters: {
    Name: payload.Name,
    Value: payload.Value,
    Type: 'String',
    Overwrite: true,
  },
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(putParameterStep),
});
const sourceOutput = new Artifact();
const bucket = new Bucket(stack, 'Bucket', {
  versioned: true,
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const deployment = new BucketDeployment(stack, 'BucketDeployment', {
  destinationBucket: bucket,
  sources: [
    Source.data('key', 'test'),
  ],
});
const pipeline = new Pipeline(stack, 'Pipeline', {
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'source',
      actions: [
        new S3SourceAction({
          actionName: 's3',
          output: sourceOutput,
          bucket: bucket,
          bucketKey: 'key',
        }),
      ],
    },
    {
      stageName: 'build',
      actions: [
        new StepFunctionInvokeAction({
          actionName: 'change-parameter',
          stateMachine,
        }),
      ],
    },
  ],
});
pipeline.node.addDependency(deployment);
new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new CodePipelineStartPipelineExecution(pipeline),
});

const integrationTest = new IntegTest(app, 'integrationtest-codepipeline-start-pipeline-execution', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const getParameter = integrationTest.assertions.awsApiCall('SSM', 'getParameter', {
  Name: payload.Name,
});

// Verifies that expected parameter is created by the invoked step function
getParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Name: payload.Name,
    Value: payload.Value,
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
});
