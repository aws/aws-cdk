import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Connection } from '../lib/connection';

export = {
  'creates an connection for an EventBus'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Connection(stack, 'Connection', {
      authorizationType: 'BASIC',
      authParameters: {
        BasicAuthParameters: {
          Password: 'password',
          Username: 'username',
        },
      },
      description: 'ConnectionDescription',
      name: 'testConnection',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Connection', {
      Name: 'testConnection',
      Description: 'ConnectionDescription',
      AuthorizationType: 'BASIC',
      AuthParameters: {
        BasicAuthParameters: {
          Username: 'password',
          Password: 'username',
        },
      },
    }));

    test.done();
  },
}
