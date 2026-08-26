/**
 * Notes on how to run this integ test
 *
 * This test creates a DynamoDB replica from an imported source table
 * where the source table ARN has a tokenized table name but concrete
 * account and region.
 *
 * This test verifies the fix for partially tokenized ARNs where:
 * - The account and region in the ARN are concrete
 * - The table name is tokenized (e.g., from a Lazy string or parameter)
 *
 * Prerequisites:
 *   - A source table must already exist in Account A (111111111111) in us-east-1
 *   - The source table must have resource policies configured for multi-account replication
 *
 * 1. Configure Accounts
 *   a. Account A (111111111111) should have an existing DynamoDB table with proper resource policies
 *   b. Account B (222222222222) should be bootstrapped for us-west-2
 *      - assuming this account is configured with the profile 'multi-account' for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=111111111111`
 *   b. `export CDK_INTEG_MULTI_ACCOUNT=222222222222`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. `yarn integ aws-dynamodb/test/integ.dynamodb-v2.multi-account-replica-partial-arn.js --profiles multi-account`
 *
 * 4. Before you commit, set both accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
 */

import { App, Lazy, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const account = process.env.CDK_INTEG_ACCOUNT || '111111111111';
const multiAccount = process.env.CDK_INTEG_MULTI_ACCOUNT || '222222222222';

const app = new App();

const replicaStack = new Stack(app, 'ReplicaStack', {
  env: { region: 'ca-central-1', account: multiAccount },
});

// Import source table from different account with partially tokenized ARN:
// - Concrete account (111111111111) and region (us-east-1)
// - Tokenized table name (from Lazy.string)
const dynamicTableName = Lazy.string({ produce: () => 'MultiAccountGlobalTable' });
const importedSource = dynamodb.TableV2.fromTableArn(
  replicaStack,
  'ImportedSource',
  `arn:aws:dynamodb:us-east-1:${account}:table/${dynamicTableName}`,
);

// Create replica - user must manually grant on source table
new dynamodb.TableV2MultiAccountReplica(replicaStack, 'Replica', {
  tableName: 'MultiAccountGlobalTable',
  replicaSourceTable: importedSource,
  globalTableSettingsReplicationMode: dynamodb.GlobalTableSettingsReplicationMode.ALL,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'ImportedReplicaPartialArnTest', {
  testCases: [replicaStack],
});
