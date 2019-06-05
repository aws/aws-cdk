import kms = require('@aws-cdk/aws-kms');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import ses = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-receipt');

const topic = new sns.Topic(stack, 'Topic');

const fn = new lambda.Function(stack, 'Function', {
  code: lambda.Code.inline('exports.handler = async (event) => event;'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NodeJS810
});

const bucket = new s3.Bucket(stack, 'Bucket');

const kmsKey = new kms.Key(stack, 'Key');

const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet', {
  dropSpam: true
});

const firstRule = ruleSet.addRule('FirstRule', {
  actions: [
    new ses.ReceiptRuleAddHeaderAction({
      name: 'X-My-Header',
      value: 'value'
    }),
    new ses.ReceiptRuleLambdaAction({
      function: fn,
      invocationType: ses.LambdaInvocationType.RequestResponse,
      topic
    }),
    new ses.ReceiptRuleS3Action({
      bucket,
      kmsKey,
      objectKeyPrefix: 'emails/',
      topic
    }),
    new ses.ReceiptRuleSnsAction({
      encoding: ses.EmailEncoding.Base64,
      topic
    })
  ],
  name: 'FirstRule',
  recipients: ['cdk-ses-receipt-test@yopmail.com'],
  scanEnabled: true,
  tlsPolicy: ses.TlsPolicy.Require,
});

firstRule.addAction(
  new ses.ReceiptRuleBounceAction({
    sender: 'cdk-ses-receipt-test@yopmail.com',
    template: ses.ReceiptRuleBounceActionTemplate.MessageContentRejected,
    topic
  })
);

const secondRule = ruleSet.addRule('SecondRule');

secondRule.addAction(new ses.ReceiptRuleStopAction({
  topic
}));

new ses.WhiteListReceiptFilter(stack, 'WhiteList', {
  ips: [
    '10.0.0.0/16'
  ]
});

app.synth();
