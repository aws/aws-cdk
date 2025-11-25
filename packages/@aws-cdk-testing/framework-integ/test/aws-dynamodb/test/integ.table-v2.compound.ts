import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, ProjectionType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';

const app = new App();
const stack = new Stack(app, 'aws-cdk-dynamodb-v2-compound-keys');

const table = new TableV2(stack, 'Table', {
  tableName: 'cdk-test-tableV2-compound',
  partitionKey: { name: 'pkey', type: AttributeType.NUMBER },
  globalSecondaryIndexes: [{
    indexName: 'IndexA',
    partitionKeys: [{ name: 'GSIAPK1', type: AttributeType.STRING }, { name: 'GSIAPK2', type: AttributeType.STRING }],
    sortKeys: [{ name: 'GSIASK1', type: AttributeType.STRING }, { name: 'GSIASK2', type: AttributeType.NUMBER }],
  }],
  removalPolicy: RemovalPolicy.DESTROY,
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexB',
  partitionKeys: [{ name: 'PK1', type: AttributeType.STRING }, { name: 'PK2', type: AttributeType.NUMBER }],
  sortKeys: [{ name: 'SK1', type: AttributeType.STRING }, { name: 'SK2', type: AttributeType.NUMBER }],
  projectionType: ProjectionType.INCLUDE,
  nonKeyAttributes: ['bar'],
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexC',
  partitionKey: { name: 'baz', type: AttributeType.STRING },
  sortKeys: [{ name: 'bar', type: AttributeType.STRING }],
  projectionType: ProjectionType.INCLUDE,
  nonKeyAttributes: ['blah'],
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexD',
  partitionKeys: [{ name: 'PK3', type: AttributeType.STRING }, { name: 'PK4', type: AttributeType.NUMBER }],
  sortKeys: [{ name: 'SK3', type: AttributeType.STRING }, { name: 'SK4', type: AttributeType.NUMBER }],
});

new IntegTest(app, 'aws-cdk-dynamodbv2-compound-key-gsi', {
  testCases: [stack],
});
