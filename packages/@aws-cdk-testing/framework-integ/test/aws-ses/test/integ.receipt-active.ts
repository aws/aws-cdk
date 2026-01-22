import * as cdk from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-receipt-active');

// Create a receipt rule set with active: true
// This will create the rule set AND activate it using a custom resource
new ses.ReceiptRuleSet(stack, 'ActiveRuleSet', {
  receiptRuleSetName: 'cdk-integ-active-rule-set',
  active: true,
});

new IntegTest(app, 'cdk-ses-receipt-active-integ', {
  testCases: [stack],
  diffAssets: true,
});
