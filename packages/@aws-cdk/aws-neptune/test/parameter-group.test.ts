import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { ClusterParameterGroup, ParameterGroup } from '../lib';

describe('ClusterParameterGroup', () => {

  test('create a cluster parameter group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ClusterParameterGroup(stack, 'Params', {
      description: 'desc',
      parameters: {
        key: 'value',
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::Neptune::DBClusterParameterGroup', {
      Description: 'desc',
      Parameters: {
        key: 'value',
      },
    }));

  });

  test('create a instance/db parameter group', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ParameterGroup(stack, 'Params', {
      description: 'desc',
      parameters: {
        key: 'value',
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::Neptune::DBClusterParameterGroup', {
      Description: 'desc',
      Parameters: {
        key: 'value',
      },
    }));

  });
});
