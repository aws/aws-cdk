import { countResources, expect, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { DatabaseClusterEngine, ParameterGroup } from '../lib';

nodeunitShim({
  "does not create a parameter group if it wasn't bound to a cluster or instance"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'desc',
      parameters: {
        key: 'value',
      },
    });

    // THEN
    expect(stack).to(countResources('AWS::RDS::DBParameterGroup', 0));
    expect(stack).to(countResources('AWS::RDS::DBClusterParameterGroup', 0));

    test.done();
  },

  'create a parameter group when bound to an instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parameterGroup = new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'desc',
      parameters: {
        key: 'value',
      },
    });
    parameterGroup.bindToInstance({});

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBParameterGroup', {
      Description: 'desc',
      Family: 'aurora5.6',
      Parameters: {
        key: 'value',
      },
    }));

    test.done();
  },

  'create a parameter group when bound to a cluster'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parameterGroup = new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'desc',
      parameters: {
        key: 'value',
      },
    });
    parameterGroup.bindToCluster({});

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBClusterParameterGroup', {
      Description: 'desc',
      Family: 'aurora5.6',
      Parameters: {
        key: 'value',
      },
    }));

    test.done();
  },

  'creates 2 parameter groups when bound to a cluster and an instance'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const parameterGroup = new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'desc',
      parameters: {
        key: 'value',
      },
    });
    parameterGroup.bindToCluster({});
    parameterGroup.bindToInstance({});

    // THEN
    expect(stack).to(countResources('AWS::RDS::DBParameterGroup', 1));
    expect(stack).to(countResources('AWS::RDS::DBClusterParameterGroup', 1));

    test.done();
  },

  'Add an additional parameter to an existing parameter group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const clusterParameterGroup = new ParameterGroup(stack, 'Params', {
      engine: DatabaseClusterEngine.AURORA,
      description: 'desc',
      parameters: {
        key1: 'value1',
      },
    });
    clusterParameterGroup.bindToCluster({});

    clusterParameterGroup.addParameter('key2', 'value2');

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBClusterParameterGroup', {
      Description: 'desc',
      Family: 'aurora5.6',
      Parameters: {
        key1: 'value1',
        key2: 'value2',
      },
    }));

    test.done();
  },
});
