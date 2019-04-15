import { expect, haveResourceLike } from '@aws-cdk/assert';
import { Test } from 'nodeunit';
import cdk = require('@aws-cdk/cdk');
import appmesh = require('../lib');

export = {
  'When adding route to existing VirtualRouter': {
    'should create route resource'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router', {
        portMappings: [
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
        ],
      });

      router.addRoute('route-1', {
        routeTargets: [
          {
            virtualNodeName: 'test-node',
            weight: 50,
          },
        ],
        prefix: '/',
        isHttpRoute: true,
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
                    VirtualNode: 'test-node',
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

      const router = mesh.addVirtualRouter('router', {
        portMappings: [
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
        ],
      });

      router.addRoute('route-1', {
        routeTargets: [
          {
            virtualNodeName: 'test-node',
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
            prefix: '/path3',
            isHttpRoute: true,
          },
        ]
      );

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::Route', {
          RouteName: 'route-1',
          Spec: {
            HttpRoute: {
              Action: {
                WeightedTargets: [
                  {
                    VirtualNode: 'test-node',
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
                    VirtualNode: 'test-node2',
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
                    VirtualNode: 'test-node3',
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

      const router = mesh.addVirtualRouter('router', {
        portMappings: [
          {
            port: 8080,
            protocol: appmesh.Protocol.TCP,
          },
        ],
      });

      router.addRoute('route-tcp-1', {
        routeTargets: [
          {
            virtualNodeName: 'test-node',
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
                    VirtualNode: 'test-node',
                    Weight: 50,
                  },
                ],
              },
            },
          },
        })
      );

      test.done();
    },
  },
  'When adding multiple routes with empty id array': {
    'should throw error'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router', {
        portMappings: [
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
        ],
      });

      // THEN
      test.throws(() => {
        router.addRoutes(
          [],
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
              prefix: '/path3',
              isHttpRoute: true,
            },
          ]
        );
      });

      test.done();
    },
  },
  'When adding multiple routes with empty route props array': {
    'should throw error'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router', {
        portMappings: [
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
        ],
      });

      // THEN
      test.throws(() => {
        router.addRoutes(['route-1', 'route-2'], []);
      });

      test.done();
    },
  },
  'When adding multiple routes with unequal ids and route properties': {
    'should throw error'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const router = mesh.addVirtualRouter('router', {
        portMappings: [
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
        ],
      });

      // THEN
      test.throws(() => {
        router.addRoutes(
          ['route-1'],
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
              prefix: '/path3',
              isHttpRoute: true,
            },
          ]
        );
      });
      test.throws(() => {
        router.addRoutes(
          ['route-1', 'route-2'],
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
          ]
        );
      });

      test.done();
    },
  },
};
