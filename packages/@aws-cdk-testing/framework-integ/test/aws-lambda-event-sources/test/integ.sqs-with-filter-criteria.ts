import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Key } from 'aws-cdk-lib/aws-kms';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-filter-criteria-sqs');

const fn = new TestFunction(stack, 'F');
const queue = new sqs.Queue(stack, 'Q');

fn.addEventSource(new SqsEventSource(queue, {
  batchSize: 5,
  filters: [
    lambda.FilterCriteria.filter({
      body: {
        id: lambda.FilterRule.exists(),
      },
    }),
  ],
}));

const myKey = new Key(stack, 'fc-test-key-name', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  pendingWindow: cdk.Duration.days(7),
  description: 'KMS key for test fc encryption',
});

const fn2 = new TestFunction(stack, 'F2');

fn2.addEventSource(new SqsEventSource(queue, {
  batchSize: 5,
  filters: [
    lambda.FilterCriteria.filter({
      body: {
        id: lambda.FilterRule.exists(),
      },
    }),
  ],
  filterEncryption: myKey,
}));

new integ.IntegTest(app, 'SQSFilterCriteria', {
  testCases: [stack],
});

app.synth();
