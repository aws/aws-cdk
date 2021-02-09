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
      healthCheck: { interval: cdk.Duration.millis(millis) },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /below the minimum threshold/);
    test.throws(() => toThrow(max + 1), /above the maximum threshold/);

    test.done();
  },
  'timeout'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2000, 60000];

    // WHEN
    const toThrow = (millis: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http2({
      healthCheck: { timeout: cdk.Duration.millis(millis) },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /below the minimum threshold/);
    test.throws(() => toThrow(max + 1), /above the maximum threshold/);

    test.done();
  },
  'port'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [1, 65535];

    // WHEN
    const toThrow = (port: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: { port },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(max + 1), /above the maximum threshold/);

    test.done();
  },
  'healthyThreshold'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2, 10];

    // WHEN
    const toThrow = (healthyThreshold: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: { healthyThreshold },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /below the minimum threshold/);
    test.throws(() => toThrow(max + 1), /above the maximum threshold/);

    test.done();
  },
  'unhealthyThreshold'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2, 10];

    // WHEN
    const toThrow = (unhealthyThreshold: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: { unhealthyThreshold },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(min));
    test.doesNotThrow(() => toThrow(max));
    test.throws(() => toThrow(min - 1), /below the minimum threshold/);
    test.throws(() => toThrow(max + 1), /above the maximum threshold/);

    test.done();
  },
  'throws if path and Protocol.TCP'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = (protocol: appmesh.Protocol) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: {
        protocol,
        path: '/',
      },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(appmesh.Protocol.HTTP));
    test.throws(() => toThrow(appmesh.Protocol.TCP), /The path property cannot be set with Protocol.TCP/);

    test.done();
  },

  'throws if path and Protocol.GRPC'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = (protocol: appmesh.Protocol) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: {
        protocol,
        path: '/',
      },
    }));

    // THEN
    test.doesNotThrow(() => toThrow(appmesh.Protocol.HTTP));
    test.throws(() => toThrow(appmesh.Protocol.GRPC), /The path property cannot be set with Protocol.GRPC/);

    test.done();
  },

};