import '@aws-cdk/assert/jest';
import { expect as expectStack } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import * as glue from '../lib';

test('default database does not create a bucket', () => {
  const stack = new Stack();

  new glue.Database(stack, 'Database', {
    databaseName: 'test_database',
  });

  expectStack(stack).toMatch({
    Resources: {
      DatabaseB269D8BB: {
        Type: 'AWS::Glue::Database',
        Properties: {
          CatalogId: {
            Ref: 'AWS::AccountId',
          },
          DatabaseInput: {
            Name: 'test_database',
          },
        },
      },
    },
  });
});

test('explicit locationURI', () => {
  const stack = new Stack();

  new glue.Database(stack, 'Database', {
    databaseName: 'test_database',
    locationUri: 's3://my-uri/',
  });

  expectStack(stack).toMatch({
    Resources: {
      DatabaseB269D8BB: {
        Type: 'AWS::Glue::Database',
        Properties: {
          CatalogId: {
            Ref: 'AWS::AccountId',
          },
          DatabaseInput: {
            LocationUri: 's3://my-uri/',
            Name: 'test_database',
          },
        },
      },
    },
  });
});

test('resource link database', () => {
  const stack = new Stack();

  new glue.Database(stack, 'Database', {
    databaseName: 'test_database',
    targetDatabase: {
      catalogId: '123456789012',
      databaseName: 'target_database',
    },
  });

  expectStack(stack).toMatch({
    Resources: {
      DatabaseB269D8BB: {
        Type: 'AWS::Glue::Database',
        Properties: {
          CatalogId: {
            Ref: 'AWS::AccountId',
          },
          DatabaseInput: {
            Name: 'test_database',
            TargetDatabase: {
              CatalogId: '123456789012',
              DatabaseName: 'target_database',
            },
          },
        },
      },
    },
  });
});

test('fromDatabase', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const database = glue.Database.fromDatabaseArn(stack, 'import', 'arn:aws:glue:us-east-1:123456789012:database/db1');

  // THEN
  expect(database.databaseArn).toEqual('arn:aws:glue:us-east-1:123456789012:database/db1');
  expect(database.databaseName).toEqual('db1');
  expect(stack.resolve(database.catalogArn)).toEqual({
    'Fn::Join': ['',
      ['arn:', { Ref: 'AWS::Partition' }, ':glue:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':catalog']],
  });
  expect(stack.resolve(database.catalogId)).toEqual({ Ref: 'AWS::AccountId' });
});

test('locationUri length must be >= 1', () => {
  const stack = new Stack();
  expect(() =>
    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
      locationUri: '',
    }),
  ).toThrow(/locationUri length must be [(]inclusively[)] between 1 and 1024, but was (.*?)/);
});

test('locationUri length must be <= 1024', () => {
  const stack = new Stack();
  expect(() =>
    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
      locationUri: 'a'.repeat(1025),
    }),
  ).toThrow(/locationUri length must be [(]inclusively[)] between 1 and 1024, but was (.*?)/);
});

test('cannot have a locationUri and a targetDatabase', () => {
  const stack = new Stack();
  expect(() =>
    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
      locationUri: 's3://my-uri/',
      targetDatabase: {
        catalogId: '123456789012',
        databaseName: 'target_database',
      },
    }),
  ).toThrow(/locationUri and targetDatabase parameters cannot be specified at the same time./);
});
