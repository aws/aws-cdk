import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
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
  },

  'import/export parameter group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const group = new ParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'desc',
      parameters: {
        key: 'value'
      }
    });

    // WHEN
    const exported = group.export();
    const imported = ClusterParameterGroup.import(stack, 'ImportParams', exported);

    // THEN
    test.deepEqual(stack.node.resolve(exported), { parameterGroupName: { 'Fn::ImportValue': 'Stack:ParamsParameterGroupNameA6B808D7' } });
    test.deepEqual(stack.node.resolve(imported.parameterGroupName), { 'Fn::ImportValue': 'Stack:ParamsParameterGroupNameA6B808D7' });
    test.done();
  },

  'import/export cluster parameter group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const group = new ClusterParameterGroup(stack, 'Params', {
      family: 'hello',
      description: 'desc',
      parameters: {
        key: 'value'
      }
    });

    // WHEN
    const exported = group.export();
    const imported = ClusterParameterGroup.import(stack, 'ImportParams', exported);

    // THEN
    test.deepEqual(stack.node.resolve(exported), { parameterGroupName: { 'Fn::ImportValue': 'Stack:ParamsParameterGroupNameA6B808D7' } });
    test.deepEqual(stack.node.resolve(imported.parameterGroupName), { 'Fn::ImportValue': 'Stack:ParamsParameterGroupNameA6B808D7' });
    test.done();
  }
};
