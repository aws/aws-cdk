import { App, Stack } from '@aws-cdk/cdk';
import { Attribute, AttributeType, ProjectionType, StreamViewType, Table } from '../lib';

// CDK parameters
const STACK_NAME = 'aws-cdk-dynamodb';

// DynamoDB table parameters
const TABLE_PARTITION_KEY: Attribute = { name: 'hashKey', type: AttributeType.String };
const TABLE_SORT_KEY: Attribute = { name: 'sortKey', type: AttributeType.Number };

// DynamoDB global secondary index parameters
const GSI_TEST_CASE_1 = 'PartitionKeyOnly';
const GSI_TEST_CASE_2 = 'PartitionAndSortKeyWithReadAndWriteCapacity';
const GSI_TEST_CASE_3 = 'ProjectionTypeKeysOnly';
const GSI_TEST_CASE_4 = 'ProjectionTypeInclude';
const GSI_TEST_CASE_5 = 'InverseTableKeySchema';
const GSI_PARTITION_KEY: Attribute = { name: 'gsiHashKey', type: AttributeType.String };
const GSI_SORT_KEY: Attribute = { name: 'gsiSortKey', type: AttributeType.Number };
const GSI_NON_KEY: string[] = [];
for (let i = 0; i < 20; i++) { // 'A' to 'T'
  GSI_NON_KEY.push(String.fromCharCode(65 + i));
}

const app = new App(process.argv);

const stack = new Stack(app, STACK_NAME);

const table = new Table(stack, 'Table', {
  pitrEnabled: true,
  sseEnabled: true,
  streamSpecification: StreamViewType.KeysOnly,
  ttlAttributeName: 'timeToLive'
});

table.addPartitionKey(TABLE_PARTITION_KEY);
table.addSortKey(TABLE_SORT_KEY);
table.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_1,
  partitionKey: GSI_PARTITION_KEY,
});
table.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_2,
  partitionKey: GSI_PARTITION_KEY,
  sortKey: GSI_SORT_KEY,
  readCapacity: 10,
  writeCapacity: 10,
});
table.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_3,
  partitionKey: GSI_PARTITION_KEY,
  sortKey: GSI_SORT_KEY,
  projectionType: ProjectionType.KeysOnly,
});
table.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_4,
  partitionKey: GSI_PARTITION_KEY,
  sortKey: GSI_SORT_KEY,
  projectionType: ProjectionType.Include,
  nonKeyAttributes: GSI_NON_KEY
});
table.addGlobalSecondaryIndex({
  indexName: GSI_TEST_CASE_5,
  partitionKey: TABLE_SORT_KEY,
  sortKey: TABLE_PARTITION_KEY,
});

const tableWithoutSecondaryIndex = new Table(stack, 'TableWithoutSecondaryIndex', {});
tableWithoutSecondaryIndex.addPartitionKey(TABLE_PARTITION_KEY);

process.stdout.write(app.run());
