import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

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
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      tumblingWindow: cdk.Duration.seconds(60),
    }));
  }
}

const app = new cdk.App();
new DynamoEventSourceTest(app, 'lambda-event-source-dynamodb');
app.synth();
