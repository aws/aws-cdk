import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import * as glue from '../lib';

test('default database does not create a bucket', () => {
  const stack = new Stack();

  new glue.Database(stack, 'Database', {
    databaseName: 'test_database',
  });

  Template.fromStack(stack).templateMatches({
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

  Template.fromStack(stack).templateMatches({
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
  ).toThrow();
});

test('locationUri length must be <= 1024', () => {
  const stack = new Stack();
  expect(() =>
    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
      locationUri: 'a'.repeat(1025),
    }),
  ).toThrow();
});
