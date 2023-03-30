import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as appmesh from '../lib';

describe('route', () => {
  describe('When creating new routes', () => {
    test('route has expected defaults', () => {
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
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
        MeshOwner: Match.absent(),
        RouteName: 'test-http-route',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
      });
    });

    test('should have expected features', () => {
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
            path: appmesh.HttpRoutePathMatch.startsWith('/node'),
          },
          timeout: {
            idle: cdk.Duration.seconds(10),
            perRequest: cdk.Duration.seconds(11),
          },
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
      });

    });

    test('should allow http retries', () => {
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
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
      });
    });

    test('http retry events are Match.absent() when specified as an empty array', () => {
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
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            RetryPolicy: {
              HttpRetryEvents: Match.absent(),
              TcpRetryEvents: ['connection-error'],
            },
          },
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
        Spec: {
          HttpRoute: {
            RetryPolicy: {
              HttpRetryEvents: ['client-error'],
              TcpRetryEvents: Match.absent(),
            },
          },
        },
      });
    });

    test('errors when http retry policy has no events', () => {
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
      expect(() => {
        router.addRoute('test-http-route', {
          routeSpec: appmesh.RouteSpec.http({
            weightedTargets: [{ virtualNode }],
            retryPolicy: {
              retryAttempts: 5,
              retryTimeout: cdk.Duration.seconds(10),
            },
          }),
        });
      }).toThrow(/specify one value for at least/i);
    });

    test('should allow grpc retries', () => {
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
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
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
      });
    });

    test('grpc retry events are Match.absent() when specified as an empty array', () => {
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
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
        Spec: {
          GrpcRoute: {
            RetryPolicy: {
              GrpcRetryEvents: Match.absent(),
              HttpRetryEvents: Match.absent(),
              TcpRetryEvents: ['connection-error'],
            },
          },
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
        Spec: {
          GrpcRoute: {
            RetryPolicy: {
              GrpcRetryEvents: ['cancelled'],
              HttpRetryEvents: Match.absent(),
              TcpRetryEvents: Match.absent(),
            },
          },
        },
      });
    });

    test('errors when grpc retry policy has no events', () => {
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
      expect(() => {
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
      }).toThrow(/specify one value for at least/i);
    });

    describe('with shared service mesh', () => {
      test('Mesh Owner is the AWS account ID of the account that shared the mesh with your account', () => {
        // GIVEN
        const app = new cdk.App();
        const meshEnv = { account: '1234567899', region: 'us-west-2' };
        const routeEnv = { account: '9987654321', region: 'us-west-2' };
        // Creating stack in Account 9987654321
        const stack = new cdk.Stack(app, 'mySharedStack', { env: routeEnv });
        // Mesh is in Account 1234567899
        const sharedMesh = appmesh.Mesh.fromMeshArn(stack, 'shared-mesh',
          `arn:aws:appmesh:${meshEnv.region}:${meshEnv.account}:mesh/shared-mesh`);
        const router = new appmesh.VirtualRouter(stack, 'router', {
          mesh: sharedMesh,
        });
        const virtualNode = sharedMesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          listeners: [appmesh.VirtualNodeListener.http()],
        });

        new appmesh.Route(stack, 'test-route', {
          mesh: sharedMesh,
          routeSpec: appmesh.RouteSpec.grpc({
            weightedTargets: [{ virtualNode }],
            match: { serviceName: 'example' },
          }),
          virtualRouter: router,

        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
          MeshOwner: meshEnv.account,
        });
      });
    });
  });

  test('should match routes based on headers', () => {
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
    router.addRoute('route', {
      routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [{ virtualNode }],
        match: {
          path: appmesh.HttpRoutePathMatch.startsWith('/'),
          headers: [
            appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
            appmesh.HeaderMatch.valueIsNot('Content-Type', 'text/html'),
            appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/'),
            appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
            appmesh.HeaderMatch.valueEndsWith('Content-Type', '/json'),
            appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
            appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
            appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
            appmesh.HeaderMatch.valuesIsInRange('Max-Forward', 1, 5),
            appmesh.HeaderMatch.valuesIsNotInRange('Max-Forward', 1, 5),
          ],
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Prefix: '/',
            Headers: [
              {
                Invert: false,
                Match: { Exact: 'application/json' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Exact: 'text/html' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: { Prefix: 'application/' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Prefix: 'text/' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: { Suffix: '/json' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Suffix: '/json+foobar' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: { Regex: 'application/.*' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Regex: 'text/.*' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: {
                  Range: {
                    End: 5,
                    Start: 1,
                  },
                },
                Name: 'Max-Forward',
              },
              {
                Invert: true,
                Match: {
                  Range: {
                    End: 5,
                    Start: 1,
                  },
                },
                Name: 'Max-Forward',
              },
            ],
          },
        },
      },
    });
  });

  test('should match routes based on method', () => {
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
    router.addRoute('route', {
      routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [{ virtualNode }],
        match: {
          path: appmesh.HttpRoutePathMatch.startsWith('/'),
          method: appmesh.HttpRouteMethod.GET,
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Prefix: '/',
            Method: 'GET',
          },
        },
      },
    });
  });

  test('should match routes based on scheme', () => {
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
    router.addRoute('route', {
      routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [{ virtualNode }],
        match: {
          path: appmesh.HttpRoutePathMatch.startsWith('/'),
          protocol: appmesh.HttpRouteProtocol.HTTP,
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Prefix: '/',
            Scheme: 'http',
          },
        },
      },
    });
  });

  test('should match routes based on metadata', () => {
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
    new appmesh.Route(stack, 'test-grpc-route', {
      mesh: mesh,
      virtualRouter: router,
      routeSpec: appmesh.RouteSpec.grpc({
        weightedTargets: [{ virtualNode }],
        match: {
          metadata: [
            appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
            appmesh.HeaderMatch.valueIsNot('Content-Type', 'text/html'),
            appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/'),
            appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
            appmesh.HeaderMatch.valueEndsWith('Content-Type', '/json'),
            appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
            appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
            appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
            appmesh.HeaderMatch.valuesIsInRange('Max-Forward', 1, 5),
            appmesh.HeaderMatch.valuesIsNotInRange('Max-Forward', 1, 5),
          ],
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        GrpcRoute: {
          Match: {
            Metadata: [
              {
                Invert: false,
                Match: { Exact: 'application/json' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Exact: 'text/html' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: { Prefix: 'application/' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Prefix: 'text/' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: { Suffix: '/json' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Suffix: '/json+foobar' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: { Regex: 'application/.*' },
                Name: 'Content-Type',
              },
              {
                Invert: true,
                Match: { Regex: 'text/.*' },
                Name: 'Content-Type',
              },
              {
                Invert: false,
                Match: {
                  Range: {
                    End: 5,
                    Start: 1,
                  },
                },
                Name: 'Max-Forward',
              },
              {
                Invert: true,
                Match: {
                  Range: {
                    End: 5,
                    Start: 1,
                  },
                },
                Name: 'Max-Forward',
              },
            ],
          },
        },
      },
    });
  });

  test('should match routes based on path', () => {
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
    new appmesh.Route(stack, 'test-http-route', {
      mesh: mesh,
      virtualRouter: router,
      routeSpec: appmesh.RouteSpec.http({
        weightedTargets: [{ virtualNode }],
        match: {
          path: appmesh.HttpRoutePathMatch.exactly('/exact'),
        },
      }),
    });

    new appmesh.Route(stack, 'test-http2-route', {
      mesh: mesh,
      virtualRouter: router,
      routeSpec: appmesh.RouteSpec.http2({
        weightedTargets: [{ virtualNode }],
        match: {
          path: appmesh.HttpRoutePathMatch.regex('regex'),
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        HttpRoute: {
          Match: {
            Path: {
              Exact: '/exact',
            },
          },
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Path: {
              Regex: 'regex',
            },
          },
        },
      },
    });
  });

  test('should match routes based query parameter', () => {
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
    new appmesh.Route(stack, 'test-http-route', {
      mesh: mesh,
      virtualRouter: router,
      routeSpec: appmesh.RouteSpec.http({
        weightedTargets: [{ virtualNode }],
        match: {
          queryParameters: [appmesh.QueryParameterMatch.valueIs('query-field', 'value')],
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        HttpRoute: {
          Match: {
            QueryParameters: [
              {
                Name: 'query-field',
                Match: {
                  Exact: 'value',
                },
              },
            ],
          },
        },
      },
    });
  });

  test('should match routes based method name', () => {
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
    new appmesh.Route(stack, 'test-http-route', {
      mesh: mesh,
      virtualRouter: router,
      routeSpec: appmesh.RouteSpec.grpc({
        priority: 20,
        weightedTargets: [{ virtualNode }],
        match: {
          serviceName: 'test',
          methodName: 'testMethod',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        GrpcRoute: {
          Match: {
            ServiceName: 'test',
            MethodName: 'testMethod',
          },
        },
      },
    });
  });

  test('should throw an error with invalid number of headers', () => {
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

    // WHEN + THEN
    expect(() => {
      router.addRoute('route', {
        routeSpec: appmesh.RouteSpec.http2({
          weightedTargets: [{ virtualNode }],
          match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/'),
            // Empty header
            headers: [],
          },
        }),
      });
    }).toThrow(/Number of headers provided for matching must be between 1 and 10, got: 0/);

    expect(() => {
      router.addRoute('route2', {
        routeSpec: appmesh.RouteSpec.http2({
          weightedTargets: [{ virtualNode }],
          match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/'),
            // 11 headers
            headers: [
              appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
              appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
              appmesh.HeaderMatch.valueIsNot('Content-Type', 'text/html'),
              appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/'),
              appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
              appmesh.HeaderMatch.valueEndsWith('Content-Type', '/json'),
              appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
              appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
              appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
              appmesh.HeaderMatch.valuesIsInRange('Max-Forward', 1, 5),
              appmesh.HeaderMatch.valuesIsNotInRange('Max-Forward', 1, 5),
            ],
          },
        }),
      });
    }).toThrow(/Number of headers provided for matching must be between 1 and 10, got: 11/);
  });

  test('should throw an error with invalid number of query parameters', () => {
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

    // WHEN + THEN
    expect(() => {
      router.addRoute('route', {
        routeSpec: appmesh.RouteSpec.http2({
          weightedTargets: [{ virtualNode }],
          match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/'),
            // Empty header
            queryParameters: [],
          },
        }),
      });
    }).toThrow(/Number of query parameters provided for matching must be between 1 and 10, got: 0/);

    expect(() => {
      router.addRoute('route2', {
        routeSpec: appmesh.RouteSpec.http2({
          weightedTargets: [{ virtualNode }],
          match: {
            path: appmesh.HttpRoutePathMatch.startsWith('/'),
            // 11 headers
            queryParameters: [
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
            ],
          },
        }),
      });
    }).toThrow(/Number of query parameters provided for matching must be between 1 and 10, got: 11/);
  });

  test('should throw an error with invalid number of metadata', () => {
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

    // WHEN + THEN
    expect(() => {
      new appmesh.Route(stack, 'test-http-route', {
        mesh: mesh,
        virtualRouter: router,
        routeSpec: appmesh.RouteSpec.grpc({
          priority: 20,
          weightedTargets: [{ virtualNode }],
          match: {
            metadata: [],
          },
        }),
      });
    }).toThrow(/Number of metadata provided for matching must be between 1 and 10, got: 0/);

    // WHEN + THEN
    expect(() => {
      new appmesh.Route(stack, 'test-http-route-1', {
        mesh: mesh,
        virtualRouter: router,
        routeSpec: appmesh.RouteSpec.grpc({
          priority: 20,
          weightedTargets: [{ virtualNode }],
          match: {
            metadata: [
              appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
              appmesh.HeaderMatch.valueIs('Content-Type', 'application/json'),
              appmesh.HeaderMatch.valueIsNot('Content-Type', 'text/html'),
              appmesh.HeaderMatch.valueStartsWith('Content-Type', 'application/'),
              appmesh.HeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
              appmesh.HeaderMatch.valueEndsWith('Content-Type', '/json'),
              appmesh.HeaderMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
              appmesh.HeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
              appmesh.HeaderMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
              appmesh.HeaderMatch.valuesIsInRange('Max-Forward', 1, 5),
              appmesh.HeaderMatch.valuesIsNotInRange('Max-Forward', 1, 5),
            ],
          },
        }),
      });
    }).toThrow(/Number of metadata provided for matching must be between 1 and 10, got: 11/);
  });

  test('should throw an error if no gRPC match type is defined', () => {
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

    // WHEN + THEN
    expect(() => {
      new appmesh.Route(stack, 'test-http-route', {
        mesh: mesh,
        virtualRouter: router,
        routeSpec: appmesh.RouteSpec.grpc({
          priority: 20,
          weightedTargets: [{ virtualNode }],
          match: {},
        }),
      });
    }).toThrow(/At least one gRPC route match property must be provided/);
  });

  test('should throw an error if method name is specified without service name', () => {
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

    // WHEN + THEN
    expect(() => {
      new appmesh.Route(stack, 'test-http-route', {
        mesh: mesh,
        virtualRouter: router,
        routeSpec: appmesh.RouteSpec.grpc({
          priority: 20,
          weightedTargets: [{ virtualNode }],
          match: {
            methodName: 'test_method',
          },
        }),
      });
    }).toThrow(/If you specify a method name, you must also specify a service name/);
  });

  test('should allow route priority', () => {
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
    router.addRoute('http2', {
      routeSpec: appmesh.RouteSpec.http2({
        priority: 0,
        weightedTargets: [{ virtualNode }],
      }),
    });
    router.addRoute('http', {
      routeSpec: appmesh.RouteSpec.http({
        priority: 10,
        weightedTargets: [{ virtualNode }],
      }),
    });
    router.addRoute('grpc', {
      routeSpec: appmesh.RouteSpec.grpc({
        priority: 20,
        weightedTargets: [{ virtualNode }],
        match: {
          serviceName: 'test',
        },
      }),
    });
    router.addRoute('tcp', {
      routeSpec: appmesh.RouteSpec.tcp({
        priority: 30,
        weightedTargets: [{ virtualNode }],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Priority: 0,
        Http2Route: {},
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Priority: 10,
        HttpRoute: {},
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Priority: 20,
        GrpcRoute: {},
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Priority: 30,
        TcpRoute: {},
      },
    });
  });

  test('should allow zero weight route', () => {
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
    router.addRoute('http2', {
      routeSpec: appmesh.RouteSpec.http2({
        priority: 50,
        weightedTargets: [
          {
            virtualNode: virtualNode,
            weight: 0,
          },
        ],
      }),
    });
    router.addRoute('http', {
      routeSpec: appmesh.RouteSpec.http({
        priority: 10,
        weightedTargets: [
          {
            virtualNode: virtualNode,
            weight: 0,
          },
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Priority: 50,
        Http2Route: {
          Action: {
            WeightedTargets: [
              {
                Weight: 0,
              },
            ],
          },
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::Route', {
      Spec: {
        Priority: 10,
        HttpRoute: {
          Action: {
            WeightedTargets: [
              {
                Weight: 0,
              },
            ],
          },
        },
      },
    });
  });

  test('Can import Routes using an ARN', () => {
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
    expect(route.routeName).toEqual(routeName);
    expect(route.virtualRouter.virtualRouterName).toEqual(virtualRouterName);
    expect(route.virtualRouter.mesh.meshName).toEqual(meshName);

  });

  test('Can import Routes using ARN and attributes', () => {
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
    expect(route.routeName).toEqual(routeName);
    expect(route.virtualRouter.mesh.meshName).toEqual(meshName);
  });
});
