import { ABSENT, expect, haveResourceLike } from '@aws-cdk/assert';
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
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      router.addRoute('test-http-route', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
          timeout: {
            idle: cdk.Duration.seconds(10),
            perRequest: cdk.Duration.seconds(11),
          },
        }),
      });

      router.addRoute('test-http2-route', {
        routeSpec: appmesh.RouteSpec.http2({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
          timeout: {
            idle: cdk.Duration.seconds(12),
            perRequest: cdk.Duration.seconds(13),
          },
        }),
      });

      router.addRoute('test-tcp-route', {
        routeSpec: appmesh.RouteSpec.tcp({
          weightedTargets: [
            {
              virtualNode: node,
            },
          ],
          timeout: {
            idle: cdk.Duration.seconds(14),
          },
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
          timeout: {
            idle: cdk.Duration.seconds(15),
            perRequest: cdk.Duration.seconds(16),
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
            Timeout: {
              Idle: {
                Value: 10000,
                Unit: 'ms',
              },
              PerRequest: {
                Value: 11000,
                Unit: 'ms',
              },
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
            Timeout: {
              Idle: {
                Value: 12000,
                Unit: 'ms',
              },
              PerRequest: {
                Value: 13000,
                Unit: 'ms',
              },
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
            Timeout: {
              Idle: {
                Value: 14000,
                Unit: 'ms',
              },
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
            Timeout: {
              Idle: {
                Value: 15000,
                Unit: 'ms',
              },
              PerRequest: {
                Value: 16000,
                Unit: 'ms',
              },
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
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
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
          timeout: {
            idle: cdk.Duration.seconds(10),
            perRequest: cdk.Duration.seconds(11),
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
            Timeout: {
              Idle: {
                Value: 10000,
                Unit: 'ms',
              },
              PerRequest: {
                Value: 11000,
                Unit: 'ms',
              },
            },
          },
        },
        RouteName: 'test-http-route',
      }));
      test.done();
    },

    'should allow http retries'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });
      const virtualNode = mesh.addVirtualNode('test-node', {
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      // WHEN
      router.addRoute('test-http-route', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [{ virtualNode }],
          retryPolicy: {
            httpRetryEvents: [appmesh.HttpRetryEvent.CLIENT_ERROR],
            tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(10),
          },
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            RetryPolicy: {
              HttpRetryEvents: ['client-error'],
              TcpRetryEvents: ['connection-error'],
              MaxRetries: 5,
              PerRetryTimeout: {
                Unit: 'ms',
                Value: 10000,
              },
            },
          },
        },
      }));

      test.done();
    },

    'http retry events are ABSENT when specified as an empty array'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });
      const virtualNode = mesh.addVirtualNode('test-node', {
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      // WHEN
      router.addRoute('test-http-route', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [{ virtualNode }],
          retryPolicy: {
            httpRetryEvents: [],
            tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(10),
          },
        }),
      });

      router.addRoute('test-http-route2', {
        routeSpec: appmesh.RouteSpec.http({
          weightedTargets: [{ virtualNode }],
          retryPolicy: {
            httpRetryEvents: [appmesh.HttpRetryEvent.CLIENT_ERROR],
            tcpRetryEvents: [],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(10),
          },
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            RetryPolicy: {
              HttpRetryEvents: ABSENT,
              TcpRetryEvents: ['connection-error'],
            },
          },
        },
      }));
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            RetryPolicy: {
              HttpRetryEvents: ['client-error'],
              TcpRetryEvents: ABSENT,
            },
          },
        },
      }));

      test.done();
    },

    'errors when http retry policy has no events'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });
      const virtualNode = mesh.addVirtualNode('test-node', {
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      // WHEN
      test.throws(() => {
        router.addRoute('test-http-route', {
          routeSpec: appmesh.RouteSpec.http({
            weightedTargets: [{ virtualNode }],
            retryPolicy: {
              retryAttempts: 5,
              retryTimeout: cdk.Duration.seconds(10),
            },
          }),
        });
      }, /specify one value for at least/i);

      test.done();
    },

    'should allow grpc retries'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });
      const virtualNode = mesh.addVirtualNode('test-node', {
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      // WHEN
      router.addRoute('test-grpc-route', {
        routeSpec: appmesh.RouteSpec.grpc({
          weightedTargets: [{ virtualNode }],
          match: { serviceName: 'servicename' },
          retryPolicy: {
            grpcRetryEvents: [appmesh.GrpcRetryEvent.DEADLINE_EXCEEDED],
            httpRetryEvents: [appmesh.HttpRetryEvent.CLIENT_ERROR],
            tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(10),
          },
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          GrpcRoute: {
            RetryPolicy: {
              GrpcRetryEvents: ['deadline-exceeded'],
              HttpRetryEvents: ['client-error'],
              TcpRetryEvents: ['connection-error'],
              MaxRetries: 5,
              PerRetryTimeout: {
                Unit: 'ms',
                Value: 10000,
              },
            },
          },
        },
      }));

      test.done();
    },

    'grpc retry events are ABSENT when specified as an empty array'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });
      const virtualNode = mesh.addVirtualNode('test-node', {
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      // WHEN
      router.addRoute('test-grpc-route', {
        routeSpec: appmesh.RouteSpec.grpc({
          weightedTargets: [{ virtualNode }],
          match: { serviceName: 'example' },
          retryPolicy: {
            grpcRetryEvents: [],
            httpRetryEvents: [],
            tcpRetryEvents: [appmesh.TcpRetryEvent.CONNECTION_ERROR],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(10),
          },
        }),
      });

      router.addRoute('test-grpc-route2', {
        routeSpec: appmesh.RouteSpec.grpc({
          weightedTargets: [{ virtualNode }],
          match: { serviceName: 'example' },
          retryPolicy: {
            grpcRetryEvents: [appmesh.GrpcRetryEvent.CANCELLED],
            httpRetryEvents: [],
            tcpRetryEvents: [],
            retryAttempts: 5,
            retryTimeout: cdk.Duration.seconds(10),
          },
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          GrpcRoute: {
            RetryPolicy: {
              GrpcRetryEvents: ABSENT,
              HttpRetryEvents: ABSENT,
              TcpRetryEvents: ['connection-error'],
            },
          },
        },
      }));
      expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
        Spec: {
          GrpcRoute: {
            RetryPolicy: {
              GrpcRetryEvents: ['cancelled'],
              HttpRetryEvents: ABSENT,
              TcpRetryEvents: ABSENT,
            },
          },
        },
      }));

      test.done();
    },

    'errors when grpc retry policy has no events'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const router = new appmesh.VirtualRouter(stack, 'router', {
        mesh,
      });
      const virtualNode = mesh.addVirtualNode('test-node', {
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        listeners: [appmesh.VirtualNodeListener.http()],
      });

      // WHEN
      test.throws(() => {
        router.addRoute('test-grpc-route', {
          routeSpec: appmesh.RouteSpec.grpc({
            weightedTargets: [{ virtualNode }],
            match: { serviceName: 'servicename' },
            retryPolicy: {
              retryAttempts: 5,
              retryTimeout: cdk.Duration.seconds(10),
            },
          }),
        });
      }, /specify one value for at least/i);

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
