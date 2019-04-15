import cdk = require('@aws-cdk/cdk');
import * as appmesh from '../lib/';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'mesh-stack');

const mesh = new appmesh.Mesh(stack, 'mesh');
const router = mesh.addVirtualRouter('router', {
  portMappings: [
    {
      port: 8080,
      protocol: appmesh.Protocol.HTTP,
    },
  ],
});

mesh.addVirtualService('service', {
  virtualRouterName: router.virtualRouterName,
  virtualServiceName: `service1.domain.local`,
});

const node = mesh.addVirtualNode('node', {
  hostname: 'node1',
  namespaceName: 'domain.local',
  listeners: {
    portMappings: [
      {
        port: 8080,
        protocol: appmesh.Protocol.HTTP,
      },
    ],
    healthChecks: [
      {
        healthyThreshold: 3,
        interval: 5000,
        path: '/check-path',
        port: 8080,
        protocol: appmesh.Protocol.HTTP,
        timeout: 2000,
        unhealthyThreshold: 2,
      },
    ],
  },
  backends: [
    {
      virtualServiceName: `service2.domain.local`,
    },
  ],
});

node.addBackend({
  virtualServiceName: `service3.domain.local`,
});

router.addRoute('route-1', {
  routeTargets: [
    {
      virtualNodeName: node.virtualNodeName,
      weight: 50,
    },
  ],
  prefix: '/',
  isHttpRoute: true,
});

router.addRoutes(
  ['route-2', 'route-3'],
  [
    {
      routeTargets: [
        {
          virtualNodeName: 'test-node2',
          weight: 30,
        },
      ],
      prefix: '/path2',
      isHttpRoute: true,
    },
    {
      routeTargets: [
        {
          virtualNodeName: 'test-node3',
          weight: 20,
        },
      ],
    },
  ]
);
