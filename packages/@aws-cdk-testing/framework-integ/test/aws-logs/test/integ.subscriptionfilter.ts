import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LogGroup, FilterPattern } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';

class SubscriptionFilterIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup');

    const fn = new Function(this, 'Function', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromInline('foo'),
    });

    logGroup.addSubscriptionFilter('Subscription', {
      destination: new LambdaDestination(fn),
      filterPattern: FilterPattern.allTerms('ERROR', 'MainThread'),
      filterName: 'CustomSubscriptionFilterName',
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new SubscriptionFilterIntegStack(app, 'aws-cdk-subscriptionfilter-integ');

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});
