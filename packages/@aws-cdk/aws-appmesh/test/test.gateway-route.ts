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
    'should be able to add multiple routes'(test: Test) {
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
      const virtualService2 = new appmesh.VirtualService(stack, 'vs-2', {
        mesh: mesh,
      });

      virtualGateway.addGatewayRoutes([
        {
          id: 'gateway-route',
          props: {
            routeSpec: appmesh.GatewayRouteSpec.httpRouteSpec({
              routeTarget: virtualService,
            }),
            gatewayRouteName: 'gateway-route',
          },
        },
        {
          id: 'gateway-route2',
          props: {
            routeSpec: appmesh.GatewayRouteSpec.httpRouteSpec({
              routeTarget: virtualService2,
              match: {
                prefixPath: '/echo',
              },
            }),
            gatewayRouteName: 'gateway-route2',
          },
        },
      ]);

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

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-route2',
          Spec: {
            HttpRoute: {
              Action: {
                Target: {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['vs2BB8859F6', 'VirtualServiceName'],
                    },
                  },
                },
              },
              Match: {
                Prefix: '/echo',
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

    const meshName = 'test-mesh';
    const mesh = appmesh.Mesh.fromMeshName(stack, 'mesh', meshName);
    const virtualGatewayName = 'test-gateway';
    const virtualGateway = appmesh.VirtualGateway.fromVirtualGatewayAttributes(stack, 'virtualGateway', { mesh, virtualGatewayName });
    // WHEN
    const gatewayRouteName = 'test-gateway-route';
    const gatewayRoute = appmesh.GatewayRoute.fromGatewayRouteAttributes(stack, 'importedGatewayRoute', { virtualGateway, gatewayRouteName });
    // THEN
    test.equal(gatewayRoute.gatewayRouteName, gatewayRouteName);
    test.equal(gatewayRoute.virtualGateway.virtualGatewayName, virtualGatewayName);
    test.equal(gatewayRoute.virtualGateway.mesh.meshName, meshName);
    const gatewayRoute2 = appmesh.GatewayRoute.fromGatewayRouteArn(
      stack, 'importedGatewayRoute2', `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualGateway/${virtualGatewayName}/gatewayRoute/${gatewayRouteName}`);
    test.equal(gatewayRoute2.gatewayRouteName, gatewayRouteName);
    test.equal(gatewayRoute2.virtualGateway.virtualGatewayName, virtualGatewayName);
    test.equal(gatewayRoute2.virtualGateway.mesh.meshName, meshName);
    test.done();
  },
};