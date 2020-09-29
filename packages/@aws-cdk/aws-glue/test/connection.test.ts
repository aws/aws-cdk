import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as glue from '../lib';

export = {
  'creates a connection'(test: Test) {
    const stack = new Stack();

    new glue.Connection(stack, 'Connection', {
        connectionProperties: {},
    });

    expect(stack).to(haveResource('AWS::Glue::Connection', {
      "CatalogId": {
        "Ref": "AWS::AccountId"
      },
      "ConnectionInput": {
        "ConnectionProperties": {},
        "ConnectionType": "JDBC",
        "PhysicalConnectionRequirements": {}
      }
    }));

    test.done();
  },

  // 'creates a connection with vpc'(test: Test) {
  //   const stack = new Stack();
  //   const vpc = new ec2.Vpc(stack, 'Vpc')

  //   new glue.Connection(stack, 'Connection', {
  //       connectionProperties: {},
  //       vpc
  //   });

  //   expect(stack).toMatch({});

  //   test.done();
  // },
};
