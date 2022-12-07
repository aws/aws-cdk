import { App, Stack, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { LogRetention, RetentionDays } from '../lib';

class LogRetentionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new LogRetention(this, 'MyLambda', {
      logGroupName: 'logRetentionLogGroup',
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new LogRetention(this, 'MyLambda2', {
      logGroupName: 'logRetentionLogGroup2',
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new LogRetentionIntegStack(app, 'aws-cdk-log-retention-integ');
new IntegTest(app, 'LogRetentionInteg', { testCases: [stack] });
app.synth();