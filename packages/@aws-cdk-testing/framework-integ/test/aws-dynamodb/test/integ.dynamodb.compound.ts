import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-cdk-dynamodb-compound-keys');

const table = new Table(stack, 'Table', {
  tableName: 'cdk-test-compound',
  partitionKey: { name: 'pkey', type: AttributeType.NUMBER },
  removalPolicy: RemovalPolicy.DESTROY,
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexA',
  partitionKeys: [{ name: 'PK1', type: AttributeType.STRING }, { name: 'PK2', type: AttributeType.NUMBER }],
  sortKeys: [{ name: 'SK1', type: AttributeType.STRING }, { name: 'SK2', type: AttributeType.NUMBER }],
  projectionType: ProjectionType.INCLUDE,
  nonKeyAttributes: ['bar'],
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexB',
  partitionKey: { name: 'baz', type: AttributeType.STRING },
  sortKeys: [{ name: 'bar', type: AttributeType.STRING }, { name: 'foo', type: AttributeType.NUMBER }],
  projectionType: ProjectionType.INCLUDE,
  nonKeyAttributes: ['blah'],
});

new IntegTest(app, 'aws-cdk-dynamodb-compound-key-gsi', {
  testCases: [stack],
});
