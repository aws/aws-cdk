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
        listener: {
          portMapping:
            {
              port: 8080,
              protocol: appmesh.Protocol.HTTP,
            },
        },
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
        listener: {
          portMapping:
            {
              port: 8080,
              protocol: appmesh.Protocol.HTTP,
            },
        },
      });

      router.addRoute('test-http-route', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
          priority: 1,
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
          Priority: 1,
        },
        RouteName: 'test-http-route',
      }));
      test.done();
    },
  },

  'Can export existing route and re-import'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    const router = new appmesh.VirtualRouter(stack, 'router', {
      mesh,
    });

    const service1 = new appmesh.VirtualService(stack, 'service-1', {
      virtualServiceName: 'service1.domain.local',
      mesh,
    });

    const node = mesh.addVirtualNode('test-node', {
      dnsHostName: 'test',
      listener: {
        portMapping:
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
      },
      backends: [
        service1,
      ],
    });

    const route = new appmesh.Route(stack, 'route-1', {
      mesh,
      virtualRouter: router,
      routeSpec: appmesh.RouteSpec.http({
        weightedTargets: [
          {
            virtualNode: node,
            weight: 50,
          },
        ],
        match: {
          prefixPath: '/',
        },
      }),
    });

    const stack2 = new cdk.Stack();
    appmesh.Route.fromRouteName(stack2, 'imported-route', mesh.meshName, router.virtualRouterName, route.routeName);

    // Nothing to do with imported route yet

    test.done();
  },
};
