import ec2 = require('@aws-cdk/aws-ec2');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/core');

import * as appmesh from '../lib/';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'mesh-stack', {});

const vpc = new ec2.Vpc(stack, 'vpc', {
  natGateways: 1,
});

const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
  vpc,
  name: 'domain.local',
});

const mesh = new appmesh.Mesh(stack, 'mesh');
const router = mesh.addVirtualRouter('router', {
  listener: {
    portMapping: {
      port: 8080,
      protocol: appmesh.Protocol.HTTP,
    },
  },
});

const virtualService = mesh.addVirtualService('service', {
  virtualRouter: router,
  virtualServiceName: `service1.domain.local`,
});

const node = mesh.addVirtualNode('node', {
  dnsHostName: `node1.${namespace.namespaceName}`,
  listener: {
    healthCheck: {
      healthyThreshold: 3,
      path: '/check-path',
    },
  },
  backends: [
    virtualService,
  ],
});

node.addBackends(new appmesh.VirtualService(stack, 'service-2', {
    virtualServiceName: 'service2.domain.local',
    mesh,
  }),
);

router.addRoute('route-1', {
  routeTargets: [
    {
      virtualNode: node,
      weight: 50,
    },
  ],
  prefix: '/',
});

const node2 = mesh.addVirtualNode('node2', {
  dnsHostName: `node2.${namespace.namespaceName}`,
  listener: {
    healthCheck: {
      healthyThreshold: 3,
      interval: cdk.Duration.seconds(5),
      path: '/check-path2',
      port: 8080,
      protocol: appmesh.Protocol.HTTP,
      timeout: cdk.Duration.seconds(2),
      unhealthyThreshold: 2,
    },
  },
  backends: [
    new appmesh.VirtualService(stack, 'service-3', {
      virtualServiceName: 'service3.domain.local',
      mesh,
    }),
  ],
});

const node3 = mesh.addVirtualNode('node3', {
  dnsHostName: `node3.${namespace.namespaceName}`,
  listener: {
    healthCheck: {
      healthyThreshold: 3,
      interval: cdk.Duration.seconds(5),
      path: '/check-path3',
      port: 8080,
      protocol: appmesh.Protocol.HTTP,
      timeout: cdk.Duration.seconds(2),
      unhealthyThreshold: 2,
    },
  },
});

router.addRoute('route-2', {
  routeTargets: [
    {
      virtualNode: node2,
      weight: 30,
    },
  ],
  prefix: '/path2',
});

router.addRoute('route-3', {
  routeTargets: [
    {
      virtualNode: node3,
      weight: 20,
    },
  ],
});
