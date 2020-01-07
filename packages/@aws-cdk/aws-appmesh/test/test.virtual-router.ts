import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When adding route to existing VirtualRouter': {
    'should create route resource'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router');

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
        backends: [service1],
      });

      router.addRoute('route-1', {
        routeTargets: [
          {
            virtualNode: node,
            weight: 50,
          },
        ],
        prefix: '/',
      });

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::Route', {
          RouteName: 'route-1',
          Spec: {
            HttpRoute: {
              Action: {
                WeightedTargets: [
                  {
                    VirtualNode: {
                      'Fn::GetAtt': ['meshtestnodeF93946D4', 'VirtualNodeName'],
                    },
                    Weight: 50,
                  },
                ],
              },
              Match: {
                Prefix: '/',
              },
            },
          },
          VirtualRouterName: {
            'Fn::GetAtt': ['meshrouter81B8087E', 'VirtualRouterName'],
          },
        })
      );

      test.done();
    },
  },
  'When adding routes to a VirtualRouter with existing routes': {
    'should add routes and not overwrite'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router');

      const service1 = new appmesh.VirtualService(stack, 'service-1', {
        virtualServiceName: 'service1.domain.local',
        mesh,
      });
      const service2 = new appmesh.VirtualService(stack, 'service-2', {
        virtualServiceName: 'service2.domain.local',
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
      const node2 = mesh.addVirtualNode('test-node2', {
        dnsHostName: 'test',
        listener: {
          portMapping:
            {
              port: 8080,
              protocol: appmesh.Protocol.HTTP,
            },
        },
        backends: [
            service2,
        ],
      });
      const node3 = mesh.addVirtualNode('test-node3', {
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

      router.addRoute('route-1', {
        routeTargets: [
          {
            virtualNode: node,
            weight: 50,
          },
        ],
        prefix: '/',
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
        prefix: '/path3',
      });

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::Route', {
          RouteName: 'route-1',
          Spec: {
            HttpRoute: {
              Action: {
                WeightedTargets: [
                  {
                    VirtualNode: {
                      'Fn::GetAtt': ['meshtestnodeF93946D4', 'VirtualNodeName'],
                    },
                    Weight: 50,
                  },
                ],
              },
              Match: {
                Prefix: '/',
              },
            },
          },
        })
      );
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::Route', {
          RouteName: 'route-2',
          Spec: {
            HttpRoute: {
              Action: {
                WeightedTargets: [
                  {
                    VirtualNode: {
                      'Fn::GetAtt': ['meshtestnode20C58B1B2', 'VirtualNodeName'],
                    },
                    Weight: 30,
                  },
                ],
              },
              Match: {
                Prefix: '/path2',
              },
            },
          },
        })
      );
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::Route', {
          RouteName: 'route-3',
          Spec: {
            HttpRoute: {
              Action: {
                WeightedTargets: [
                  {
                    VirtualNode: {
                      'Fn::GetAtt': ['meshtestnode316EEA2D7', 'VirtualNodeName'],
                    },
                    Weight: 20,
                  },
                ],
              },
              Match: {
                Prefix: '/path3',
              },
            },
          },
        })
      );

      test.done();
    },
  },
  'When adding a TCP route to existing VirtualRouter': {
    'should create route resource'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router');

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

      router.addRoute('route-tcp-1', {
        routeTargets: [
          {
            virtualNode: node,
            weight: 50,
          },
        ],
      });

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::Route', {
          RouteName: 'route-tcp-1',
          Spec: {
            TcpRoute: {
              Action: {
                WeightedTargets: [
                  {
                    VirtualNode: {
                      'Fn::GetAtt': ['meshtestnodeF93946D4', 'VirtualNodeName'],
                    },
                    Weight: 50,
                  },
                ],
              },
            },
          },
          VirtualRouterName: {
            'Fn::GetAtt': ['meshrouter81B8087E', 'VirtualRouterName'],
          },
        })
      );

      test.done();
    },
  },

  'can import a virtual router'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const vr = appmesh.VirtualRouter.fromVirtualRouterName(stack, 'Router', 'MyMesh', 'MyRouter');

    // THEN
    test.ok(vr.mesh !== undefined);

    test.done();
  },
};
