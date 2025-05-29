import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import { KinesisConsumerEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'lambda-event-source-kinesis-stream-consumer');

const fn = new TestFunction(stack, 'F');
const stream = new kinesis.Stream(stack, 'Q');
const streamConsumer = new kinesis.StreamConsumer(stack, 'C', {
  stream,
  streamConsumerName: 'TheConsumer',
});
const eventSource = new KinesisConsumerEventSource(streamConsumer, {
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
  tumblingWindow: cdk.Duration.seconds(60),
});

fn.addEventSource(eventSource);

new cdk.CfnOutput(stack, 'OutputEventSourceMappingArn', { value: eventSource.eventSourceMappingArn });

new IntegTest(app, 'integ-lambda-event-source-kinesis-stream-consumer', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
