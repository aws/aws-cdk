import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { TestFunction } from './test-function';
import { DynamoEventSource } from '../lib';

const app = new cdk.App();

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

new integ.IntegTest(app, 'DynamoDBFilterCriteria', {
  testCases: [stack],
});

app.synth();
