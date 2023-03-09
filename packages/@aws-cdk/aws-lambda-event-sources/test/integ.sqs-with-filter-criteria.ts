import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { TestFunction } from './test-function';
import { SqsEventSource } from '../lib';

const app = new cdk.App();

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

new integ.IntegTest(app, 'SQSFilterCriteria', {
  testCases: [stack],
});

app.synth();