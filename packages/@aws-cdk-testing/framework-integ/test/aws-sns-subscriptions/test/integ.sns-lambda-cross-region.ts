import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

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
  runtime: STANDARD_NODEJS_RUNTIME,
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
