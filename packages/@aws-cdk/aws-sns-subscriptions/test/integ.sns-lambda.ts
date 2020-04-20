import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as subs from '../lib';

class SnsToLambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic');

    const fction = new lambda.Function(this, 'Echo', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });

    topic.addSubscription(new subs.LambdaSubscription(fction));

    const fctionFiltered = new lambda.Function(this, 'Filtered', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });

    topic.addSubscription(new subs.LambdaSubscription(fctionFiltered, {
      filterPolicy: {
        color: sns.SubscriptionFilter.stringFilter({
          whitelist: ['red'],
          matchPrefixes: ['bl', 'ye'],
        }),
        size: sns.SubscriptionFilter.stringFilter({
          blacklist: ['small', 'medium'],
        }),
        price: sns.SubscriptionFilter.numericFilter({
          between: { start: 100, stop: 200 },
        }),
      },
    }));
  }
}

const app = new cdk.App();

new SnsToLambda(app, 'aws-cdk-sns-lambda');

app.synth();

function handler(event: any, _context: any, callback: any) {
  // tslint:disable:no-console
  console.log('====================================================');
  console.log(JSON.stringify(event, undefined, 2));
  console.log('====================================================');
  return callback(undefined, event);
}
