import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogRetention, RetentionDays } from 'aws-cdk-lib/aws-logs';
import type { StackProps } from 'aws-cdk-lib/core';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib/core';

/**
 * The log group lives in a different region than the stack. With
 * `removalPolicy: DESTROY` the handler must be allowed to delete the log group
 * in `logGroupRegion`, otherwise stack deletion fails with AccessDenied.
 *
 * Run this test in a region other than us-east-1 so that the cross-region
 * case is actually exercised.
 */
class LogRetentionRegionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new LogRetention(this, 'MyLambda', {
      logGroupName: 'logRetentionRegionLogGroup',
      logGroupRegion: 'us-east-1',
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new LogRetentionRegionIntegStack(app, 'aws-cdk-log-retention-region-integ');
new IntegTest(app, 'LogRetentionRegionInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
