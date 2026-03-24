import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new App();
const stack = new Stack(app, 'DataProtectionDateOfBirthStack');

new logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: RemovalPolicy.DESTROY,
  dataProtectionPolicy: new logs.DataProtectionPolicy({
    identifiers: [logs.DataIdentifier.DATEOFBIRTH],
  }),
});

new IntegTest(app, 'DataProtectionDateOfBirthInteg', {
  testCases: [stack],
});
