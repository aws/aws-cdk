import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { AccountPolicy, AccountPolicyDocument, FieldIndexDataSource, FieldIndexPolicy } from 'aws-cdk-lib/aws-logs';

class AccountPolicyFieldIndexIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Scoped via dataSource: exercises the DataSourceName/DataSourceType selectionCriteria syntax.
    new AccountPolicy(this, 'DataSourceScoped', {
      policyName: 'AccountPolicyFieldIndexDataSourceIntegTest',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['srcAddr', 'dstAddr'] }),
        dataSource: FieldIndexDataSource.VPC_FLOW_LOGS,
      }),
    });

    // Scoped via logGroupNamePrefix: the more common selectionCriteria form.
    new AccountPolicy(this, 'PrefixScoped', {
      policyName: 'AccountPolicyFieldIndexPrefixIntegTest',
      policy: AccountPolicyDocument.fieldIndex({
        policy: new FieldIndexPolicy({ fields: ['RequestId'] }),
        logGroupNamePrefix: '/aws/lambda/',
      }),
    });
  }
}

const app = new App();
const testCase = new AccountPolicyFieldIndexIntegStack(app, 'aws-cdk-account-policy-field-index-integ');

new IntegTest(app, 'account-policy-field-index', {
  testCases: [testCase],
});
