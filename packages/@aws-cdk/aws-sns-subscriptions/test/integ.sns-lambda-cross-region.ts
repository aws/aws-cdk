import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as subs from '../lib';

/// !cdk-integ * pragma:enable-lookups
const app = new cdk.App();

const topicStack = new cdk.Stack(app, 'TopicStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});
const topic = new sns.Topic(topicStack, 'MyTopic', {
  topicName: cdk.PhysicalName.GENERATE_IF_NEEDED,
});

const functionStack = new cdk.Stack(app, 'FunctionStack', {
  env: { region: 'us-east-2' },
});
const fction = new lambda.Function(functionStack, 'Echo', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
});

topic.addSubscription(new subs.LambdaSubscription(fction));

app.synth();

function handler(event: any, _context: any, callback: any) {
  /* eslint-disable no-console */
  console.log('====================================================');
  console.log(JSON.stringify(event, undefined, 2));
  console.log('====================================================');
  return callback(undefined, event);
}
