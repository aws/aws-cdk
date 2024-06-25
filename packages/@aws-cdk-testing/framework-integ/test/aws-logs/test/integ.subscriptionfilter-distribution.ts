import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, FilterPattern, Distribution } from 'aws-cdk-lib/aws-logs';
import { KinesisDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
class SubscriptionFilterDistributionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup');

    const stream = new Stream(this, 'Stream');

    logGroup.addSubscriptionFilter('Subscription', {
      destination: new KinesisDestination(stream),
      filterPattern: FilterPattern.allTerms('ERROR', 'MainThread'),
      filterName: 'CustomSubscriptionFilterName',
      distribution: Distribution.RANDOM,
    });
  }
}

const app = new App();
const testCase = new SubscriptionFilterDistributionIntegStack(app, 'aws-cdk-subscriptionfilter-distribution-integ');

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});
