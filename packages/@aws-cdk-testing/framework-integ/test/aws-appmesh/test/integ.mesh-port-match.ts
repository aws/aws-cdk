import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cloudmap from 'aws-cdk-lib/aws-servicediscovery';
import * as cdk from 'aws-cdk-lib';
import * as appmesh from 'aws-cdk-lib/aws-appmesh';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'mesh-stack', {});

new IntegTest(app, 'appmesh-routes-port-matchers', {
  testCases: [stack],
});

const vpc = new ec2.Vpc(stack, 'vpc', {
  restrictDefaultSecurityGroup: false,
  natGateways: 1,
});

const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
  vpc,
  name: 'domain.local',
});

const mesh = new appmesh.Mesh(stack, 'mesh');

const httpRouter = mesh.addVirtualRouter('http-router', {
  listeners: [
    appmesh.VirtualRouterListener.http(1233),
  ],
});

const grpcRouter = mesh.addVirtualRouter('grpc-router', {
  listeners: [
    appmesh.VirtualRouterListener.grpc(1234),
  ],
});

const httpNode = mesh.addVirtualNode('http-node', {
  serviceDiscovery: appmesh.ServiceDiscovery.dns(`node.${namespace.namespaceName}`, appmesh.DnsResponseType.ENDPOINTS),
  listeners: [
    appmesh.VirtualNodeListener.http({
      port: 1233,
    }),
  ],
});

const grpcNode = mesh.addVirtualNode('grpc-node', {
  serviceDiscovery: appmesh.ServiceDiscovery.dns(`node.${namespace.namespaceName}`, appmesh.DnsResponseType.ENDPOINTS),
  listeners: [
    appmesh.VirtualNodeListener.grpc({
      port: 1234,
    }),
  ],
});

httpRouter.addRoute('http-route', {
  routeSpec: appmesh.RouteSpec.http({
    weightedTargets: [{ virtualNode: httpNode }],
    match: {
      port: 1233,
    },
  }),
});

grpcRouter.addRoute('grpc-route', {
  routeSpec: appmesh.RouteSpec.grpc({
    weightedTargets: [{ virtualNode: grpcNode, port: 1234 }],
    match: {
      port: 1234,
    },
  }),
});

const httpVirtualService = new appmesh.VirtualService(stack, 'http-service', {
  virtualServiceProvider: appmesh.VirtualServiceProvider.virtualRouter(httpRouter),
  virtualServiceName: 'service1.domain.local',
});

const grpcVirtualService = new appmesh.VirtualService(stack, 'grpc-service', {
  virtualServiceProvider: appmesh.VirtualServiceProvider.virtualRouter(grpcRouter),
  virtualServiceName: 'service2.domain.local',
});

const gateway = mesh.addVirtualGateway('gateway', {
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'gateway',
  listeners: [
    appmesh.VirtualGatewayListener.http({
      port: 1233,
    }),
  ],
});

gateway.addGatewayRoute('gateway-route-http', {
  routeSpec: appmesh.GatewayRouteSpec.http({
    routeTarget: httpVirtualService,
    match: {
      port: 1233,
    },
  }),
});

const gateway2 = mesh.addVirtualGateway('gateway2', {
  accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
  virtualGatewayName: 'gateway2',
  listeners: [
    appmesh.VirtualGatewayListener.grpc({
      port: 1234,
    }),
  ],
});

gateway2.addGatewayRoute('gateway2-route-grpc', {
  routeSpec: appmesh.GatewayRouteSpec.grpc({
    routeTarget: grpcVirtualService,
    match: {
      port: 1234,
    },
  }),
});
