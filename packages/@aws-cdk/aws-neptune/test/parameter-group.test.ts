import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { ClusterParameterGroup, ParameterGroup, ParameterGroupFamily } from '../lib';

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
    Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBClusterParameterGroup', {
      Description: 'desc',
      Family: 'neptune1',
      Parameters: {
        key: 'value',
      },
    });
  });

  test.each([
    ['neptune1', ParameterGroupFamily.NEPTUNE_1], ['neptune1.2', ParameterGroupFamily.NEPTUNE_1_2],
  ])('create a cluster parameter group with family %s', (expectedFamily, family) => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ClusterParameterGroup(stack, 'Params', {
      description: 'desc',
      family,
      parameters: {
        key: 'value',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBClusterParameterGroup', {
      Description: 'desc',
      Family: expectedFamily,
      Parameters: {
        key: 'value',
      },
    });
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
    Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBParameterGroup', {
      Description: 'desc',
      Family: 'neptune1',
      Parameters: {
        key: 'value',
      },
    });
  });

  test.each([
    ['neptune1', ParameterGroupFamily.NEPTUNE_1], ['neptune1.2', ParameterGroupFamily.NEPTUNE_1_2],
  ])('create a a instance/db parameter group with family %s', (expectedFamily, family) => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new ParameterGroup(stack, 'Params', {
      description: 'desc',
      family,
      parameters: {
        key: 'value',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Neptune::DBParameterGroup', {
      Description: 'desc',
      Family: expectedFamily,
      Parameters: {
        key: 'value',
      },
    });
  });
});
