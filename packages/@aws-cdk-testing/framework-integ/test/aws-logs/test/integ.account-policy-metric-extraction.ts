import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { AccountPolicy, AccountPolicyDocument } from 'aws-cdk-lib/aws-logs';

class AccountPolicyMetricExtractionIntegStack extends Stack {
  public readonly policyName: string;
  public readonly policyDocument: string;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Scoped to a prefix unique to this stack, so the policy has no effect on log groups
    // outside this integ test (an account can have only one unscoped metric extraction
    // policy, so scoping avoids conflicting with other stacks in a shared test account).
    const accountPolicy = new AccountPolicy(this, 'AccountPolicy', {
      policyName: 'AccountPolicyMetricExtractionIntegTest',
      policy: AccountPolicyDocument.metricExtraction({
        enabled: false,
        selectionCriteria: 'LogGroupNamePrefix IN ["/aws/lambda/account-policy-metric-extraction-integ"]',
      }),
    });
    this.policyName = accountPolicy.policyName;
    this.policyDocument = JSON.stringify({
      EmbeddedMetricFormat: { Status: 'Disabled' },
    });
  }
}

const app = new App();
const testCase = new AccountPolicyMetricExtractionIntegStack(app, 'aws-cdk-account-policy-metric-extraction-integ');

const integTest = new IntegTest(app, 'account-policy-metric-extraction', {
  testCases: [testCase],
});

integTest.assertions.awsApiCall('CloudWatchLogs', 'describeAccountPolicies', {
  policyType: 'METRIC_EXTRACTION_POLICY',
  policyName: testCase.policyName,
}).expect(ExpectedResult.objectLike({
  accountPolicies: [
    {
      policyName: testCase.policyName,
      policyType: 'METRIC_EXTRACTION_POLICY',
      policyDocument: testCase.policyDocument,
      selectionCriteria: 'LogGroupNamePrefix IN ["/aws/lambda/account-policy-metric-extraction-integ"]',
    },
  ],
}));
