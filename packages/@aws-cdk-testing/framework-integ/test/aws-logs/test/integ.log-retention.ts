import { App, Stack, StackProps, RemovalPolicy, Tags } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogRetention, RetentionDays } from 'aws-cdk-lib/aws-logs';

class LogRetentionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    Tags.of(this).add('env', 'prod');

    new LogRetention(this, 'MyFirstLambda', {
      logGroupName: 'logRetentionLogGroup',
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // the order here is specifically setup to make sure the resource provider will be granted
    // permissions to propagate tags after it has already been created
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
new IntegTest(app, 'LogRetentionInteg', { testCases: [stack] });
app.synth();