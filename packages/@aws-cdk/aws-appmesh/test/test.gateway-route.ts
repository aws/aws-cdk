import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When creating a GatewayRoute': {
    'should have expected defaults'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
        listeners: [appmesh.VirtualGatewayListener.httpGatewayListener()],
        mesh: mesh,
      });

      const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
        mesh: mesh,
      });

      // Add an HTTP Route
      virtualGateway.addGatewayRoute('gateway-route', {
        routeSpec: appmesh.GatewayRouteSpec.httpRouteSpec({
          routeTarget: virtualService,
        }),
        gatewayRouteName: 'gateway-route',
      });

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-route',
          Spec: {
            HttpRoute: {
              Action: {
                Target: {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['vs1732C2645', 'VirtualServiceName'],
                    },
                  },
                },
              },
              Match: {
                Prefix: '/',
              },
            },
          },
        }),
      );
      test.done();
    },
    'should throw an exception if you start an http prefix match not with a /'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualService = mesh.addVirtualService('testVirtualService');
      test.throws(() => appmesh.GatewayRouteSpec.httpRouteSpec({
        routeTarget: virtualService,
        match: {
          prefixPath: 'wrong',
        },
      }).bind(stack),
      /Prefix Path must start with \'\/\'/);
      test.done();
    },
  },
  'Can export and import GatewayRoutes and perform actions'(test: Test) {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });

    // WHEN
    const gatewayRoute = appmesh.GatewayRoute.fromGatewayRouteName(stack, 'importedGatewayRoute', 'test-mesh', 'test-gateway', 'test-gateway-route');
    // THEN
    test.equal(gatewayRoute.gatewayRouteName, 'test-gateway-route');
    test.equal(gatewayRoute.virtualGateway.virtualGatewayName, 'test-gateway');
    test.equal(gatewayRoute.virtualGateway.mesh.meshName, 'test-mesh');
    const gatewayRoute2 = appmesh.GatewayRoute.fromGatewayRouteArn(
      stack, 'importedGatewayRoute2', 'arn:aws:appmesh:us-east-1:123456789012:mesh/test-mesh/virtualGateway/test-gateway/gatewayRoute/test-gateway-route');
    test.equal(gatewayRoute2.gatewayRouteName, 'test-gateway-route');
    test.equal(gatewayRoute2.virtualGateway.virtualGatewayName, 'test-gateway');
    test.equal(gatewayRoute2.virtualGateway.mesh.meshName, 'test-mesh');
    test.done();
  },
};