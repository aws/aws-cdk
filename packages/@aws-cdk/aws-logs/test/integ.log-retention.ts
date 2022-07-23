import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LogRetention, RetentionDays, LogDeletionPolicy } from '../lib';

class LogRetentionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new LogRetention(this, 'MyLambda', {
      logGroupName: 'logRetentionLogGroup',
      retention: RetentionDays.ONE_DAY,
      logDeletionPolicy: LogDeletionPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new LogRetentionIntegStack(app, 'aws-cdk-log-retention-integ');
new IntegTest(app, 'LogRetentionInteg', { testCases: [stack] });
app.synth();