import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { AccountPolicy, AccountPolicyDocument, ParserProcessor, ParserProcessorType } from 'aws-cdk-lib/aws-logs';

class AccountPolicyTransformerIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const jsonParser = new ParserProcessor({
      type: ParserProcessorType.JSON,
      jsonOptions: { source: 'customField' },
    });

    new AccountPolicy(this, 'AccountPolicy', {
      policyName: 'AccountPolicyTransformerIntegTest',
      policy: AccountPolicyDocument.transformer({
        processors: [jsonParser],
        logGroupNamePrefix: '/aws/lambda/',
      }),
    });
  }
}

const app = new App();
const testCase = new AccountPolicyTransformerIntegStack(app, 'aws-cdk-account-policy-transformer-integ');

new IntegTest(app, 'account-policy-transformer', {
  testCases: [testCase],
});
