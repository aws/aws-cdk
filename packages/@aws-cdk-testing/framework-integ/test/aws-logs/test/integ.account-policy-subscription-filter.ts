import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { AccountPolicy, AccountPolicyDocument, FilterPattern } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';

class AccountPolicySubscriptionFilterIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new Function(this, 'Function', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = async () => {};'),
    });

    new AccountPolicy(this, 'AccountPolicy', {
      policyName: 'AccountPolicySubscriptionFilterIntegTest',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new LambdaDestination(fn),
        filterPattern: FilterPattern.allEvents(),
      }),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new AccountPolicySubscriptionFilterIntegStack(app, 'aws-cdk-account-policy-subscription-filter-integ');

new IntegTest(app, 'account-policy-subscription-filter', {
  testCases: [testCase],
});
