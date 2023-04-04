import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

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
