import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { DynamoEventSource } from '../lib';
import { TestFunction } from './test-function';

class DynamoEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const queue = new dynamodb.Table(this, 'T', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.String
      },
      streamSpecification: dynamodb.StreamViewType.NewImage
    });

    fn.addEventSource(new DynamoEventSource(queue, {
      batchSize: 5,
      startingPosition: lambda.StartingPosition.TrimHorizon
    }));
  }
}

const app = new cdk.App();
new DynamoEventSourceTest(app, 'lambda-event-source-dynamodb');
app.run();