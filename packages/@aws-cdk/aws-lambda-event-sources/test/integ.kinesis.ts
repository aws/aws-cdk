import kinesis = require('@aws-cdk/aws-kinesis');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { KinesisEventSource } from '../lib';
import { TestFunction } from './test-function';

class KinesisEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const stream = new kinesis.Stream(this, 'Q');

    fn.addEventSource(new KinesisEventSource(stream, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON
    }));
  }
}

const app = new cdk.App();
new KinesisEventSourceTest(app, 'lambda-event-source-kinesis');
app.synth();