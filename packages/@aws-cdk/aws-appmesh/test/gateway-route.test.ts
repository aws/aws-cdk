import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as appmesh from '../lib';

describe('gateway route', () => {
  describe('When creating a GatewayRoute', () => {
    test('should have expected defaults', () => {
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
          match: {
            serviceName: virtualService.virtualServiceName,
          },
        }),
        gatewayRouteName: 'gateway-grpc-route',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-http-route',
        MeshOwner: Match.absent(),
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
      });
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
      });
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
      });

    });

    test('should throw an exception if you start an http prefix match not with a /', () => {
      // GIVEN
      const stack = new cdk.Stack();

      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualService = new appmesh.VirtualService(stack, 'testVirtualService', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
      });
      expect(() => appmesh.GatewayRouteSpec.http({
        routeTarget: virtualService,
        match: {
          path: appmesh.HttpRoutePathMatch.startsWith('wrong'),
        },
      }).bind(stack)).toThrow(/Prefix Path for the match must start with \'\/\', got: wrong/);

    });

    describe('with shared service mesh', () => {
      test('Mesh Owner is the AWS account ID of the account that shared the mesh with your account', () => {
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
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          MeshOwner: meshEnv.account,
        });
      });
    });

    describe('with host name rewrite', () => {
      test('should set default target host name', () => {
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
              rewriteRequestHostname: true,
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        virtualGateway.addGatewayRoute('gateway-grpc-route', {
          routeSpec: appmesh.GatewayRouteSpec.grpc({
            routeTarget: virtualService,
            match: {
              serviceName: virtualService.virtualServiceName,
              rewriteRequestHostname: false,
            },
          }),
          gatewayRouteName: 'gateway-grpc-route',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });

        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-grpc-route',
          Spec: {
            GrpcRoute: {
              Action: {
                Rewrite: {
                  Hostname: {
                    DefaultTargetHostname: 'DISABLED',
                  },
                },
              },
            },
          },
        });
      });
    });

    describe('with wholePath rewrite', () => {
      test('should set exact path', () => {
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
            match: {
              method: appmesh.HttpRouteMethod.GET,
              path: appmesh.HttpGatewayRoutePathMatch.exactly('/test', '/rewrittenPath'),
            },
          }),
          gatewayRouteName: 'gateway-http2-route',
        });
        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });
      });
    });

    describe('with prefix rewrite', () => {
      test('should set default prefix or value', () => {
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
              path: appmesh.HttpGatewayRoutePathMatch.startsWith('/test/', ''),
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            match: {
              path: appmesh.HttpGatewayRoutePathMatch.startsWith('/test/', '/rewrittenUri/'),
            },
          }),
          gatewayRouteName: 'gateway-http2-route',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route-1', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            match: {
              path: appmesh.HttpGatewayRoutePathMatch.startsWith('/test/'),
            },
          }),
          gatewayRouteName: 'gateway-http2-route-1',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Action: {
                Rewrite: {
                  Prefix: {
                    DefaultPrefix: 'DISABLED',
                  },
                },
              },
            },
          },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http2-route',
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
        });

        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http2-route-1',
          Spec: {
            Http2Route: {
              Action: {
                Rewrite: Match.absent(),
              },
            },
          },
        });
      });

      test("should throw an error if the prefix match does not start and end with '/'", () => {
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
        expect(() => {
          virtualGateway.addGatewayRoute('gateway-http-route', {
            routeSpec: appmesh.GatewayRouteSpec.http({
              routeTarget: virtualService,
              match: {
                path: appmesh.HttpGatewayRoutePathMatch.startsWith('test/', '/rewrittenUri/'),
              },
            }),
            gatewayRouteName: 'gateway-http-route',
          });
        }).toThrow(/Prefix path for the match must start with \'\/\', got: test\//);
        expect(() => {
          virtualGateway.addGatewayRoute('gateway-http2-route', {
            routeSpec: appmesh.GatewayRouteSpec.http2({
              routeTarget: virtualService,
              match: {
                path: appmesh.HttpGatewayRoutePathMatch.startsWith('/test', '/rewrittenUri/'),
              },
            }),
            gatewayRouteName: 'gateway-http2-route',
          });
        }).toThrow(/When prefix path for the rewrite is specified, prefix path for the match must end with \'\/\', got: \/test/);
      });

      test("should throw an error if the custom prefix does not start and end with '/'", () => {
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
        expect(() => {
          virtualGateway.addGatewayRoute('gateway-http2-route', {
            routeSpec: appmesh.GatewayRouteSpec.http2({
              routeTarget: virtualService,
              match: {
                path: appmesh.HttpGatewayRoutePathMatch.startsWith('/', 'rewrittenUri/'),
              },
            }),
            gatewayRouteName: 'gateway-http2-route',
          });
        }).toThrow(/Prefix path for the rewrite must start and end with \'\/\', got: rewrittenUri\//);

        expect(() => {
          virtualGateway.addGatewayRoute('gateway-http2-route-1', {
            routeSpec: appmesh.GatewayRouteSpec.http2({
              routeTarget: virtualService,
              match: {
                path: appmesh.HttpGatewayRoutePathMatch.startsWith('/', '/rewrittenUri'),
              },
            }),
            gatewayRouteName: 'gateway-http2-route',
          });
        }).toThrow(/Prefix path for the rewrite must start and end with \'\/\', got: \/rewrittenUri/);
      });
    });

    describe('with host name match', () => {
      test('should match based on host name', () => {
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
              hostname: appmesh.GatewayRouteHostnameMatch.exactly('example.com'),
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        virtualGateway.addGatewayRoute('gateway-grpc-route', {
          routeSpec: appmesh.GatewayRouteSpec.grpc({
            routeTarget: virtualService,
            match: {
              hostname: appmesh.GatewayRouteHostnameMatch.endsWith('.example.com'),
            },
          }),
          gatewayRouteName: 'gateway-grpc-route',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
                Hostname: {
                  Exact: 'example.com',
                },
              },
              Action: {
                Rewrite: Match.absent(),
              },
            },
          },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });
      });
    });

    describe('with metadata match', () => {
      test('should match based on metadata', () => {
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
          gatewayRouteName: 'gateway-grpc-route',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });
      });

      test('should throw an error if the array length is invalid', () => {
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

        expect(() => {
          virtualGateway.addGatewayRoute('gateway-grpc-route', {
            routeSpec: appmesh.GatewayRouteSpec.grpc({
              routeTarget: virtualService,
              match: {
                // size 0 array
                metadata: [
                ],
              },
            }),
            gatewayRouteName: 'gateway-grpc-route',
          });
        }).toThrow(/Number of metadata provided for matching must be between 1 and 10/);

        expect(() => {
          virtualGateway.addGatewayRoute('gateway-grpc-route-1', {
            routeSpec: appmesh.GatewayRouteSpec.grpc({
              routeTarget: virtualService,
              match: {
                // size 11 array
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
            gatewayRouteName: 'gateway-grpc-route',
          });
        }).toThrow(/Number of metadata provided for matching must be between 1 and 10/);
      });
    });

    describe('with header match', () => {
      test('should match based on header', () => {
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
          gatewayRouteName: 'gateway-http-route',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });
      });
    });

    describe('with method match', () => {
      test('should match based on method', () => {
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
              method: appmesh.HttpRouteMethod.DELETE,
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
                Method: 'DELETE',
              },
            },
          },
        });
      });
    });

    describe('with path match', () => {
      test('should match based on path', () => {
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
              path: appmesh.HttpGatewayRoutePathMatch.exactly('/exact', undefined),
            },
          }),
          gatewayRouteName: 'gateway-http-route',
        });

        // Add an HTTP2 Route
        virtualGateway.addGatewayRoute('gateway-http2-route', {
          routeSpec: appmesh.GatewayRouteSpec.http2({
            routeTarget: virtualService,
            match: {
              path: appmesh.HttpGatewayRoutePathMatch.regex('regex'),
            },
          }),
          gatewayRouteName: 'gateway-http2-route',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-http-route',
          Spec: {
            HttpRoute: {
              Match: {
                Path: {
                  Exact: '/exact',
                },
              },
              Action: {
                Rewrite: Match.absent(),
              },
            },
          },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });
      });

      test('should throw an error if empty string is passed', () => {
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

        expect(() => {
          virtualGateway.addGatewayRoute('gateway-http-route', {
            routeSpec: appmesh.GatewayRouteSpec.http({
              routeTarget: virtualService,
              match: {
                path: appmesh.HttpGatewayRoutePathMatch.exactly('/exact', ''),
              },
            }),
            gatewayRouteName: 'gateway-http-route',
          });
        }).toThrow(/Exact Path for the rewrite cannot be empty. Unlike startsWith\(\) method, no automatic rewrite on whole path match/);
      });
    });

    describe('with query paramater match', () => {
      test('should match based on query parameter', () => {
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
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
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
        });
      });
    });
  });

  describe('with empty HTTP/HTTP2match', () => {
    test('should match based on prefix', () => {
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
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'gateway-http-route',
        Spec: {
          HttpRoute: {
            Match: {
              Prefix: '/',
            },
          },
        },
      });
    });
  });

  describe('with priority', () => {
    test('should set the priority for http gateway route', () => {
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
          priority: 100,
        }),
        gatewayRouteName: 'gateway-http-route',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        Spec: {
          Priority: 100,
        },
      });
    });

    test('should set the priority for grpc gateway route', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
        listeners: [appmesh.VirtualGatewayListener.grpc()],
        mesh: mesh,
      });

      const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        virtualServiceName: 'target.local',
      });

      // Add an Grpc Route
      new appmesh.GatewayRoute(stack, 'test-node', {
        routeSpec: appmesh.GatewayRouteSpec.grpc({
          match: {
            serviceName: virtualService.virtualServiceName,
          },
          routeTarget: virtualService,
          priority: 500,
        }),
        virtualGateway: virtualGateway,
        gatewayRouteName: 'routeWithPriority',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        Spec: {
          Priority: 500,
        },
      });
    });
  });

  test('Can import Gateway Routes using an ARN', () => {
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
    expect(gatewayRoute.gatewayRouteName).toEqual(gatewayRouteName);
    expect(gatewayRoute.virtualGateway.virtualGatewayName).toEqual(virtualGatewayName);
    expect(gatewayRoute.virtualGateway.mesh.meshName).toEqual(meshName);

  });
  test('Can import Gateway Routes using attributes', () => {
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
    expect(gatewayRoute.gatewayRouteName).toEqual(gatewayRouteName);
    expect(gatewayRoute.virtualGateway.mesh.meshName).toEqual(meshName);

  });

  test('Can create a Gateway Route from a CfnGatewayRoute', () => {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'test-mesh';
    const virtualGatewayName = 'test-gateway';

    // WHEN
    const mesh = appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName);
    const gateway = mesh.addVirtualGateway('VirtualGateway', {
      virtualGatewayName: virtualGatewayName,
    });
    const virtualService = new appmesh.VirtualService(stack, 'vs-1', {
      virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
      virtualServiceName: 'target.local',
    });
    const cfnGatewayRoute = new appmesh.CfnGatewayRoute(stack, 'GatewayRoute', {
      meshName: mesh.meshName,
      virtualGatewayName: gateway.virtualGatewayName,
      spec: {
        httpRoute: {
          action: {
            target: {
              virtualService: {
                virtualServiceName: virtualService.virtualServiceName,
              },
            },
          },
          match: {
            prefix: '/',
          },
        },
      },
    });
    appmesh.GatewayRoute.fromCfnGatewayRoute(cfnGatewayRoute);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
      VirtualGatewayName: Match.anyValue(),
      Spec: {
        HttpRoute: {
          Match: {
            Prefix: '/',
          },
          Action: {
            Target: {
              VirtualService: {
                VirtualServiceName: Match.anyValue(),
              },
            },
          },
        },
      },
    });
  });
});
