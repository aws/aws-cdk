import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-filter-criteria-dynamodb');

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
  filters: [
    lambda.FilterCriteria.filter({
      eventName: lambda.FilterRule.isEqual('INSERT'),
      dynamodb: {
        Keys: {
          id: {
            S: lambda.FilterRule.exists(),
          },
        },
      },
    }),
  ],
}));

const myKey = new Key(stack, 'fc-test-key-name', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  pendingWindow: cdk.Duration.days(7),
  description: 'KMS key for test fc encryption',
});

const fn2 = new TestFunction(stack, 'F5');

fn2.addEventSource(new DynamoEventSource(table, {
  batchSize: 5,
  startingPosition: lambda.StartingPosition.LATEST,
  filters: [
    lambda.FilterCriteria.filter({
      eventName: lambda.FilterRule.isEqual('INSERT'),
      dynamodb: {
        Keys: {
          id: {
            S: lambda.FilterRule.exists(),
          },
        },
      },
    }),
  ],
  filterEncryption: myKey,
}));

new integ.IntegTest(app, 'DynamoDBFilterCriteria', {
  testCases: [stack],
});

app.synth();
