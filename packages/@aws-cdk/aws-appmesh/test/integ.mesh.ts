import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';

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
  listeners: [
    appmesh.VirtualRouterListener.http(),
  ],
});

const virtualService = mesh.addVirtualService('service', {
  virtualRouter: router,
  virtualServiceName: 'service1.domain.local',
});

const node = mesh.addVirtualNode('node', {
  dnsHostName: `node1.${namespace.namespaceName}`,
  listeners: [appmesh.VirtualNodeListener.http({
    healthCheck: {
      healthyThreshold: 3,
      path: '/check-path',
    },
  })],
  backends: [
    virtualService,
  ],
});

node.addBackend(new appmesh.VirtualService(stack, 'service-2', {
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
  listeners: [appmesh.VirtualNodeListener.http({
    healthCheck: {
      healthyThreshold: 3,
      interval: cdk.Duration.seconds(5),
      path: '/check-path2',
      port: 8080,
      protocol: appmesh.Protocol.HTTP,
      timeout: cdk.Duration.seconds(2),
      unhealthyThreshold: 2,
    },
  })],
  backends: [
    new appmesh.VirtualService(stack, 'service-3', {
      virtualServiceName: 'service3.domain.local',
      mesh,
    }),
  ],
});

const node3 = mesh.addVirtualNode('node3', {
  dnsHostName: `node3.${namespace.namespaceName}`,
  listeners: [appmesh.VirtualNodeListener.http({
    healthCheck: {
      healthyThreshold: 3,
      interval: cdk.Duration.seconds(5),
      path: '/check-path3',
      port: 8080,
      protocol: appmesh.Protocol.HTTP,
      timeout: cdk.Duration.seconds(2),
      unhealthyThreshold: 2,
    },
  })],
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
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

const gateway = mesh.addVirtualGateway('gateway1', {
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'gateway1',
});

new appmesh.VirtualGateway(stack, 'gateway2', {
  mesh: mesh,
  listeners: [appmesh.VirtualGatewayListener.httpGatewayListener({
    port: 443,
    healthCheck: {
      interval: cdk.Duration.seconds(10),
    },
  })],
});

gateway.addGatewayRoute('gateway1-route-http', {
  routeSpec: appmesh.GatewayRouteSpec.httpRouteSpec({
    routeTarget: virtualService,
  }),
});

gateway.addGatewayRoute('gateway1-route-http2', {
  routeSpec: appmesh.GatewayRouteSpec.http2RouteSpec({
    routeTarget: virtualService,
  }),
});

gateway.addGatewayRoute('gateway1-route-grpc', {
  routeSpec: appmesh.GatewayRouteSpec.grpcRouteSpec({
    routeTarget: virtualService,
    match: {
      serviceName: virtualService.virtualServiceName,
    },
  }),
});
