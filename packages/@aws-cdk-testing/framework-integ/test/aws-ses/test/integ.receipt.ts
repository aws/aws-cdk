import * as cdk from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

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

new IntegTest(app, 'cdk-ses-receipt-integ', {
  testCases: [stack],
  diffAssets: true,
});
