import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grantreads-integ');

const logGroup = new LogGroup(stack, 'LogGroup');
logGroup.grantRead(new ServicePrincipal('es.amazonaws.com'));

new IntegTest(app, 'loggroup-grantreads', {
  testCases: [stack],
});
app.synth();
