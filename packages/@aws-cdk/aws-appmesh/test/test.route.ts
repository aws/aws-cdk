import { ABSENT, expect, haveResourceLike } from '@aws-cdk/assert-internal';
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
        MeshOwner: ABSENT,
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
            path: appmesh.HttpRoutePathMatch.startsWith('/node'),
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

    'with shared service mesh': {
      'Mesh Owner is the AWS account ID of the account that shared the mesh with your account'(test: Test) {
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
        expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
          MeshOwner: meshEnv.account,
        }));

        test.done();
      },
    },
  },

  'should match routes based on headers'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
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
    }));

    test.done();
  },

  'should match routes based on method'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Prefix: '/',
            Method: 'GET',
          },
        },
      },
    }));

    test.done();
  },

  'should match routes based on scheme'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Prefix: '/',
            Scheme: 'http',
          },
        },
      },
    }));

    test.done();
  },

  'should match routes based on metadata'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
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
    }));

    test.done();
  },

  'should match routes based on path'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        HttpRoute: {
          Match: {
            Path: {
              Exact: '/exact',
            },
          },
        },
      },
    }));

    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Http2Route: {
          Match: {
            Path: {
              Regex: 'regex',
            },
          },
        },
      },
    }));

    test.done();
  },

  'should match routes based query parameter'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
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
    }));

    test.done();
  },

  'should match routes based method name'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        GrpcRoute: {
          Match: {
            ServiceName: 'test',
            MethodName: 'testMethod',
          },
        },
      },
    }));

    test.done();
  },

  'should throw an error with invalid number of headers'(test: Test) {
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
    test.throws(() => {
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
    }, /Number of headers provided for matching must be between 1 and 10, got: 0/);

    test.throws(() => {
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
    }, /Number of headers provided for matching must be between 1 and 10, got: 11/);

    test.done();
  },

  'should throw an error with invalid number of query parameters'(test: Test) {
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
    test.throws(() => {
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
    }, /Number of query parameters provided for matching must be between 1 and 10, got: 0/);

    test.throws(() => {
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
    }, /Number of query parameters provided for matching must be between 1 and 10, got: 11/);

    test.done();
  },

  'should throw an error with invalid number of metadata'(test: Test) {
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
    test.throws(() => {
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
    }, /Number of metadata provided for matching must be between 1 and 10, got: 0/);

    // WHEN + THEN
    test.throws(() => {
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
    }, /Number of metadata provided for matching must be between 1 and 10, got: 11/);

    test.done();
  },

  'should throw an error if no gRPC match type is defined'(test: Test) {
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
    test.throws(() => {
      new appmesh.Route(stack, 'test-http-route', {
        mesh: mesh,
        virtualRouter: router,
        routeSpec: appmesh.RouteSpec.grpc({
          priority: 20,
          weightedTargets: [{ virtualNode }],
          match: {},
        }),
      });
    }, /At least one gRPC route match property must be provided/);

    test.done();
  },

  'should throw an error if method name is specified without service name'(test: Test) {
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
    test.throws(() => {
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
    }, /If you specify a method name, you must also specify a service name/);

    test.done();
  },

  'should allow route priority'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Priority: 0,
        Http2Route: {},
      },
    }));
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Priority: 10,
        HttpRoute: {},
      },
    }));
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Priority: 20,
        GrpcRoute: {},
      },
    }));
    expect(stack).to(haveResourceLike('AWS::AppMesh::Route', {
      Spec: {
        Priority: 30,
        TcpRoute: {},
      },
    }));

    test.done();
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
