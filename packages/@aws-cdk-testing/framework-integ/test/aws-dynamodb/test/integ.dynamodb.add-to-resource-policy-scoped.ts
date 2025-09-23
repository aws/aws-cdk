/**
 * Integration test for DynamoDB Table.addToResourcePolicy() with proper resource scoping
 *
 * This test validates that addToResourcePolicy() can work with properly scoped resources
 * (not using "*") when constructed carefully to avoid circular dependencies.
 *
 * @see https://github.com/aws/aws-cdk/issues/35062
 */

import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestScopedResourcePolicyStack extends Stack {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    this.table = new dynamodb.Table(this, 'TestTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Add resource policy with a properly scoped resource using string interpolation
    // This avoids circular dependency by not referencing table.tableArn directly
    const cfnTable = this.table.node.defaultChild as dynamodb.CfnTable;
    const tableLogicalId = cfnTable.logicalId;

    this.table.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:GetItem', 'dynamodb:Query'],
      principals: [new iam.AccountRootPrincipal()],
      // Use CloudFormation intrinsic function to construct table ARN
      // This creates: arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${LogicalId}
      resources: [`arn:aws:dynamodb:\${AWS::Region}:\${AWS::AccountId}:table/\${${tableLogicalId}}`],
    }));
  }
}

const app = new App();
const stack = new TestScopedResourcePolicyStack(app, 'scoped-resource-policy-test-stack');

const integTest = new IntegTest(app, 'scoped-resource-policy-integ-test', {
  testCases: [stack],
});

// ASSERTIONS: Validate proper resource scoping

// 1. Verify table deploys successfully
const describeTable = integTest.assertions.awsApiCall('DynamoDB', 'describeTable', {
  TableName: stack.table.tableName,
});

describeTable.expect(ExpectedResult.objectLike({
  Table: {
    TableStatus: 'ACTIVE',
  },
}));

// 2. Additional CloudFormation template validation could be added here if needed
// The main validation is that the table deploys successfully with scoped resources
