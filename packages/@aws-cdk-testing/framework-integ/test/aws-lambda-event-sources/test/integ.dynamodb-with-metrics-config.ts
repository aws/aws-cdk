import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-metrics-config-dynamodb');

const fn = new TestFunction(stack, 'F');
const table = new dynamodb.Table(stack, 'T', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  stream: dynamodb.StreamViewType.NEW_IMAGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

fn.addEventSource(new DynamoEventSource(table, {
  batchSize: 5,
  startingPosition: lambda.StartingPosition.LATEST,
  metricsConfig: {
    metrics: [],
  },
}));

const fn2 = new TestFunction(stack, 'F5');

fn2.addEventSource(new DynamoEventSource(table, {
  batchSize: 5,
  startingPosition: lambda.StartingPosition.LATEST,
  metricsConfig: {
    metrics: [lambda.MetricType.EVENT_COUNT],
  },
}));

new integ.IntegTest(app, 'lambda-event-source-dynamodb-with-metrics', {
  testCases: [stack],
});

app.synth();
