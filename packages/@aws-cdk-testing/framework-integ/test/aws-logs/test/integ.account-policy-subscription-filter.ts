import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { AccountPolicy, AccountPolicyDocument, FilterPattern } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';

class AccountPolicySubscriptionFilterIntegStack extends Stack {
  public readonly policyName: string;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new Function(this, 'Function', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = async () => {};'),
    });

    const accountPolicy = new AccountPolicy(this, 'AccountPolicy', {
      policyName: 'AccountPolicySubscriptionFilterIntegTest',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new LambdaDestination(fn),
        filterPattern: FilterPattern.allEvents(),
      }),
    });
    this.policyName = accountPolicy.policyName;
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new AccountPolicySubscriptionFilterIntegStack(app, 'aws-cdk-account-policy-subscription-filter-integ');

const integTest = new IntegTest(app, 'account-policy-subscription-filter', {
  testCases: [testCase],
});

integTest.assertions.awsApiCall('CloudWatchLogs', 'describeAccountPolicies', {
  policyType: 'SUBSCRIPTION_FILTER_POLICY',
  policyName: testCase.policyName,
}).expect(ExpectedResult.objectLike({
  accountPolicies: [
    {
      policyName: testCase.policyName,
      policyType: 'SUBSCRIPTION_FILTER_POLICY',
    },
  ],
}));
