import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LogGroup, DataProtectionPolicy } from '../lib';

class LogGroupIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    var audit = new LogGroup(this, 'LogGroupLambdaAudit', {
      logGroupName: 'auditDestinationForCDK',
    });

    const dataProtectionPolicy = new DataProtectionPolicy({
      identifiers: ['EmailAddress', 'DriversLicense-US'],
      cloudWatchLogsAuditDestination: audit.logGroupName,
    });

    new LogGroup(this, 'LogGroupLambda', {
      logGroupName: 'cdkIntegLogGroup',
      dataProtectionPolicy: dataProtectionPolicy,
    });
  }
}

const app = new App();
const stack = new LogGroupIntegStack(app, 'aws-cdk-log-group-integ');
new IntegTest(app, 'LogGroupInteg', { testCases: [stack] });
app.synth();