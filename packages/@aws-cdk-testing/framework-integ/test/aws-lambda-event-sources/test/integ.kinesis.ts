import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

class KinesisEventSourceTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const fn = new TestFunction(this, 'F');
    const stream = new kinesis.Stream(this, 'Q');
    const eventSource = new KinesisEventSource(stream, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      tumblingWindow: cdk.Duration.seconds(60),
    });

    fn.addEventSource(eventSource);

    new cdk.CfnOutput(this, 'OutputEventSourceMappingArn', { value: eventSource.eventSourceMappingArn });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new KinesisEventSourceTest(app, 'lambda-event-source-kinesis');
app.synth();
