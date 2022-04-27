import * as ses from '@aws-cdk/aws-ses';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-receipt');

const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet', {
  dropSpam: true,
});

ruleSet.addRule('FirstRule', {
  receiptRuleName: 'FirstRule',
  recipients: ['cdk-ses-receipt-test@yopmail.com'],
  scanEnabled: true,
  tlsPolicy: ses.TlsPolicy.REQUIRE,
});

ruleSet.addRule('SecondRule');

new ses.AllowListReceiptFilter(stack, 'Allowlist', {
  ips: [
    '10.0.0.0/16',
  ],
});
