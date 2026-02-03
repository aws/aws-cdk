import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-stage-conditions');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineName: 'my-pipeline-stage-test',
  pipelineType: codepipeline.PipelineType.V2,
  crossAccountKeys: true,
});

const sourceStage = pipeline.addStage({ stageName: 'Source' });
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const key = 'key';
const trail = new cloudtrail.Trail(stack, 'CloudTrail');
trail.addS3EventSelector([{ bucket, objectPrefix: key }], { readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY, includeManagementEvents: false });
sourceStage.addAction(new cpactions.S3SourceAction({
  actionName: 'Source',
  output: new codepipeline.Artifact('SourceArtifact'),
  bucket,
  bucketKey: key,
  trigger: cpactions.S3Trigger.EVENTS,
}));

const lambdaFun = new lambda.Function(stack, 'LambdaFun', {
  code: new lambda.InlineCode(`
    exports.handler = function () {
      console.log("Hello, world!");
    };
  `),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const metric = new cloudwatch.Metric({
  namespace: 'AWS/Lambda',
  metricName: 'Errors',
  dimensionsMap: {
    FunctionName: lambdaFun.functionName,
  },
  period: cdk.Duration.minutes(5),
  statistic: 'Sum',
});
const alarm = new cloudwatch.Alarm(stack, 'ErrorAlarm', {
  metric,
  threshold: 1,
  evaluationPeriods: 1,
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
});
const lambdaStage = pipeline.addStage({
  stageName: 'Lambda',
  beforeEntry: {
    conditions: [{
      rules: [new codepipeline.Rule({
        name: 'LambdaCheck',
        provider: 'LambdaInvoke',
        version: '1',
        configuration: {
          FunctionName: lambdaFun.functionName,
        },
      })],
      result: codepipeline.Result.FAIL,
    }],
  },
  // OnSuccess condition - checks after successful stage completion
  onSuccess: {
    conditions: [{
      result: codepipeline.Result.FAIL,
      rules: [new codepipeline.Rule({
        name: 'CloudWatchCheck',
        provider: 'LambdaInvoke',
        version: '1',
        configuration: {
          AlarmName: alarm.alarmName,
          WaitTime: '300', // 5 minutes
          FunctionName: 'funcName2',
        },
      })],
    }],
  },
  // OnFailure condition - handles stage failure
  onFailure: {
    conditions: [{
      result: codepipeline.Result.ROLLBACK,
      rules: [new codepipeline.Rule({
        name: 'RollBackOnFailure',
        provider: 'LambdaInvoke',
        version: '1',
        configuration: {
          AlarmName: alarm.alarmName,
          WaitTime: '300', // 5 minutes
          FunctionName: 'funcName1',
        },
      })],
    }],
  },
});
lambdaStage.addAction(new cpactions.LambdaInvokeAction({
  actionName: 'Lambda',
  lambda: lambdaFun,
}));

const integrationTest = new IntegTest(app, 'codepipeline-integ-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const awsApiCall1 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: 'my-pipeline-stage-test' });
awsApiCall1.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp('my-pipeline-stage-test'));
awsApiCall1.assertAtPath('pipeline.stages.0.name', ExpectedResult.stringLikeRegexp('Source'));
awsApiCall1.assertAtPath('pipeline.stages.1.name', ExpectedResult.stringLikeRegexp('Lambda'));
awsApiCall1.assertAtPath('pipeline.stages.1.actions.0.name', ExpectedResult.stringLikeRegexp('Lambda'));
awsApiCall1.assertAtPath('pipeline.stages.1.onSuccess.conditions.0.result', ExpectedResult.stringLikeRegexp('FAIL'));
awsApiCall1.assertAtPath('pipeline.stages.1.onFailure.conditions.0.result', ExpectedResult.stringLikeRegexp('ROLLBACK'));

app.synth();
