import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { AccountPolicy, AccountPolicyDocument, DataIdentifier, DataProtectionPolicy } from 'aws-cdk-lib/aws-logs';

class AccountPolicyDataProtectionIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new AccountPolicy(this, 'AccountPolicy', {
      policyName: 'AccountPolicyDataProtectionIntegTest',
      policy: AccountPolicyDocument.dataProtection(new DataProtectionPolicy({
        name: 'account-policy-data-protection-integ',
        identifiers: [DataIdentifier.EMAILADDRESS],
      })),
    });
  }
}

const app = new App();
const testCase = new AccountPolicyDataProtectionIntegStack(app, 'aws-cdk-account-policy-data-protection-integ');

new IntegTest(app, 'account-policy-data-protection', {
  testCases: [testCase],
});
