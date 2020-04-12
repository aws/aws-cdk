import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { ClusterParameterGroup } from '../lib';

test('create a cluster parameter group', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new ClusterParameterGroup(stack, 'Params', {
    family: 'hello',
    description: 'desc',
    parameters: [
      { parameterName: 'param', parameterValue: 'value' }
    ]
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::Redshift::ClusterParameterGroup', {
    Description: 'desc',
    ParameterGroupFamily: 'hello',
    Parameters: [
      {
        ParameterName: 'param',
        ParameterValue: 'value'
      }
    ]
  }));

});