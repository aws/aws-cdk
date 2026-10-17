import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-grantreads-integ');

new LogGroup(stack, 'LogGroup', {
  deletionProtectionEnabled: true,
});

new IntegTest(app, 'loggroup-grantreads', {
  testCases: [stack],
});
