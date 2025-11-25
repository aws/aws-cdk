/**
 * Integration test for DynamoDB Table.addToResourcePolicy() method
 *
 * This test validates the fix for issue #35062: "(aws-dynamodb): `addToResourcePolicy` has no effect"
 *
 * WHAT WE'RE TESTING:
 * - The addToResourcePolicy() method was broken - it had "no effect" when called
 * - Resource policies weren't being added to the CloudFormation template
 * - This created a security gap where developers thought they were securing tables but policies weren't applied
 *
 * TEST VALIDATION:
 * 1. Creates DynamoDB tables with different resource policy configurations
 * 2. Tests both wildcard resources (for auto-generated names) and scoped resources (for explicit names)
 * 3. Verifies policies get added to CloudFormation templates with correct structure
 * 4. Ensures both patterns work without circular dependencies
 *
 * @see https://github.com/aws/aws-cdk/issues/35062
 */

import { App, Fn, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export class TestStack extends Stack {
  public readonly wildcardTable: dynamodb.Table;
  public readonly scopedTable: dynamodb.Table;
  public readonly grantTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // TEST 1: Table with wildcard resource policy (auto-generated name)
    // This is the standard pattern to avoid circular dependencies
    this.wildcardTable = new dynamodb.Table(this, 'WildcardTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Add resource policy with wildcard resources
    this.wildcardTable.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query'],
      principals: [new iam.AccountRootPrincipal()],
      resources: ['*'], // Use wildcard to avoid circular dependency - standard pattern for resource policies
    }));

    // TEST 2: Table with scoped resource policy (explicit table name)
    // This demonstrates how to use scoped resources when table name is known at synthesis time
    this.scopedTable = new dynamodb.Table(this, 'ScopedTable', {
      tableName: 'my-explicit-scoped-table', // Explicit name enables scoped ARN construction
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Add resource policy with properly scoped resource using explicit table name
    // This works because table name is known at synthesis time (no circular dependency)
    this.scopedTable.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:GetItem', 'dynamodb:Query'],
      principals: [new iam.AccountRootPrincipal()],
      // Use CloudFormation intrinsic function to construct table ARN with known table name
      resources: [Fn.sub('arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/my-explicit-scoped-table')],
    }));

    // TEST 3: Table using grant methods with AccountRootPrincipal
    // This validates the fix for issue #35967: circular dependency when using grant methods
    // Before fix: grant methods with AccountRootPrincipal caused circular dependency
    // After fix: grant methods use resourceSelfArns: ['*'] to avoid circular dependency
    this.grantTable = new dynamodb.Table(this, 'GrantTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // This should NOT cause circular dependency - validates fix for #35967
    // Using grantWriteData because it has simpler actions valid for resource policies
    this.grantTable.grantWriteData(new iam.AccountRootPrincipal());
  }
}

// Test Setup
const app = new App();
const stack = new TestStack(app, 'add-to-resource-policy-test-stack');

// Integration Test Configuration
new IntegTest(app, 'add-to-resource-policy-integ-test', {
  testCases: [stack],
});

