import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import ses = require('../lib');

const stack = new cdk.Stack();

/// !show
const bucket = new s3.Bucket(stack, 'Bucket');
const topic = new sns.Topic(stack, 'Topic');

new ses.ReceiptRuleSet(stack, 'RuleSet', {
  rules: [
    {
      recipients: ['hello@aws.com'],
      actions: [
        new ses.ReceiptRuleAddHeaderAction({
          name: 'X-Special-Header',
          value: 'aws'
        }),
        new ses.ReceiptRuleS3Action({
          bucket,
          objectKeyPrefix: 'emails/',
          topic
        })
      ],
    },
    {
      recipients: ['aws.com'],
      actions: [
        new ses.ReceiptRuleSnsAction({
          topic
        })
      ]
    }
  ]
});
/// !hide
