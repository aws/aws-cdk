import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib/index';

test('a mongodb connection with required properties only', () => {
  const stack = new cdk.Stack();
  new glue.MongoDBSourceConnection(stack, 'Connection', {
    database: 'database',
    collection: 'collection',
    batchSize: 100,
    ssl: true,
  });

  expect(stack).to(haveResource('AWS::Glue::Connection', {
    CatalogId: {
      Ref: 'AWS::AccountId',
    },
    ConnectionInput: {
      ConnectionProperties: {
        database: 'database',
        collection: 'collection',
        batchSize: '100',
        ssl: 'true',
      },
      ConnectionType: 'MONGODB',
    },
  }));
});
