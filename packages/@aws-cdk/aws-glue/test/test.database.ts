import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';

import glue = require('../lib');

export = {
  'default database'(test: Test) {
    const stack = new cdk.Stack();

    new glue.Database(stack, 'Database', {
      databaseName: 'test_database'
    });

    expect(stack).toMatch({
      Resources: {
        Database: {
          Type: 'AWS::Glue::Database'
        }
      }
    });

    test.done();
  }
};
