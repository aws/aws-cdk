/**
 * This aimes to verify we can deploy a DynamoDB table with an attribute being
 * a key attribute in one GSI, and a non-key attribute in another.
 *
 * See https://github.com/aws/aws-cdk/issues/4398
 */

import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';

const app = new App();
const stack = new Stack(app, 'aws-cdk-dynamodb-gsi');

const table = new Table(stack, 'Table', {
  partitionKey: { name: 'pkey', type: AttributeType.NUMBER },
  removalPolicy: RemovalPolicy.DESTROY,
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexA',
  partitionKey: { name: 'foo', type: AttributeType.STRING },
  projectionType: ProjectionType.INCLUDE,
  nonKeyAttributes: ['bar'],
});

table.addGlobalSecondaryIndex({
  indexName: 'IndexB',
  partitionKey: { name: 'baz', type: AttributeType.STRING },
  sortKey: { name: 'bar', type: AttributeType.STRING },
  projectionType: ProjectionType.INCLUDE,
  nonKeyAttributes: ['blah'],
});
