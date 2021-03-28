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
        basicAuthParameters: {
          password: 'password',
          username: 'username',
        },
      },
      connectionName: 'testConnection',
      description: 'ConnectionDescription',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::Connection', {
      AuthorizationType: 'BASIC',
      AuthParameters: {
        BasicAuthParameters: {
          Password: 'password',
          Username: 'username',
        },
      },
      Name: 'testConnection',
      Description: 'ConnectionDescription',
    }));

    test.done();
  },
}
