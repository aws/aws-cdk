import cdk = require('@aws-cdk/core');
import ses = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ses-receipt');

const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet', {
  dropSpam: true
});

ruleSet.addRule('FirstRule', {
  receiptRuleName: 'FirstRule',
  recipients: ['amazon.com'],
  scanEnabled: true,
  tlsPolicy: ses.TlsPolicy.REQUIRE
});

ruleSet.addRule('SecondRule');

new ses.WhiteListReceiptFilter(stack, 'WhiteList', {
  ips: [
    '10.0.0.0/16'
  ]
});
