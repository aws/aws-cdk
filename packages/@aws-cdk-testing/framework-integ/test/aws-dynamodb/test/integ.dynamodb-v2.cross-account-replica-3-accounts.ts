/**
 * Notes on how to run this integ test
 *
 * This test creates a DynamoDB global table with multi-account replication
 * across 3 accounts (source + 2 replicas). This validates that the aggregated
 * aws:SourceAccount condition includes all participating accounts.
 *
 * Replace 111111111111, 222222222222, and 333333333333 with your own account numbers.
 *
 * 1. Configure Accounts
 *   a. Account A (111111111111) should be bootstrapped for eu-west-1
 *      and needs to set trust permissions for accounts B and C
 *      - `cdk bootstrap --trust 222222222222 --trust 333333333333 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 *   b. Account B (222222222222) should be bootstrapped for ca-central-1
 *   c. Account C (333333333333) should be bootstrapped for us-west-2
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=111111111111`
 *   b. `export CDK_INTEG_MULTI_ACCOUNT=222222222222`
 *   c. `export CDK_INTEG_MULTI_ACCOUNT_2=333333333333`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. `yarn integ aws-dynamodb/test/integ.dynamodb-v2.cross-account-replica-3-accounts.js`
 *
 * 4. Before you commit, set all accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
 */

import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const account = process.env.CDK_INTEG_ACCOUNT || '111111111111';
const multiAccount = process.env.CDK_INTEG_MULTI_ACCOUNT || '222222222222';
const multiAccount2 = process.env.CDK_INTEG_MULTI_ACCOUNT_2 || '333333333333';

const app = new App();

// Source table in Account A
const sourceStack = new Stack(app, 'MultiAccount3SourceStack', {
  env: { region: 'eu-west-1', account },
});

const sourceTable = new dynamodb.TableV2(sourceStack, 'SourceTable', {
  tableName: 'MultiAccountGlobalTable3Acct',
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
const replicaStack1 = new Stack(app, 'MultiAccount3ReplicaStack1', {
  env: { region: 'ca-central-1', account: multiAccount },
});

new dynamodb.TableV2MultiAccountReplica(replicaStack1, 'ReplicaTable1', {
  tableName: 'MultiAccountGlobalTable3Acct',
  replicaSourceTable: sourceTable,
  globalTableSettingsReplicationMode: dynamodb.GlobalTableSettingsReplicationMode.ALL,
  removalPolicy: RemovalPolicy.DESTROY,
});

// Replica table in Account C
const replicaStack2 = new Stack(app, 'MultiAccount3ReplicaStack2', {
  env: { region: 'us-west-2', account: multiAccount2 },
});

new dynamodb.TableV2MultiAccountReplica(replicaStack2, 'ReplicaTable2', {
  tableName: 'MultiAccountGlobalTable3Acct',
  replicaSourceTable: sourceTable,
  globalTableSettingsReplicationMode: dynamodb.GlobalTableSettingsReplicationMode.ALL,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'MultiAccount3ReplicaIntegTest', {
  testCases: [sourceStack, replicaStack1, replicaStack2],
});
