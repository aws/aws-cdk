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
        virtualServiceName: 'target.local',
      });

      // Add an HTTP Route
      virtualGateway.addGatewayRoute('gateway-http-route', {
        routeSpec: appmesh.GatewayRouteSpec.httpRouteSpec({
          routeTarget: virtualService,
        }),
        gatewayRouteName: 'gateway-http-route',
      });

      virtualGateway.addGatewayRoute('gateway-http2-route', {
        routeSpec: appmesh.GatewayRouteSpec.http2RouteSpec({
          routeTarget: virtualService,
        }),
        gatewayRouteName: 'gateway-http2-route',
      });

      virtualGateway.addGatewayRoute('gateway-grpc-route', {
        routeSpec: appmesh.GatewayRouteSpec.grpcRouteSpec({
          routeTarget: virtualService,
          match: {
            serviceName: virtualService.virtualServiceName,
          },
        }),
        gatewayRouteName: 'gateway-grpc-route',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-http-route',
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
      }));
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-http2-route',
        Spec: {
          Http2Route: {
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
      }));
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-grpc-route',
        Spec: {
          GrpcRoute: {
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
              ServiceName: {
                'Fn::GetAtt': ['vs1732C2645', 'VirtualServiceName'],
              },
            },
          },
        },
      }));
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
      /Prefix Path must start with \'\/\', got: wrong/);
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
    const gatewayRoute2 = appmesh.GatewayRoute.fromGatewayRouteArn(
      stack, 'importedGatewayRoute2', 'arn:aws:appmesh:us-east-1:123456789012:mesh/test-mesh/virtualGateway/test-gateway/gatewayRoute/test-gateway-route');
    // THEN
    test.equal(gatewayRoute2.gatewayRouteName, 'test-gateway-route');
    test.equal(gatewayRoute2.virtualGateway.virtualGatewayName, 'test-gateway');
    test.equal(gatewayRoute2.virtualGateway.mesh.meshName, 'test-mesh');
    test.done();
  },
};