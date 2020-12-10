import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When creating new routes': {
    'route has expected defaults'(test:Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });

      // WHEN
      const node = mesh.addVirtualNode('test-node', {
        dnsHostName: 'test',
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      router.addRoute('test-http-route', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
        }),
      });

      router.addRoute('test-http2-route', {
        routeSpec: appmesh.RouteSpec.http2({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
        }),
      });

      router.addRoute('test-tcp-route', {
        routeSpec: appmesh.RouteSpec.tcp({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
        }),
      });

      router.addRoute('test-grpc-route', {
        routeSpec: appmesh.RouteSpec.grpc({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
          match: {
            serviceName: 'test.svc.local',
          },
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            Action: {
              WeightedTargets: [
                {
                  VirtualNode: {
                    'Fn::GetAtt': [
                      'meshtestnodeF93946D4',
                      'VirtualNodeName',
                    ],
                  },
                  Weight: 1,
                },
              ],
            },
            Match: {
              Prefix: '/',
            },
          },
        },
        RouteName: 'test-http-route',
      }));

      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          Http2Route: {
            Action: {
              WeightedTargets: [
                {
                  VirtualNode: {
                    'Fn::GetAtt': [
                      'meshtestnodeF93946D4',
                      'VirtualNodeName',
                    ],
                  },
                  Weight: 1,
                },
              ],
            },
            Match: {
              Prefix: '/',
            },
          },
        },
        RouteName: 'test-http2-route',
      }));

      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          TcpRoute: {
            Action: {
              WeightedTargets: [
                {
                  VirtualNode: {
                    'Fn::GetAtt': [
                      'meshtestnodeF93946D4',
                      'VirtualNodeName',
                    ],
                  },
                  Weight: 1,
                },
              ],
            },
          },
        },
        RouteName: 'test-tcp-route',
      }));

      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          GrpcRoute: {
            Action: {
              WeightedTargets: [
                {
                  VirtualNode: {
                    'Fn::GetAtt': [
                      'meshtestnodeF93946D4',
                      'VirtualNodeName',
                    ],
                  },
                  Weight: 1,
                },
              ],
            },
            Match: {
              ServiceName: 'test.svc.local',
            },
          },
        },
        RouteName: 'test-grpc-route',
      }));

      test.done();
    },

    'should have expected features'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });

      // WHEN
      const node = mesh.addVirtualNode('test-node', {
        dnsHostName: 'test',
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      router.addRoute('test-http-route', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
          match: {
            prefixPath: '/node',
          },
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            Action: {
              WeightedTargets: [
                {
                  VirtualNode: {
                    'Fn::GetAtt': [
                      'meshtestnodeF93946D4',
                      'VirtualNodeName',
                    ],
                  },
                  Weight: 1,
                },
              ],
            },
            Match: {
              Prefix: '/node',
            },
          },
        },
        RouteName: 'test-http-route',
      }));
      test.done();
    },
  },

  'Can import Routes using an ARN'(test: Test) {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'test-mesh';
    const virtualRouterName = 'test-virtual-router';
    const routeName = 'test-route';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualRouter/${virtualRouterName}/gatewayRoute/${routeName}`;

    // WHEN
    const route = appmesh.Route.fromRouteArn(stack, 'importedRoute', arn);
    // THEN
    test.equal(route.routeName, routeName);
    test.equal(route.virtualRouter.virtualRouterName, virtualRouterName);
    test.equal(route.virtualRouter.mesh.meshName, meshName);
    test.done();
  },

  'Can import Routes using ARN and attributes'(test: Test) {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'test-mesh';
    const virtualRouterName = 'test-virtual-router';
    const routeName = 'test-route';

    // WHEN
    const mesh = appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName);
    const virtualRouter = mesh.addVirtualRouter('VirtualGateway', {
      virtualRouterName: virtualRouterName,
    });
    const route = appmesh.Route.fromRouteAttributes(stack, 'importedRoute', { routeName, virtualRouter });
    // THEN
    test.equal(route.routeName, routeName);
    test.equal(route.virtualRouter.mesh.meshName, meshName);

    test.done();
  },
};
