import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, LogGroupClass } from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'aws-cdk-loggroup-groupclass-integ');

new LogGroup(stack, 'LogGroup', {
  logGroupClass: LogGroupClass.INFREQUENT_ACCESS,
});

new IntegTest(app, 'loggroup-grantreads', {
  testCases: [stack],
});
app.synth();
