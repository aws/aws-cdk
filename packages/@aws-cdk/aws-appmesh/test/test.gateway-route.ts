import { ABSENT, expect, haveResourceLike } from '@aws-cdk/assert-internal';
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
        listeners: [appmesh.VirtualGatewayListener.http()],
        mesh: mesh,
      });

      const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        virtualServiceName: 'target.local',
      });

      // Add an HTTP Route
      virtualGateway.addGatewayRoute('gateway-http-route', {
        routeSpec: appmesh.GatewayRouteSpec.http({
          routeTarget: virtualService,
        }),
        gatewayRouteName: 'gateway-http-route',
      });

      virtualGateway.addGatewayRoute('gateway-http2-route', {
        routeSpec: appmesh.GatewayRouteSpec.http2({
          routeTarget: virtualService,
        }),
        gatewayRouteName: 'gateway-http2-route',
      });

      virtualGateway.addGatewayRoute('gateway-grpc-route', {
        routeSpec: appmesh.GatewayRouteSpec.grpc({
          routeTarget: virtualService,
          match: appmesh.GrpcGatewayRouteMatch.serviceName(virtualService.virtualServiceName),
        }),
        gatewayRouteName: 'gateway-grpc-route',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-http-route',
        MeshOwner: ABSENT,
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

      const virtualService = new appmesh.VirtualService(stack, 'testVirtualService', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
      });
      test.throws(() => appmesh.GatewayRouteSpec.http({
        routeTarget: virtualService,
        match: {
          pathOrPrefix: appmesh.HttpRoutePathOrPrefixMatch.prefix('wrong'),
        },
      }).bind(stack),
      /Prefix Path must start with \'\/\', got: wrong/);
      test.done();
    },

    'with shared service mesh': {
      'Mesh Owner is the AWS account ID of the account that shared the mesh with your account'(test:Test) {
        // GIVEN
        const app = new cdk.App();
        const meshEnv = { account: '1234567899', region: 'us-west-2' };
        const gatewayRouteEnv = { account: '9987654321', region: 'us-west-2' };

        // Creating stack in Account 9987654321
        const stack = new cdk.Stack(app, 'mySharedStack', { env: gatewayRouteEnv });
        // Mesh is in Account 1234567899
        const sharedMesh = appmesh.Mesh.fromMeshArn(stack, 'shared-mesh',
          `arn:aws:appmesh:${meshEnv.region}:${meshEnv.account}:mesh/shared-mesh`);
        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: sharedMesh,
        });
        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(sharedMesh),
          virtualServiceName: 'target.local',
        });

        // WHEN
        new appmesh.GatewayRoute(stack, 'test-node', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
          }),
          virtualGateway: virtualGateway,
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          MeshOwner: meshEnv.account,
        }));

        test.done();
      },
    },

    'with host name rewrite': {
      'should set default target host name'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            rewrite: {
              defaultHostname: appmesh.Default.ENABLED,
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        virtualGateway.addGatewayRoute('gateway-grpc-route', {
          routeSpec: appmesh.GatewayRouteSpec.grpc({
            routeTarget: virtualService,
            match: appmesh.GrpcRouteMatch.serviceName(virtualService.virtualServiceName),
            rewrite: {
              defaultHostname: appmesh.Default.ENABLED,
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
                Rewrite: {
                  Hostname: {
                    DefaultTargetHostname: 'ENABLED',
                  },
                },
              },
            },
          },
        }));

        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-grpc-route',
          Spec: {
            GrpcRoute: {
              Action: {
                Rewrite: {
                  Hostname: {
                    DefaultTargetHostname: 'ENABLED',
                  },
                },
              },
            },
          },
        }));

        test.done();
      },
    },

    'with path rewrite': {
      'should set exact path'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            rewrite: {
              pathOrPrefix: appmesh.HttpGatewayRoutePathOrPrefixRewrite.path('/rewrittenPath'),
            },
            match: {
              method: appmesh.HttpRouteMatchMethod.GET,
            },
          }),
          gatewayRouteName: 'gateway-http2-route',
        });


        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http2-route',
          Spec: {
            Http2Route: {
              Action: {
                Rewrite: {
                  Path: {
                    Exact: '/rewrittenPath',
                  },
                },
              },
            },
          },
        }));

        test.done();
      },

      'should throw an error if match on prefix'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // WHEN + THEN

        test.throws(() => {
          virtualGateway.addGatewayRoute('gateway-http2-route', {
            routeSpec: appmesh.GatewayRouteSpec.http2({
              routeTarget: virtualService,
              rewrite: {
                pathOrPrefix: appmesh.HttpGatewayRoutePathOrPrefixRewrite.path('/rewrittenPath'),
              },
              match: {
                pathOrPrefix: appmesh.HttpRoutePathOrPrefixMatch.prefix('/'),
              },
            }),
            gatewayRouteName: 'gateway-http2-route',
          }), /HTTP Gateway Route Prefix Match and Path Rewrite both cannot be set/;
        });

        test.done();
      },
    },

    'with prefix rewrite': {
      'should set default prefix or value'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            rewrite: {
              pathOrPrefix: appmesh.HttpGatewayRoutePathOrPrefixRewrite.defaultPrefix(appmesh.Default.ENABLED),
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            rewrite: {
              pathOrPrefix: appmesh.HttpGatewayRoutePathOrPrefixRewrite.defaultPrefix(appmesh.Default.DISABLED),
            },
          }),
          gatewayRouteName: 'gateway-http2-route',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route-2', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            rewrite: {
              pathOrPrefix: appmesh.HttpGatewayRoutePathOrPrefixRewrite.customPrefix('/rewrittenUri/'),
            },
          }),
          gatewayRouteName: 'gateway-http2-route-2',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Action: {
                Rewrite: {
                  Prefix: {
                    DefaultPrefix: 'ENABLED',
                  },
                },
              },
            },
          },
        }));

        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http2-route',
          Spec: {
            Http2Route: {
              Action: {
                Rewrite: {
                  Prefix: {
                    DefaultPrefix: 'DISABLED',
                  },
                },
              },
            },
          },
        }));

        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http2-route-2',
          Spec: {
            Http2Route: {
              Action: {
                Rewrite: {
                  Prefix: {
                    Value: '/rewrittenUri/',
                  },
                },
              },
            },
          },
        }));

        test.done();
      },

      'should throw an error if match is not on prefix'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // WHEN + THEN

        test.throws(() => {
          virtualGateway.addGatewayRoute('gateway-http2-route', {
            routeSpec: appmesh.GatewayRouteSpec.http2({
              routeTarget: virtualService,
              rewrite: {
                pathOrPrefix: appmesh.HttpGatewayRoutePathOrPrefixRewrite.customPrefix('/rewrittenUrl'),
              },
              match: {
                pathOrPrefix: appmesh.HttpRoutePathOrPrefixMatch.path(appmesh.HttpPathMatch.matchingExactly('/'),
                ),
              },
            }),
            gatewayRouteName: 'gateway-http2-route',
          }), /HTTP Gateway Route Prefix Match must be set./;
        });

        test.done();
      },
    },

    'with host name match': {
      'should match based on host name'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            match: {
              hostname: appmesh.GatewayRouteHostname.matchingExactly('example.com'),
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        virtualGateway.addGatewayRoute('gateway-grpc-route', {
          routeSpec: appmesh.GatewayRouteSpec.grpc({
            routeTarget: virtualService,
            match: appmesh.GrpcGatewayRouteMatch.hostname(appmesh.GatewayRouteHostname.matchingSuffix('.example.com')),
          }),
          gatewayRouteName: 'gateway-grpc-route',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
                Hostname: {
                  Exact: 'example.com',
                },
              },
            },
          },
        }));

        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-grpc-route',
          Spec: {
            GrpcRoute: {
              Match: {
                Hostname: {
                  Suffix: '.example.com',
                },
              },
            },
          },
        }));

        test.done();
      },
    },

    'with metadata match': {
      'should match based on metadata'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        virtualGateway.addGatewayRoute('gateway-grpc-route', {
          routeSpec: appmesh.GatewayRouteSpec.grpc({
            routeTarget: virtualService,
            match: appmesh.GrpcGatewayRouteMatch.metadata([
              appmesh.GrpcMetadataMatch.valueIs('Content-Type', 'application/json'),
              appmesh.GrpcMetadataMatch.valueIsNot('Content-Type', 'text/html'),
              appmesh.GrpcMetadataMatch.valueStartsWith('Content-Type', 'application/'),
              appmesh.GrpcMetadataMatch.valueDoesNotStartWith('Content-Type', 'text/'),
              appmesh.GrpcMetadataMatch.valueEndsWith('Content-Type', '/json'),
              appmesh.GrpcMetadataMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
              appmesh.GrpcMetadataMatch.valueMatchesRegex('Content-Type', 'application/.*'),
              appmesh.GrpcMetadataMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
              appmesh.GrpcMetadataMatch.valuesIsInRange('Max-Forward', 1, 5),
              appmesh.GrpcMetadataMatch.valuesIsNotInRange('Max-Forward', 1, 5),
            ]),
          }),
          gatewayRouteName: 'gateway-grpc-route',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-grpc-route',
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
    },

    'with header match': {
      'should match based on header'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            match: {
              headers: [
                appmesh.HttpHeaderMatch.valueIs('Content-Type', 'application/json'),
                appmesh.HttpHeaderMatch.valueIsNot('Content-Type', 'text/html'),
                appmesh.HttpHeaderMatch.valueStartsWith('Content-Type', 'application/'),
                appmesh.HttpHeaderMatch.valueDoesNotStartWith('Content-Type', 'text/'),
                appmesh.HttpHeaderMatch.valueEndsWith('Content-Type', '/json'),
                appmesh.HttpHeaderMatch.valueDoesNotEndWith('Content-Type', '/json+foobar'),
                appmesh.HttpHeaderMatch.valueMatchesRegex('Content-Type', 'application/.*'),
                appmesh.HttpHeaderMatch.valueDoesNotMatchRegex('Content-Type', 'text/.*'),
                appmesh.HttpHeaderMatch.valuesIsInRange('Max-Forward', 1, 5),
                appmesh.HttpHeaderMatch.valuesIsNotInRange('Max-Forward', 1, 5),
              ],
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
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
    },

    'with method match': {
      'should match based on method'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            match: {
              method: appmesh.HttpRouteMatchMethod.DELETE,
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
                Method: 'DELETE',
              },
            },
          },
        }));

        test.done();
      },
    },

    'with path match': {
      'should match based on path'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            match: {
              pathOrPrefix: appmesh.HttpRoutePathOrPrefixMatch.path(appmesh.HttpPathMatch.matchingExactly('exact')),
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            match: {
              pathOrPrefix: appmesh.HttpRoutePathOrPrefixMatch.path(appmesh.HttpPathMatch.matchingRegex('regex')),
            },
          }),
          gatewayRouteName: 'gateway-http2-route',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
                Path: {
                  Exact: 'exact',
                },
              },
            },
          },
        }));

        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http2-route',
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
    },

    'with query paramater match': {
      'should match based on query parameter'(test:Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
          listeners: [appmesh.VirtualGatewayListener.http()],
          mesh: mesh,
        });

        const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
          virtualServiceName: 'target.local',
        });

        // Add an HTTP Route
        virtualGateway.addGatewayRoute('gateway-http-route', {
          routeSpec: appmesh.GatewayRouteSpec.http({
            routeTarget: virtualService,
            match: {
              queryParameters: [
                appmesh.QueryParameterMatch.valueIs('query-field', 'value'),
              ],
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
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
    },
  },

  'with empty HTTP/HTTP2match': {
    'should match based on prefix'(test:Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
        listeners: [appmesh.VirtualGatewayListener.http()],
        mesh: mesh,
      });

      const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        virtualServiceName: 'target.local',
      });

      // Add an HTTP Route
      virtualGateway.addGatewayRoute('gateway-http-route', {
        routeSpec: appmesh.GatewayRouteSpec.http({
          routeTarget: virtualService,
          match: {
          },
        }),
        gatewayRouteName: 'gateway-http-route',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-http-route',
        Spec: {
          HttpRoute: {
            Match: {
              Prefix: '/',
            },
          },
        },
      }));

      test.done();
    },
  },

  'Can import Gateway Routes using an ARN'(test: Test) {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'test-mesh';
    const virtualGatewayName = 'test-gateway';
    const gatewayRouteName = 'test-gateway-route';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualGateway/${virtualGatewayName}/gatewayRoute/${gatewayRouteName}`;

    // WHEN
    const gatewayRoute = appmesh.GatewayRoute.fromGatewayRouteArn(stack, 'importedGatewayRoute', arn);
    // THEN
    test.equal(gatewayRoute.gatewayRouteName, gatewayRouteName);
    test.equal(gatewayRoute.virtualGateway.virtualGatewayName, virtualGatewayName);
    test.equal(gatewayRoute.virtualGateway.mesh.meshName, meshName);
    test.done();
  },
  'Can import Gateway Routes using attributes'(test: Test) {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'test-mesh';
    const virtualGatewayName = 'test-gateway';
    const gatewayRouteName = 'test-gateway-route';

    // WHEN
    const mesh = appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName);
    const gateway = mesh.addVirtualGateway('VirtualGateway', {
      virtualGatewayName: virtualGatewayName,
    });
    const gatewayRoute = appmesh.GatewayRoute.fromGatewayRouteAttributes(stack, 'importedGatewayRoute', {
      gatewayRouteName: gatewayRouteName,
      virtualGateway: gateway,
    });
    // THEN
    test.equal(gatewayRoute.gatewayRouteName, gatewayRouteName);
    test.equal(gatewayRoute.virtualGateway.mesh.meshName, meshName);
    test.done();
  },
};
