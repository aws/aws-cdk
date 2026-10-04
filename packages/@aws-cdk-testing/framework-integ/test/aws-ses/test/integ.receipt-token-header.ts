import * as cdk from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as actions from 'aws-cdk-lib/aws-ses-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'SesReceiptTokenHeader');

const headerName = new cdk.CfnParameter(stack, 'HeaderName');

const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet');
const rule = ruleSet.addRule('Rule');
rule.addAction(new actions.AddHeader({
  name: headerName.valueAsString,
  value: 'value',
}));

new IntegTest(app, 'ses-receipt-token-header', {
  testCases: [stack],
});
