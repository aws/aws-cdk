import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { AccountPolicy, AccountPolicyDocument, DataIdentifier, DataProtectionPolicy } from 'aws-cdk-lib/aws-logs';

class AccountPolicyDataProtectionIntegStack extends Stack {
  public readonly policyName: string;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const accountPolicy = new AccountPolicy(this, 'AccountPolicy', {
      policyName: 'AccountPolicyDataProtectionIntegTest',
      policy: AccountPolicyDocument.dataProtection({
        policy: new DataProtectionPolicy({
          name: 'account-policy-data-protection-integ',
          identifiers: [DataIdentifier.EMAILADDRESS],
        }),
      }),
    });
    this.policyName = accountPolicy.policyName;
  }
}

const app = new App();
const testCase = new AccountPolicyDataProtectionIntegStack(app, 'aws-cdk-account-policy-data-protection-integ');

const integTest = new IntegTest(app, 'account-policy-data-protection', {
  testCases: [testCase],
});

integTest.assertions.awsApiCall('CloudWatchLogs', 'describeAccountPolicies', {
  policyType: 'DATA_PROTECTION_POLICY',
  policyName: testCase.policyName,
}).expect(ExpectedResult.objectLike({
  accountPolicies: [
    {
      policyName: testCase.policyName,
      policyType: 'DATA_PROTECTION_POLICY',
    },
  ],
}));
