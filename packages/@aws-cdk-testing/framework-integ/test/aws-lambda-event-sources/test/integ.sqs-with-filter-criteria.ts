import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

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