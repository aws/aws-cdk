import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as actions from 'aws-cdk-lib/aws-ses-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';

/**
 * 1. Create a free Workmail test domain (https://us-east-1.console.aws.amazon.com/workmail/v2/home?region=us-east-1#/organizations/create)
 *  - It should automatically be added to your list of verified SES domains, no need to exit the SES sandbox
 * 2. Add a new user email address in the Workmail web console
 * 3. Remove the automatically created INBOUND_MAIL rule set (https://us-east-1.console.aws.amazon.com/ses/home?region=us-east-1#/email-receiving/INBOUND_MAIL)
 * 4. Deploy the stack with --no-clean
 * 5. Set the rule set as active in the SES web console (https://us-east-1.console.aws.amazon.com/ses/home?region=us-east-1#/email-receiving)
 * 6. Send an email to the email address you created
 * 7. Check the following:
 *  - The email should be in the WorkMail user inbox
 *  - The SQS queue should receive the receipt notification
 */

const TEST_WORKMAIL_DOMAIN = 'cdk-test-123.awsapps.com';
const TEST_ORGANIZATION_ARN = 'arn:aws:workmail:us-east-1:339712719728:organization/m-b38dcbf130a2429ea3f12d56a6c5dfc3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-workmail-receipt');

const topic = new sns.Topic(stack, 'Topic');

const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet', { dropSpam: true });

ruleSet.addRule('WorkmailRule', {
  actions: [
    new actions.WorkMail({
      organizationArn: TEST_ORGANIZATION_ARN,
      topic,
    }),
  ],
  receiptRuleName: 'WorkmailRule',
  recipients: [TEST_WORKMAIL_DOMAIN],
  scanEnabled: true,
  tlsPolicy: ses.TlsPolicy.REQUIRE,
});

const queue = new sqs.Queue(stack, 'NotificationQueue');
topic.addSubscription(new subscriptions.SqsSubscription(queue));

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();
