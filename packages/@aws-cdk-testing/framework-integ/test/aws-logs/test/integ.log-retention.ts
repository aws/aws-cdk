import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogRetention, RetentionDays } from 'aws-cdk-lib/aws-logs';
import type { StackProps } from 'aws-cdk-lib/core';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib/core';

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
new IntegTest(app, 'LogRetentionInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
