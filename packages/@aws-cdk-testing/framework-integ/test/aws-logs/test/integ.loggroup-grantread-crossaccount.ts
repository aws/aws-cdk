import { ArnPrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grantread-crossaccount-integ');

const logGroup = new LogGroup(stack, 'LogGroup');

// Test cross-account principal - this should output the full root ARN format
// to prevent false positive CloudFormation drift detection (issue #37797)
logGroup.grantRead(new ArnPrincipal('arn:aws:iam::123456789012:user/cross-account-user'));

new IntegTest(app, 'loggroup-grantread-crossaccount', {
  testCases: [stack],
});
app.synth();
