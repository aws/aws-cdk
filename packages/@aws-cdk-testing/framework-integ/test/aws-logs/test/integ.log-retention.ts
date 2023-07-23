import { App, Stack, StackProps, RemovalPolicy, Tags } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogRetention, RetentionDays } from 'aws-cdk-lib/aws-logs';

class LogRetentionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    Tags.of(this).add('dept', 'eng');

    new LogRetention(this, 'MyFirstLambda', {
      logGroupName: 'logRetentionLogGroup1',
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
      propagateTags: false,
    });

    new LogRetention(this, 'MySecondLambda', {
      logGroupName: 'logRetentionLogGroup2',
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
      propagateTags: true,
    });
  }
}

const app = new App();

const stack = new LogRetentionIntegStack(app, 'aws-cdk-log-retention-integ');

const integTest = new IntegTest(app, 'LogRetentionInteg', { testCases: [stack] });

const firstLambdaTags = integTest.assertions.awsApiCall('CloudWatchLogs', 'listTagsLogGroup', {
  logGroupName: 'logRetentionLogGroup1',
});
firstLambdaTags.expect(ExpectedResult.objectLike({ tags: {} }));

const secondLambdaTags = integTest.assertions.awsApiCall('CloudWatchLogs', 'listTagsLogGroup', {
  logGroupName: 'logRetentionLogGroup2',
});
secondLambdaTags.expect(ExpectedResult.objectLike({ tags: { dept: 'eng' } }));
