import { ArnPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grantreads-integ');

const logGroup = new LogGroup(stack, 'LogGroup');
logGroup.grantRead(new ServicePrincipal('es.amazonaws.com'));

// Cross-account principal: the resource policy must emit the canonical account
// root ARN (arn:aws:iam::<account>:root) rather than a bare account id, so that
// the deployed resource matches CloudFormation's canonicalization and does not
// report a permanent drift false positive (see https://github.com/aws/aws-cdk/issues/37797).
logGroup.grantRead(new ArnPrincipal('arn:aws:iam::234567890123:role/CrossAccountReader'));

new IntegTest(app, 'loggroup-grantreads', {
  testCases: [stack],
});
app.synth();
