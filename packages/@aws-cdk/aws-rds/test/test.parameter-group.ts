import { expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ClusterParameterGroup, ParameterGroup } from '../lib';

export = {
  'create a parameter group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'desc',
      parameters: {
        key: 'value'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBParameterGroup', {
      Description: 'desc',
      Family: 'hello',
      Parameters: {
        key: 'value'
      }
    }));

    test.done();
  },

  'create a cluster parameter group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ClusterParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'desc',
      parameters: {
        key: 'value'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBClusterParameterGroup', {
      Description: 'desc',
      Family: 'hello',
      Parameters: {
        key: 'value'
      }
    }));

    test.done();
  }
};
