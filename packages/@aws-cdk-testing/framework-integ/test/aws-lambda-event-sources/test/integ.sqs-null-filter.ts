import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-filter-criteria-null');

const fn = new TestFunction(stack, 'Func');
const queue = new sqs.Queue(stack, 'Queue');

fn.addEventSource(new SqsEventSource(queue, {
  batchSize: 5,
  filters: [
    lambda.FilterCriteria.filter({
      body: {
        id: lambda.FilterRule.null(),
      },
    }),
  ],
}));

new integ.IntegTest(app, 'FilterCriteriaNull', {
  testCases: [stack],
});

app.synth();
