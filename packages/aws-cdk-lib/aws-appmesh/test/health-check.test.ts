import * as cdk from '../../core';
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

describe('health check', () => {
  test('interval', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [5000, 300000];

    // WHEN
    const toThrow = (millis: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http2({
      healthCheck: appmesh.HealthCheck.http2({ interval: cdk.Duration.millis(millis) }),
    }));

    // THEN
    expect(() => toThrow(min)).not.toThrow();
    expect(() => toThrow(max)).not.toThrow();
    expect(() => toThrow(min - 1)).toThrow(/interval must be between 5 seconds and 300 seconds/);
    expect(() => toThrow(max + 1)).toThrow(/interval must be between 5 seconds and 300 seconds/);
  });
  test('timeout', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2000, 60000];

    // WHEN
    const toThrow = (millis: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http2({
      healthCheck: appmesh.HealthCheck.http2({ timeout: cdk.Duration.millis(millis) }),
    }));

    // THEN
    expect(() => toThrow(min)).not.toThrow();
    expect(() => toThrow(max)).not.toThrow();
    expect(() => toThrow(min - 1)).toThrow(/timeout must be between 2 seconds and 60 seconds/);
    expect(() => toThrow(max + 1)).toThrow(/timeout must be between 2 seconds and 60 seconds/);
  });
  test('healthyThreshold', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2, 10];

    // WHEN
    const toThrow = (healthyThreshold: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: appmesh.HealthCheck.http({ healthyThreshold }),
    }));

    // THEN
    expect(() => toThrow(min)).not.toThrow();
    expect(() => toThrow(max)).not.toThrow();
    expect(() => toThrow(min - 1)).toThrow(/healthyThreshold must be between 2 and 10/);
    expect(() => toThrow(max + 1)).toThrow(/healthyThreshold must be between 2 and 10/);
  });
  test('unhealthyThreshold', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const [min, max] = [2, 10];

    // WHEN
    const toThrow = (unhealthyThreshold: number) => getNode(stack).addListener(appmesh.VirtualNodeListener.http({
      healthCheck: appmesh.HealthCheck.http({ unhealthyThreshold }),
    }));

    // THEN
    expect(() => toThrow(min)).not.toThrow();
    expect(() => toThrow(max)).not.toThrow();
    expect(() => toThrow(min - 1)).toThrow(/unhealthyThreshold must be between 2 and 10/);
    expect(() => toThrow(max + 1)).toThrow(/unhealthyThreshold must be between 2 and 10/);
  });
});
