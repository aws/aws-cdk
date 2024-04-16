import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as actions from 'aws-cdk-lib/aws-ses-actions';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * 1. Create a free Workmail test domain (https://us-east-1.console.aws.amazon.com/workmail/v2/home?region=us-east-1#/organizations/create)
 *  - It should automatically be added to your list of verified SES domains, no need to exit the SES sandbox
 * 2. Add a new user email address in the Workmail console
 * 3. Update the TEST_EMAIL constant with the email address of the user you created
 * 4. Deploy the stack with --no-clean, and send an email to the email address you created
 */

const TEST_EMAIL = 'test@cdk-test-123.awsapps.com';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-receipt');

const topic = new sns.Topic(stack, 'Topic');

const fn = new lambda.Function(stack, 'Function', {
  code: lambda.Code.fromInline('exports.handler = async (event) => event;'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const bucket = new s3.Bucket(stack, 'Bucket');

const kmsKey = new kms.Key(stack, 'Key');

const ruleSet = ses.ReceiptRuleSet.fromReceiptRuleSetName(
  stack,
  'RuleSet',
  // Default WorkMail rule set
  'INBOUND_MAIL',
);

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
  recipients: [TEST_EMAIL],
  scanEnabled: true,
  tlsPolicy: ses.TlsPolicy.REQUIRE,
});

firstRule.addAction(new actions.Bounce({
  sender: TEST_EMAIL,
  template: actions.BounceTemplate.MESSAGE_CONTENT_REJECTED,
  topic,
}));

const secondRule = ruleSet.addRule('SecondRule');

secondRule.addAction(new actions.Stop({
  topic,
}));

const queue = new sqs.Queue(stack, 'NotificationQueue');
topic.addSubscription(new subscriptions.SqsSubscription(queue));

app.synth();
