/**
 * Notes on how to run this integ test
 *
 * This test creates a DynamoDB global table with multi-account replication using
 * customer-managed KMS encryption. It validates that TableV2MultiAccountReplica
 * correctly sets the top-level SSESpecification when using customer-managed keys.
 *
 * Replace 111111111111 and 222222222222 with your own account numbers.
 *
 * 1. Configure Accounts
 *   a. Account A (111111111111) should be bootstrapped for eu-west-1
 *      and needs to set trust permissions for account B (222222222222)
 *      - `cdk bootstrap --trust 222222222222 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 *      - assuming this is the default profile for aws credentials
 *   b. Account B (222222222222) should be bootstrapped for ca-central-1
 *      - assuming this account is configured with the profile 'multi-account' for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=111111111111`
 *   b. `export CDK_INTEG_MULTI_ACCOUNT=222222222222`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. `yarn integ aws-dynamodb/test/integ.dynamodb-v2.cross-account-replica-kms.js`
 *
 * 4. Before you commit, set both accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
 */

import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as kms from 'aws-cdk-lib/aws-kms';

const account = process.env.CDK_INTEG_ACCOUNT || '111111111111';
const multiAccount = process.env.CDK_INTEG_MULTI_ACCOUNT || '222222222222';

const app = new App();

// Source table in Account A
const sourceStack = new Stack(app, 'MultiAccountKmsSourceStackV2', {
  env: { region: 'eu-west-1', account },
});

const sourceTable = new dynamodb.TableV2(sourceStack, 'SourceTableV2', {
  tableName: 'MultiAccountGlobalTableKms',
  partitionKey: {
    name: 'pk',
    type: dynamodb.AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

// Replica table in Account B with customer-managed KMS encryption
const replicaStack = new Stack(app, 'MultiAccountKmsReplicaStackV2', {
  env: { region: 'ca-central-1', account: multiAccount },
});

// KMS key in the replica account for encrypting the replica
const replicaKey = new kms.Key(replicaStack, 'ReplicaKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});

// Regression test for https://github.com/aws/aws-cdk/issues/37783:
// TableV2MultiAccountReplica must set top-level SSESpecification when using
// customer-managed encryption; without the fix this omission causes a
// CloudFormation validation error at deploy time.
new dynamodb.TableV2MultiAccountReplica(replicaStack, 'ReplicaTableV2', {
  tableName: 'MultiAccountGlobalTableKms',
  replicaSourceTable: sourceTable,
  encryption: dynamodb.TableEncryptionV2.customerManagedKey(replicaKey),
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'MultiAccountKmsReplicaIntegTestV2', {
  testCases: [sourceStack, replicaStack],
});
