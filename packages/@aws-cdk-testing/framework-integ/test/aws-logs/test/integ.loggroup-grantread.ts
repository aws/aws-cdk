import { ArnPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grantreads-integ');

const logGroup = new LogGroup(stack, 'LogGroup');
logGroup.grantRead(new ServicePrincipal('es.amazonaws.com'));

// Regression test for https://github.com/aws/aws-cdk/issues/37797:
// grantRead with a cross-account principal must emit the root ARN form
// ("arn:aws:iam::<account>:root") so CloudFormation drift detection does not
// permanently flag the stack as DRIFTED. CloudFormation normalizes bare account
// IDs to the root ARN on the deployed resource, causing a false positive.
const logGroup2 = new LogGroup(stack, 'LogGroup2');
logGroup2.grantRead(new ArnPrincipal('arn:aws:iam::123456789012:role/CrossAccountReader'));

new IntegTest(app, 'loggroup-grantreads', {
  testCases: [stack],
});
app.synth();
