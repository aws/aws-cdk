import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LogGroup } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grantreads-integ');

const logGroup = new LogGroup(stack, 'LogGroup');
logGroup.grantRead(new ServicePrincipal('es.amazonaws.com'));

new IntegTest(app, 'loggroup-grantreads', {
  testCases: [stack],
});
app.synth();
