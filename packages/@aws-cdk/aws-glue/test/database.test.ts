import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import * as glue from '../lib';

let stack: Stack;

beforeEach( () => {
  const app = new App({
    context: {
      '@aws-cdk/core:newStyleStackSynthesis': false,
    },
  });
  stack = new Stack(app);
});

test('default database does not create a bucket', () => {
  new glue.Database(stack, 'Database');

  Template.fromStack(stack).templateMatches({
    Resources: {
      DatabaseB269D8BB: {
        Type: 'AWS::Glue::Database',
        Properties: {
          CatalogId: {
            Ref: 'AWS::AccountId',
          },
          DatabaseInput: {
            Name: 'database',
          },
        },
      },
    },
  });

});

test('explicit locationURI', () => {
  new glue.Database(stack, 'Database', {
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
            Name: 'database',
          },
        },
      },
    },
  });

});

test('fromDatabase', () => {
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
  expect(() =>
    new glue.Database(stack, 'Database', {
      locationUri: '',
    }),
  ).toThrow();
});

test('locationUri length must be <= 1024', () => {
  expect(() =>
    new glue.Database(stack, 'Database', {
      locationUri: 'a'.repeat(1025),
    }),
  ).toThrow();
});

test('can specify a physical name', () => {
  new glue.Database(stack, 'Database', {
    databaseName: 'my_database',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Glue::Database', {
    DatabaseInput: {
      Name: 'my_database',
    },
  });
});
