import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { FilterCriteria, FilterPattern } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { DynamoEventSource } from '../lib';
import { TestFunction } from './test-function';

class DynamoEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new dynamodb.Table(this, 'T', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_IMAGE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    fn.addEventSource(new DynamoEventSource(queue, {
      batchSize: 5,
      startingPosition: lambda.StartingPosition.LATEST,
      filterCriteria: FilterCriteria.addFilters({
        eventName: FilterPattern.textEquals('INSERT'),
        dynamodb: {
          Keys: {
            id: {
              S: FilterPattern.exists(),
            },
          },
        },
      }),
    }));
  }
}

const app = new cdk.App();
new DynamoEventSourceTest(app, 'lambda-event-source-dynamodb');
app.synth();
