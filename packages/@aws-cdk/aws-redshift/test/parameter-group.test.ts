import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { ClusterParameterGroup, AddParameterResultStatus } from '../lib';

test('create a cluster parameter group', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new ClusterParameterGroup(stack, 'Params', {
    description: 'desc',
    parameters: {
      param: 'value',
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Redshift::ClusterParameterGroup', {
    Description: 'desc',
    ParameterGroupFamily: 'redshift-1.0',
    Parameters: [
      {
        ParameterName: 'param',
        ParameterValue: 'value',
      },
    ],
  });

});

describe('Adding parameters to an existing group', () => {
  test('Adding a new parameter', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const params = new ClusterParameterGroup(stack, 'Params', {
      description: 'desc',
      parameters: {
        param: 'value',
      },
    });

    // WHEN
    const result = params.addParameter('param2', 'value2');

    // THEN
    expect(result.parameterAddedResult).toEqual(AddParameterResultStatus.SUCCESS);

    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::ClusterParameterGroup', {
      Description: 'desc',
      ParameterGroupFamily: 'redshift-1.0',
      Parameters: [
        {
          ParameterName: 'param',
          ParameterValue: 'value',
        },
        {
          ParameterName: 'param2',
          ParameterValue: 'value2',
        },
      ],
    });
  });

  test('Adding an existing named parameter with the same value', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const params = new ClusterParameterGroup(stack, 'Params', {
      description: 'desc',
      parameters: {
        param: 'value',
      },
    });

    // WHEN
    const result = params.addParameter('param', 'value');

    // THEN
    expect(result.parameterAddedResult).toEqual(AddParameterResultStatus.SAME_VALUE_FAILURE);

    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::ClusterParameterGroup', {
      Description: 'desc',
      ParameterGroupFamily: 'redshift-1.0',
      Parameters: [
        {
          ParameterName: 'param',
          ParameterValue: 'value',
        },
      ],
    });
  });

  test('Adding an existing named parameter with a different value', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const params = new ClusterParameterGroup(stack, 'Params', {
      description: 'desc',
      parameters: {
        param: 'value',
      },
    });

    // WHEN
    const result = params.addParameter('param', 'value2');

    // THEN
    expect(result.parameterAddedResult).toEqual(AddParameterResultStatus.CONFLICTING_VALUE_FAILURE);

    Template.fromStack(stack).hasResourceProperties('AWS::Redshift::ClusterParameterGroup', {
      Description: 'desc',
      ParameterGroupFamily: 'redshift-1.0',
      Parameters: [
        {
          ParameterName: 'param',
          ParameterValue: 'value',
        },
      ],
    });
  });

  test('Adding a parameter to an IClusterParameterGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const params = ClusterParameterGroup.fromClusterParameterGroupName(stack, 'Params', 'foo');

    // WHEN
    const result = params.addParameter('param', 'value');

    // THEN
    expect(result.parameterAddedResult).toEqual(AddParameterResultStatus.I_FAILURE);
  });
});