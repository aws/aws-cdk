import iam = require('@aws-cdk/aws-iam');
import { App, Stack, Tag } from '@aws-cdk/cdk';
import { Attribute, AttributeType, ProjectionType, StreamViewType, Table } from '../lib';

// CDK parameters
const STACK_NAME = 'aws-cdk-dynamodb';

// DynamoDB table parameters
const TABLE = 'Table';
const TABLE_WITH_GLOBAL_AND_LOCAL_SECONDARY_INDEX = 'TableWithGlobalAndLocalSecondaryIndex';
const TABLE_WITH_GLOBAL_SECONDARY_INDEX = 'TableWithGlobalSecondaryIndex';
const TABLE_WITH_LOCAL_SECONDARY_INDEX = 'TableWithLocalSecondaryIndex';
const TABLE_PARTITION_KEY: Attribute = { name: 'hashKey', type: AttributeType.String };
const TABLE_SORT_KEY: Attribute = { name: 'sortKey', type: AttributeType.Number };

// DynamoDB global secondary index parameters
const GSI_TEST_CASE_1 = 'GSI-PartitionKeyOnly';
const GSI_TEST_CASE_2 = 'GSI-PartitionAndSortKeyWithReadAndWriteCapacity';
const GSI_TEST_CASE_3 = 'GSI-ProjectionTypeKeysOnly';
const GSI_TEST_CASE_4 = 'GSI-ProjectionTypeInclude';
const GSI_TEST_CASE_5 = 'GSI-InverseTableKeySchema';
const GSI_PARTITION_KEY: Attribute = { name: 'gsiHashKey', type: AttributeType.String };
const GSI_SORT_KEY: Attribute = { name: 'gsiSortKey', type: AttributeType.Number };
const GSI_NON_KEY: string[] = [];
for (let i = 0; i < 10; i++) { // 'A' to 'J'
  GSI_NON_KEY.push(String.fromCharCode(65 + i));
}

// DynamoDB local secondary index parameters
const LSI_TEST_CASE_1 = 'LSI-PartitionAndSortKey';
const LSI_TEST_CASE_2 = 'LSI-PartitionAndTableSortKey';
const LSI_TEST_CASE_3 = 'LSI-ProjectionTypeKeysOnly';
const LSI_TEST_CASE_4 = 'LSI-ProjectionTypeInclude';
const LSI_SORT_KEY: Attribute = { name: 'lsiSortKey', type: AttributeType.Number };
const LSI_NON_KEY: string[] = [];
for (let i = 0; i < 10; i++) { // 'K' to 'T'
  LSI_NON_KEY.push(String.fromCharCode(75 + i));
}

const app = new App();

const stack = new Stack(app, STACK_NAME);

const table = new Table(stack, TABLE, {
  partitionKey: TABLE_PARTITION_KEY
});

const tableWithGlobalAndLocalSecondaryIndex = new Table(stack, TABLE_WITH_GLOBAL_AND_LOCAL_SECONDARY_INDEX, {
  pointInTimeRecovery: true,
  serverSideEncryption: true,
  stream: StreamViewType.KeysOnly,
  timeToLiveAttribute: 'timeToLive',
  partitionKey: TABLE_PARTITION_KEY,
  sortKey: TABLE_SORT_KEY
});

tableWithGlobalAndLocalSecondaryIndex.node.applyAspect(new Tag('Environment', 'Production'));
tableWithGlobalAndLocalSecondaryIndex.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_1,
  partitionKey: GSI_PARTITION_KEY,
});
tableWithGlobalAndLocalSecondaryIndex.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_2,
  partitionKey: GSI_PARTITION_KEY,
  sortKey: GSI_SORT_KEY,
  readCapacity: 10,
  writeCapacity: 10,
});
tableWithGlobalAndLocalSecondaryIndex.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_3,
  partitionKey: GSI_PARTITION_KEY,
  sortKey: GSI_SORT_KEY,
  projectionType: ProjectionType.KeysOnly,
});
tableWithGlobalAndLocalSecondaryIndex.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_4,
  partitionKey: GSI_PARTITION_KEY,
  sortKey: GSI_SORT_KEY,
  projectionType: ProjectionType.Include,
  nonKeyAttributes: GSI_NON_KEY
});
tableWithGlobalAndLocalSecondaryIndex.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_5,
  partitionKey: TABLE_SORT_KEY,
  sortKey: TABLE_PARTITION_KEY,
});

tableWithGlobalAndLocalSecondaryIndex.addLocalSecondaryIndex({
  indexName: LSI_TEST_CASE_2,
  sortKey: LSI_SORT_KEY
});
tableWithGlobalAndLocalSecondaryIndex.addLocalSecondaryIndex({
  indexName: LSI_TEST_CASE_1,
  sortKey: TABLE_SORT_KEY
});
tableWithGlobalAndLocalSecondaryIndex.addLocalSecondaryIndex({
  indexName: LSI_TEST_CASE_3,
  sortKey: LSI_SORT_KEY,
  projectionType: ProjectionType.KeysOnly
});
tableWithGlobalAndLocalSecondaryIndex.addLocalSecondaryIndex({
  indexName: LSI_TEST_CASE_4,
  sortKey: LSI_SORT_KEY,
  projectionType: ProjectionType.Include,
  nonKeyAttributes: LSI_NON_KEY
});

const tableWithGlobalSecondaryIndex = new Table(stack, TABLE_WITH_GLOBAL_SECONDARY_INDEX, {
  partitionKey: TABLE_PARTITION_KEY
});
tableWithGlobalSecondaryIndex.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_1,
  partitionKey: GSI_PARTITION_KEY
});

const tableWithLocalSecondaryIndex = new Table(stack, TABLE_WITH_LOCAL_SECONDARY_INDEX, {
  partitionKey: TABLE_PARTITION_KEY,
  sortKey: TABLE_SORT_KEY
});

tableWithLocalSecondaryIndex.addLocalSecondaryIndex({
  indexName: LSI_TEST_CASE_1,
  sortKey: LSI_SORT_KEY
});

const user = new iam.User(stack, 'User');
table.grantReadData(user);
tableWithGlobalAndLocalSecondaryIndex.grantReadData(user);

app.synth();
