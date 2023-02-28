

import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as subs from '../lib';

class SnsToLambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic');

    const func = new lambda.Function(this, 'Echo', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });

    topic.addSubscription(new subs.LambdaSubscription(func, {
      deadLetterQueue: new sqs.Queue(this, 'DeadLetterQueue'),
    }));

    const funcFiltered = new lambda.Function(this, 'Filtered', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });

    topic.addSubscription(new subs.LambdaSubscription(funcFiltered, {
      filterPolicy: {
        color: sns.SubscriptionFilter.stringFilter({
          allowlist: ['red'],
          matchPrefixes: ['bl', 'ye'],
        }),
        size: sns.SubscriptionFilter.stringFilter({
          denylist: ['small', 'medium'],
        }),
        price: sns.SubscriptionFilter.numericFilter({
          between: { start: 100, stop: 200 },
        }),
      },
    }));

    const funcFilteredWithMessageBody = new lambda.Function(this, 'FilteredMessageBody', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });

    topic.addSubscription(new subs.LambdaSubscription(funcFilteredWithMessageBody, {
      filterPolicyWithMessageBody: {
        background: sns.FilterOrPolicy.policy({
          color: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.stringFilter({
            allowlist: ['red'],
            matchPrefixes: ['bl', 'ye'],
          })),
        }),
      },
    }));
  }
}

const app = new cdk.App();

new SnsToLambda(app, 'aws-cdk-sns-lambda');

app.synth();

function handler(event: any, _context: any, callback: any) {
  /* eslint-disable no-console */
  console.log('====================================================');
  console.log(JSON.stringify(event, undefined, 2));
  console.log('====================================================');
  return callback(undefined, event);
}
