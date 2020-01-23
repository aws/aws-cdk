import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as glue from '../lib';

export = {
  'default database does not create a bucket'(test: Test) {
    const stack = new Stack();

    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
    });

    expect(stack).toMatch({
      Resources: {
        DatabaseB269D8BB: {
          Type: 'AWS::Glue::Database',
          Properties: {
            CatalogId: {
              Ref: "AWS::AccountId"
            },
            DatabaseInput: {
              Name: "test_database"
            }
          }
        }
      }
    });

    test.done();
  },

  'explicit locationURI'(test: Test) {
    const stack = new Stack();

    new glue.Database(stack, 'Database', {
      databaseName: 'test_database',
      locationUri: 's3://my-uri/'
    });

    expect(stack).toMatch({
      Resources: {
        DatabaseB269D8BB: {
          Type: 'AWS::Glue::Database',
          Properties: {
            CatalogId: {
              Ref: "AWS::AccountId"
            },
            DatabaseInput: {
              LocationUri: 's3://my-uri/',
              Name: "test_database"
            }
          }
        }
      }
    });

    test.done();
  },

  'fromDatabase'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const database = glue.Database.fromDatabaseArn(stack, 'import', 'arn:aws:glue:us-east-1:123456789012:database/db1');

    // THEN
    test.deepEqual(database.databaseArn, 'arn:aws:glue:us-east-1:123456789012:database/db1');
    test.deepEqual(database.databaseName, 'db1');
    test.deepEqual(stack.resolve(database.catalogArn), { 'Fn::Join': [ '',
      [ 'arn:', { Ref: 'AWS::Partition' }, ':glue:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':catalog' ] ] });
    test.deepEqual(stack.resolve(database.catalogId), { Ref: 'AWS::AccountId' });
    test.done();
  },

  'locationUri length must be >= 1'(test: Test) {
    const stack = new Stack();
    test.throws(() =>
        new glue.Database(stack, 'Database', {
          databaseName: 'test_database',
          locationUri: ''
        })
    );
    test.done();
  },

  'locationUri length must be <= 1024'(test: Test) {
    const stack = new Stack();
    test.throws(() =>
        new glue.Database(stack, 'Database', {
          databaseName: 'test_database',
          locationUri: 'a'.repeat(1025)
        })
    );
    test.done();
  }
};
