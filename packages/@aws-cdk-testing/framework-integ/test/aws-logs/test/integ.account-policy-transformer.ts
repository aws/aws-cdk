import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import {
  AccountPolicy,
  AccountPolicyDocument,
  OCSFSourceType,
  OCSFVersion,
  ParserProcessor,
  ParserProcessorType,
  VendedLogParser,
  VendedLogType,
} from 'aws-cdk-lib/aws-logs';

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

    // Non-overlapping logGroupNamePrefix scopes let multiple TRANSFORMER_POLICY account
    // policies coexist, so each processor-key override (PROCESSOR_KEY_OVERRIDES) below gets
    // its own real deploy instead of unit-test-only coverage.
    new AccountPolicy(this, 'VpcAccountPolicy', {
      policyName: 'AccountPolicyTransformerVpcIntegTest',
      policy: AccountPolicyDocument.transformer({
        processors: [new VendedLogParser({ logType: VendedLogType.VPC })],
        logGroupNamePrefix: '/aws/vpc/',
      }),
    });

    new AccountPolicy(this, 'WafAccountPolicy', {
      policyName: 'AccountPolicyTransformerWafIntegTest',
      policy: AccountPolicyDocument.transformer({
        processors: [new VendedLogParser({ logType: VendedLogType.WAF })],
        logGroupNamePrefix: '/aws/waf/',
      }),
    });

    new AccountPolicy(this, 'OcsfAccountPolicy', {
      policyName: 'AccountPolicyTransformerOcsfIntegTest',
      policy: AccountPolicyDocument.transformer({
        processors: [
          new ParserProcessor({
            type: ParserProcessorType.OCSF,
            parseToOCSFOptions: {
              eventSource: OCSFSourceType.VPC_FLOW,
              ocsfVersion: OCSFVersion.V1_1,
            },
          }),
        ],
        logGroupNamePrefix: '/aws/ocsf/',
      }),
    });
  }
}

const app = new App();
const testCase = new AccountPolicyTransformerIntegStack(app, 'aws-cdk-account-policy-transformer-integ');

new IntegTest(app, 'account-policy-transformer', {
  testCases: [testCase],
});
