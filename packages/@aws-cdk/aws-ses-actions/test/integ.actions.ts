import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as ses from '@aws-cdk/aws-ses';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as actions from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-receipt');

const topic = new sns.Topic(stack, 'Topic');

const fn = new lambda.Function(stack, 'Function', {
  code: lambda.Code.fromInline('exports.handler = async (event) => event;'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

const bucket = new s3.Bucket(stack, 'Bucket');

const kmsKey = new kms.Key(stack, 'Key');

const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet', {
  dropSpam: true,
});

const firstRule = ruleSet.addRule('FirstRule', {
  actions: [
    new actions.AddHeader({
      name: 'X-My-Header',
      value: 'value',
    }),
    new actions.Lambda({
      function: fn,
      invocationType: actions.LambdaInvocationType.REQUEST_RESPONSE,
      topic,
    }),
    new actions.S3({
      bucket,
      kmsKey,
      objectKeyPrefix: 'emails/',
      topic,
    }),
    new actions.Sns({
      encoding: actions.EmailEncoding.BASE64,
      topic,
    }),
  ],
  receiptRuleName: 'FirstRule',
  recipients: ['cdk-ses-receipt-test@yopmail.com'],
  scanEnabled: true,
  tlsPolicy: ses.TlsPolicy.REQUIRE,
});

firstRule.addAction(new actions.Bounce({
  sender: 'cdk-ses-receipt-test@yopmail.com',
  template: actions.BounceTemplate.MESSAGE_CONTENT_REJECTED,
  topic,
}));

const secondRule = ruleSet.addRule('SecondRule');

secondRule.addAction(new actions.Stop({
  topic,
}));

app.synth();
