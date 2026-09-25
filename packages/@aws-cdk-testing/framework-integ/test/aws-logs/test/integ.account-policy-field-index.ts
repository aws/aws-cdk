import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { AccountPolicy, AccountPolicyDocument, FieldIndexDataSource, FieldIndexPolicy } from 'aws-cdk-lib/aws-logs';

class AccountPolicyFieldIndexIntegStack extends Stack {
  public readonly dataSourceScopedPolicyName: string;
  public readonly prefixScopedPolicyName: string;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Scoped via dataSource: exercises the DataSourceName/DataSourceType selectionCriteria syntax.
    const dataSourceScoped = new AccountPolicy(this, 'DataSourceScoped', {
      policyName: 'AccountPolicyFieldIndexDataSourceIntegTest',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['srcAddr', 'dstAddr'] }),
        dataSource: FieldIndexDataSource.VPC_FLOW_LOGS,
      }),
    });
    this.dataSourceScopedPolicyName = dataSourceScoped.policyName;

    // Scoped via logGroupNamePrefix: the more common selectionCriteria form.
    const prefixScoped = new AccountPolicy(this, 'PrefixScoped', {
      policyName: 'AccountPolicyFieldIndexPrefixIntegTest',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['RequestId'] }),
        logGroupNamePrefix: '/aws/lambda/',
      }),
    });
    this.prefixScopedPolicyName = prefixScoped.policyName;
  }
}

const app = new App();
const testCase = new AccountPolicyFieldIndexIntegStack(app, 'aws-cdk-account-policy-field-index-integ');

const integTest = new IntegTest(app, 'account-policy-field-index', {
  testCases: [testCase],
});

// Confirms the service persists the DataSourceName/DataSourceType selectionCriteria syntax as-is
// (this syntax isn't documented by CloudFormation, only reachable via CDK's FieldIndexDataSource).
integTest.assertions.awsApiCall('CloudWatchLogs', 'describeAccountPolicies', {
  policyType: 'FIELD_INDEX_POLICY',
  policyName: testCase.dataSourceScopedPolicyName,
}).expect(ExpectedResult.objectLike({
  accountPolicies: [
    {
      policyName: testCase.dataSourceScopedPolicyName,
      policyType: 'FIELD_INDEX_POLICY',
      selectionCriteria: 'DataSourceName = "amazon_vpc" AND DataSourceType = "flow"',
    },
  ],
}));

integTest.assertions.awsApiCall('CloudWatchLogs', 'describeAccountPolicies', {
  policyType: 'FIELD_INDEX_POLICY',
  policyName: testCase.prefixScopedPolicyName,
}).expect(ExpectedResult.objectLike({
  accountPolicies: [
    {
      policyName: testCase.prefixScopedPolicyName,
      policyType: 'FIELD_INDEX_POLICY',
      selectionCriteria: 'LogGroupNamePrefix = "/aws/lambda/"',
    },
  ],
}));
