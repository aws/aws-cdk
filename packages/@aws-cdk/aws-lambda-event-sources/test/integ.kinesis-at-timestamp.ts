import * as kinesis from '@aws-cdk/aws-kinesis';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { TestFunction } from './test-function';
import { KinesisEventSource } from '../lib';

const app = new App();

const stack = new Stack(app, 'lambda-event-source-kinesis-at-timestamp');

const fn = new TestFunction(stack, 'F');

const stream = new kinesis.Stream(stack, 'S');

fn.addEventSource(new KinesisEventSource(stream, {
  startingPosition: lambda.StartingPosition.AT_TIMESTAMP,
  startingPositionTimestamp: 1655237653,
}));

new integ.IntegTest(app, 'AtTimestamp', {
  testCases: [stack],
});

app.synth();
