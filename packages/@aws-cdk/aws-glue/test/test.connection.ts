import { expect } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as glue from '../lib';
import { Vpc } from '@aws-cdk/aws-ec2';

export = {
  'creates a connection'(test: Test) {
    const stack = new Stack();

    new glue.Connection(stack, 'Connection', {
        connectionProperties: {},
    });

    expect(stack).toMatch({
      Resources: {
      }
    });

    test.done();
  },
  'creates a connection with vpc'(test: Test) {
    const stack = new Stack();
    const vpc = new Vpc(stack, 'Vpc')

    new glue.Connection(stack, 'Connection', {
        connectionProperties: {},
        vpc
    });

    expect(stack).toMatch({
      Resources: {
      }
    });

    test.done();
  },
};
