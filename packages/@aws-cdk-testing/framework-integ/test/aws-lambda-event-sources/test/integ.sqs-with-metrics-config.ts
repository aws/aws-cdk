import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { TestFunction } from './test-function';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-metrics-config-sqs');

const fn1 = new TestFunction(stack, 'F1');
const queue = new sqs.Queue(stack, 'Q');
const eventSource1 = new SqsEventSource(queue, {
  batchSize: 5,
  metricsConfig: {
    metrics: [],
  },
});

fn1.addEventSource(eventSource1);

const fn2 = new TestFunction(stack, 'F2');
const eventSource2 = new SqsEventSource(queue, {
  batchSize: 5,
  metricsConfig: {
    metrics: [lambda.MetricType.EVENT_COUNT],
  },
});

fn2.addEventSource(eventSource2);

new integ.IntegTest(app, 'lambda-event-source-sqs-with-metrics', {
  testCases: [stack],
});

app.synth();
