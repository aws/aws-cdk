import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-metrics-config-kinesis');

const fn1 = new TestFunction(stack, 'F1');
const stream = new kinesis.Stream(stack, 'Q');

fn1.addEventSource(new KinesisEventSource(stream, {
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
  tumblingWindow: cdk.Duration.seconds(60),
  metricsConfig: {
    metrics: [],
  },
}));

const fn2 = new TestFunction(stack, 'F2');
fn2.addEventSource(new KinesisEventSource(stream, {
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
  tumblingWindow: cdk.Duration.seconds(60),
  metricsConfig: {
    metrics: [lambda.MetricType.EVENT_COUNT],
  },
}));

new integ.IntegTest(app, 'lambda-event-source-kinesis-with-metrics', {
  testCases: [stack],
});

app.synth();
