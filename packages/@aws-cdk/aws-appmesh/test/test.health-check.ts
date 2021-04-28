import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

let idCounter = 0;
const getNode = (stack: cdk.Stack) => {
  const mesh = new appmesh.Mesh(stack, `mesh-${++idCounter}`, {
    meshName: 'test-mesh',
  });
  return mesh.addVirtualNode(`virtual-node-${idCounter}`, {
    serviceDiscovery: appmesh.ServiceDiscovery.dns('test-node'),
  });
};

export = {
  'interval'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [5000, 300000];

    // WHEN
    const toThrow = (millis: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http2({
      healthCheck: appmesh.HealthCheck.http2({ interval: cdk.Duration.millis(millis) }),
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /interval must be more than 5 seconds and less than 300 seconds/);
    test.throws(() => toThrow(max + 1), /interval must be more than 5 seconds and less than 300 seconds/);

    test.done();
  },
  'timeout'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2000, 60000];

    // WHEN
    const toThrow = (millis: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http2({
      healthCheck: appmesh.HealthCheck.http2({ timeout: cdk.Duration.millis(millis) }),
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /timeout must be more than 2 seconds and less than 60 seconds/);
    test.throws(() => toThrow(max + 1), /timeout must be more than 2 seconds and less than 60 seconds/);

    test.done();
  },
  'healthyThreshold'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2, 10];

    // WHEN
    const toThrow = (healthyThreshold: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: appmesh.HealthCheck.http({ healthyThreshold }),
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /healthyThreshold must be between 2 and 10/);
    test.throws(() => toThrow(max + 1), /healthyThreshold must be between 2 and 10/);

    test.done();
  },
  'unhealthyThreshold'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2, 10];

    // WHEN
    const toThrow = (unhealthyThreshold: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: appmesh.HealthCheck.http({ unhealthyThreshold }),
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /unhealthyThreshold must be between 2 and 10/);
    test.throws(() => toThrow(max + 1), /unhealthyThreshold must be between 2 and 10/);

    test.done();
  },
};