/**
 * Notes on how to run this integ test
 *
 * This test creates a DynamoDB global table with multi-account replication.
 * Replace 111111111111 and 222222222222 with your own account numbers.
 *
 * 1. Configure Accounts
 *   a. Account A (111111111111) should be bootstrapped for us-east-1
 *      and needs to set trust permissions for account B (222222222222)
 *      - `cdk bootstrap --trust 222222222222 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 *      - assuming this is the default profile for aws credentials
 *   b. Account B (222222222222) should be bootstrapped for us-west-2
 *      - assuming this account is configured with the profile 'multi-account' for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=111111111111`
 *   b. `export CDK_INTEG_MULTI_ACCOUNT=222222222222`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. Get temporary console access credentials for account B
 *     - `yarn integ aws-dynamodb/test/integ.dynamodb-v2.multi-account-replica.js`
 *   b. Fall back if temp credentials do not work
 *     - `yarn integ aws-dynamodb/test/integ.dynamodb-v2.multi-account-replica.js --profiles multi-account`
 *
 * 4. Before you commit, set both accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
 */

import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const account = process.env.CDK_INTEG_ACCOUNT || '111111111111';
const multiAccount = process.env.CDK_INTEG_MULTI_ACCOUNT || '222222222222';

const app = new App();

// Source table in Account A
const sourceStack = new Stack(app, 'MultiAccountSourceStackV2', {
  env: { region: 'eu-west-1', account },
});

const sourceTable = new dynamodb.TableV2(sourceStack, 'SourceTableV2', {
  tableName: 'MultiAccountGlobalTable',
  partitionKey: {
    name: 'pk',
    type: dynamodb.AttributeType.STRING,
  },
  sortKey: {
    name: 'sk',
    type: dynamodb.AttributeType.STRING,
  },
  removalPolicy: RemovalPolicy.DESTROY,
  globalTableSettingsReplicationMode: dynamodb.GlobalTableSettingsReplicationMode.ALL,
});

// Replica table in Account B
const replicaStack = new Stack(app, 'MultiAccountReplicaStackV2', {
  env: { region: 'ca-central-1', account: multiAccount },
});

// Create replica - permissions are automatically configured
new dynamodb.TableV2MultiAccountReplica(replicaStack, 'ReplicaTableV2', {
  tableName: 'MultiAccountGlobalTable',
  replicaSourceTable: sourceTable,
  globalTableSettingsReplicationMode: dynamodb.GlobalTableSettingsReplicationMode.ALL,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'MultiAccountReplicaIntegTestV2', {
  testCases: [sourceStack, replicaStack],
});
