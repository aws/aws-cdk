import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { ClusterParameterGroup } from '../lib';

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
    params.addParameter('param2', 'value2');

    // THEN
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
    params.addParameter('param', 'value');

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
    expect(() => params.addParameter('param', 'value2'))
      // THEN
      .toThrowError('The parameter group already contains the parameter');
  });
});