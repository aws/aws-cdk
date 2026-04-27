import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-event-source-sqs-with-poller-config');

const queue = new sqs.Queue(stack, 'Queue');

const fn1 = new TestFunction(stack, 'Function1');
const eventSource1 = new SqsEventSource(queue, {
  provisionedPollerConfig: {
    maximumPollers: 1000,
  },
});
fn1.addEventSource(eventSource1);

const fn2 = new TestFunction(stack, 'Function2');
const eventSource2 = new SqsEventSource(queue, {
  provisionedPollerConfig: {
    minimumPollers: 3,
  },
});
fn2.addEventSource(eventSource2);

const fn3 = new TestFunction(stack, 'Function3');
const eventSource3 = new SqsEventSource(queue, {
  provisionedPollerConfig: {
    minimumPollers: 3,
    maximumPollers: 1000,
  },
});
fn3.addEventSource(eventSource3);

const integTest = new IntegTest(app, 'lambda-event-source-sqs-with-poller-config-integ', {
  testCases: [stack],
});

// fn1: maximumPollers のみ設定 → minimumPollers は SQS デフォルト値 (2) になること
integTest.assertions.awsApiCall('Lambda', 'getEventSourceMapping', {
  UUID: eventSource1.eventSourceMappingId,
}).expect(ExpectedResult.objectLike({
  ProvisionedPollerConfig: {
    MinimumPollers: 2,
    MaximumPollers: 1000,
  },
}));

// fn2: minimumPollers のみ設定 → maximumPollers は SQS デフォルト値 (200) になること
integTest.assertions.awsApiCall('Lambda', 'getEventSourceMapping', {
  UUID: eventSource2.eventSourceMappingId,
}).expect(ExpectedResult.objectLike({
  ProvisionedPollerConfig: {
    MinimumPollers: 3,
    MaximumPollers: 200,
  },
}));

// fn3: minimumPollers と maximumPollers を両方設定
integTest.assertions.awsApiCall('Lambda', 'getEventSourceMapping', {
  UUID: eventSource3.eventSourceMappingId,
}).expect(ExpectedResult.objectLike({
  ProvisionedPollerConfig: {
    MinimumPollers: 3,
    MaximumPollers: 1000,
  },
}));
