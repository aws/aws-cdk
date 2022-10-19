import { Match, Template } from '@aws-cdk/assertions';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appmesh from '../lib';

describe('virtual gateway', () => {
  describe('When creating a VirtualGateway', () => {
    test('should have expected defaults', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'testGateway', {
        mesh: mesh,
      });

      new appmesh.VirtualGateway(stack, 'httpGateway', {
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.http({
          port: 443,
          healthCheck: appmesh.HealthCheck.http({
            interval: cdk.Duration.seconds(10),
          }),
        })],
      });

      new appmesh.VirtualGateway(stack, 'http2Gateway', {
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.http2({
          port: 443,
          healthCheck: appmesh.HealthCheck.http2({ interval: cdk.Duration.seconds(10) }),
        })],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
              PortMapping: {
                Port: 8080,
                Protocol: appmesh.Protocol.HTTP,
              },
            },
          ],
        },
        VirtualGatewayName: 'testGateway',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
              HealthCheck: {
                HealthyThreshold: 2,
                IntervalMillis: 10000,
                Port: 443,
                Protocol: appmesh.Protocol.HTTP,
                TimeoutMillis: 2000,
                UnhealthyThreshold: 2,
                Path: '/',
              },
              PortMapping: {
                Port: 443,
                Protocol: appmesh.Protocol.HTTP,
              },
            },
          ],
        },
        VirtualGatewayName: 'httpGateway',
        MeshOwner: Match.absent(),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
              HealthCheck: {
                HealthyThreshold: 2,
                IntervalMillis: 10000,
                Port: 443,
                Protocol: appmesh.Protocol.HTTP2,
                TimeoutMillis: 2000,
                UnhealthyThreshold: 2,
                Path: '/',
              },
              PortMapping: {
                Port: 443,
                Protocol: appmesh.Protocol.HTTP2,
              },
            },
          ],
        },
        VirtualGatewayName: 'http2Gateway',
      });
    });

    test('should have expected features', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'testGateway', {
        virtualGatewayName: 'test-gateway',
        listeners: [appmesh.VirtualGatewayListener.grpc({
          port: 80,
          healthCheck: appmesh.HealthCheck.grpc(),
        })],
        mesh: mesh,
        accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
              HealthCheck: {
                HealthyThreshold: 2,
                IntervalMillis: 5000,
                Port: 80,
                Protocol: appmesh.Protocol.GRPC,
                TimeoutMillis: 2000,
                UnhealthyThreshold: 2,
              },
              PortMapping: {
                Port: 80,
                Protocol: appmesh.Protocol.GRPC,
              },
            },
          ],
          Logging: {
            AccessLog: {
              File: {
                Path: '/dev/stdout',
              },
            },
          },
        },
        VirtualGatewayName: 'test-gateway',
      });
    });

    test('with an http listener with a TLS certificate from ACM', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const cert = new acm.Certificate(stack, 'cert', {
        domainName: '',
      });

      new appmesh.VirtualGateway(stack, 'testGateway', {
        virtualGatewayName: 'test-gateway',
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.http({
          port: 8080,
          tls: {
            mode: appmesh.TlsMode.STRICT,
            certificate: appmesh.TlsCertificate.acm(cert),
          },
        })],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            Match.objectLike({
              TLS: {
                Mode: appmesh.TlsMode.STRICT,
                Certificate: {
                  ACM: {
                    CertificateArn: {
                      Ref: 'cert56CA94EB',
                    },
                  },
                },
              },
            }),
          ],
        },
      });
    });

    test('with an grpc listener with a TLS certificate from file', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'testGateway', {
        virtualGatewayName: 'test-gateway',
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.grpc({
          port: 8080,
          tls: {
            mode: appmesh.TlsMode.STRICT,
            certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
          },
        })],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            Match.objectLike({
              TLS: {
                Mode: appmesh.TlsMode.STRICT,
                Certificate: {
                  File: {
                    CertificateChain: 'path/to/certChain',
                    PrivateKey: 'path/to/privateKey',
                  },
                },
              },
            }),
          ],
        },
      });
    });

    test('with an http2 listener with a TLS certificate from SDS', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      // WHEN
      new appmesh.VirtualGateway(stack, 'testGateway', {
        virtualGatewayName: 'test-gateway',
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.http2({
          port: 8080,
          tls: {
            mode: appmesh.TlsMode.STRICT,
            certificate: appmesh.TlsCertificate.sds('secret_certificate'),
          },
        })],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            Match.objectLike({
              TLS: {
                Mode: appmesh.TlsMode.STRICT,
                Certificate: {
                  SDS: {
                    SecretName: 'secret_certificate',
                  },
                },
              },
            }),
          ],
        },
      });
    });

    describe('with an grpc listener with a TLS validation from file', () => {
      test('the listener should include the TLS configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualGateway(stack, 'testGateway', {
          virtualGatewayName: 'test-gateway',
          mesh: mesh,
          listeners: [appmesh.VirtualGatewayListener.grpc({
            port: 8080,
            tls: {
              mode: appmesh.TlsMode.STRICT,
              certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
              mutualTlsValidation: {
                trust: appmesh.TlsValidationTrust.file('path/to/certChain'),
              },
            },
          })],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
          Spec: {
            Listeners: [
              Match.objectLike({
                TLS: {
                  Mode: appmesh.TlsMode.STRICT,
                  Certificate: {
                    File: {
                      CertificateChain: 'path/to/certChain',
                      PrivateKey: 'path/to/privateKey',
                    },
                  },
                  Validation: {
                    Trust: {
                      File: {
                        CertificateChain: 'path/to/certChain',
                      },
                    },
                  },
                },
              }),
            ],
          },
        });
      });
    });

    describe('with an http2 listener with a TLS validation from SDS', () => {
      test('the listener should include the TLS configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualGateway(stack, 'testGateway', {
          virtualGatewayName: 'test-gateway',
          mesh: mesh,
          listeners: [appmesh.VirtualGatewayListener.http2({
            port: 8080,
            tls: {
              mode: appmesh.TlsMode.STRICT,
              certificate: appmesh.TlsCertificate.sds('secret_certificate'),
              mutualTlsValidation: {
                subjectAlternativeNames: appmesh.SubjectAlternativeNames.matchingExactly('mesh-endpoint.apps.local'),
                trust: appmesh.TlsValidationTrust.sds('secret_validation'),
              },
            },
          })],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
          Spec: {
            Listeners: [
              Match.objectLike({
                TLS: {
                  Mode: appmesh.TlsMode.STRICT,
                  Certificate: {
                    SDS: {
                      SecretName: 'secret_certificate',
                    },
                  },
                  Validation: {
                    SubjectAlternativeNames: {
                      Match: {
                        Exact: ['mesh-endpoint.apps.local'],
                      },
                    },
                  },
                },
              }),
            ],
          },
        });
      });
    });

    test('with an grpc listener with the TLS mode permissive', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'testGateway', {
        virtualGatewayName: 'test-gateway',
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.grpc({
          port: 8080,
          tls: {
            mode: appmesh.TlsMode.PERMISSIVE,
            certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
          },
        })],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            Match.objectLike({
              TLS: {
                Mode: appmesh.TlsMode.PERMISSIVE,
                Certificate: {
                  File: {
                    CertificateChain: 'path/to/certChain',
                    PrivateKey: 'path/to/privateKey',
                  },
                },
              },
            }),
          ],
        },
      });
    });

    describe('with shared service mesh', () => {
      test('Mesh Owner is the AWS account ID of the account that shared the mesh with your account', () => {
        // GIVEN
        const app = new cdk.App();
        const meshEnv = { account: '1234567899', region: 'us-west-2' };
        const virtualGatewayEnv = { account: '9987654321', region: 'us-west-2' };

        // Creating stack in Account 9987654321
        const stack = new cdk.Stack(app, 'mySharedStack', { env: virtualGatewayEnv });
        // Mesh is in Account 1234567899
        const sharedMesh = appmesh.Mesh.fromMeshArn(stack, 'shared-mesh',
          `arn:aws:appmesh:${meshEnv.region}:${meshEnv.account}:mesh/shared-mesh`);

        // WHEN
        new appmesh.VirtualGateway(stack, 'test-node', {
          mesh: sharedMesh,
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
          MeshOwner: meshEnv.account,
        });
      });
    });
  });

  describe('When adding a gateway route to existing VirtualGateway ', () => {
    test('should create gateway route resource', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualGateway = new appmesh.VirtualGateway(stack, 'testGateway', {
        virtualGatewayName: 'test-gateway',
        mesh: mesh,
      });

      const virtualService = new appmesh.VirtualService(stack, 'virtualService', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
      });

      virtualGateway.addGatewayRoute('testGatewayRoute', {
        gatewayRouteName: 'test-gateway-route',
        routeSpec: appmesh.GatewayRouteSpec.http({
          routeTarget: virtualService,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'test-gateway-route',
        Spec: {
          HttpRoute: {
            Action: {
              Target: {
                VirtualService: {
                  VirtualServiceName: {
                    'Fn::GetAtt': ['virtualService03A04B87', 'VirtualServiceName'],
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
    });
  });

  describe('When adding gateway routes to a VirtualGateway with existing gateway routes', () => {
    test('should add gateway routes and not overwite', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualService = new appmesh.VirtualService(stack, 'virtualService', {
        virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
      });

      const virtualGateway = mesh.addVirtualGateway('gateway');
      virtualGateway.addGatewayRoute('testGatewayRoute', {
        gatewayRouteName: 'test-gateway-route',
        routeSpec: appmesh.GatewayRouteSpec.http({
          routeTarget: virtualService,
        }),
      });
      virtualGateway.addGatewayRoute('testGatewayRoute2', {
        gatewayRouteName: 'test-gateway-route-2',
        routeSpec: appmesh.GatewayRouteSpec.http({
          routeTarget: virtualService,
        }),
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'test-gateway-route',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'test-gateway-route-2',
      });
    });
  });

  describe('When creating a VirtualGateway with backend defaults', () => {
    test('should add backend defaults to the VirtualGateway', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'virtual-gateway', {
        virtualGatewayName: 'virtual-gateway',
        mesh: mesh,
        backendDefaults: {
          tlsClientPolicy: {
            validation: {
              trust: appmesh.TlsValidationTrust.file('path-to-certificate'),
            },
          },
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
        VirtualGatewayName: 'virtual-gateway',
        Spec: {
          BackendDefaults: {
            ClientPolicy: {
              TLS: {
                Validation: {
                  Trust: {
                    File: {
                      CertificateChain: 'path-to-certificate',
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    describe("with client's TLS certificate from SDS", () => {
      test('should add a backend default to the resource with TLS certificate', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualGateway(stack, 'virtual-gateway', {
          virtualGatewayName: 'virtual-gateway',
          mesh: mesh,
          backendDefaults: {
            tlsClientPolicy: {
              mutualTlsCertificate: appmesh.TlsCertificate.sds( 'secret_certificate'),
              validation: {
                subjectAlternativeNames: appmesh.SubjectAlternativeNames.matchingExactly('mesh-endpoint.apps.local'),
                trust: appmesh.TlsValidationTrust.sds('secret_validation'),
              },
            },
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
          VirtualGatewayName: 'virtual-gateway',
          Spec: {
            BackendDefaults: {
              ClientPolicy: {
                TLS: {
                  Certificate: {
                    SDS: {
                      SecretName: 'secret_certificate',
                    },
                  },
                  Validation: {
                    SubjectAlternativeNames: {
                      Match: {
                        Exact: ['mesh-endpoint.apps.local'],
                      },
                    },
                    Trust: {
                      SDS: {
                        SecretName: 'secret_validation',
                      },
                    },
                  },
                },
              },
            },
          },
        });
      });
    });
  });

  test('Can add an http connection pool to listener', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    new appmesh.VirtualGateway(stack, 'virtual-gateway', {
      virtualGatewayName: 'virtual-gateway',
      mesh: mesh,
      listeners: [
        appmesh.VirtualGatewayListener.http({
          port: 80,
          connectionPool: {
            maxConnections: 100,
            maxPendingRequests: 10,
          },
        }),
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
      VirtualGatewayName: 'virtual-gateway',
      Spec: {
        Listeners: [
          Match.objectLike({
            ConnectionPool: {
              HTTP: {
                MaxConnections: 100,
                MaxPendingRequests: 10,
              },
            },
          }),
        ],
      },
    });
  });

  test('Can add an grpc connection pool to listener', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    new appmesh.VirtualGateway(stack, 'virtual-gateway', {
      virtualGatewayName: 'virtual-gateway',
      mesh: mesh,
      listeners: [
        appmesh.VirtualGatewayListener.grpc({
          port: 80,
          connectionPool: {
            maxRequests: 10,
          },
        }),
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
      VirtualGatewayName: 'virtual-gateway',
      Spec: {
        Listeners: [
          Match.objectLike({
            ConnectionPool: {
              GRPC: {
                MaxRequests: 10,
              },
            },
          }),
        ],
      },
    });
  });

  test('Can add an http2 connection pool to listener', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    new appmesh.VirtualGateway(stack, 'virtual-gateway', {
      virtualGatewayName: 'virtual-gateway',
      mesh: mesh,
      listeners: [
        appmesh.VirtualGatewayListener.http2({
          port: 80,
          connectionPool: {
            maxRequests: 10,
          },
        }),
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualGateway', {
      VirtualGatewayName: 'virtual-gateway',
      Spec: {
        Listeners: [
          Match.objectLike({
            ConnectionPool: {
              HTTP2: {
                MaxRequests: 10,
              },
            },
          }),
        ],
      },
    });
  });

  test('Can import VirtualGateways using an ARN', () => {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'testMesh';
    const virtualGatewayName = 'test-gateway';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualGateway/${virtualGatewayName}`;

    // WHEN
    const virtualGateway = appmesh.VirtualGateway.fromVirtualGatewayArn(
      stack, 'importedGateway', arn);
    // THEN
    expect(virtualGateway.mesh.meshName).toEqual(meshName);
    expect(virtualGateway.virtualGatewayName).toEqual(virtualGatewayName);
  });

  test('Can import VirtualGateways using attributes', () => {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'testMesh';
    const virtualGatewayName = 'test-gateway';

    // WHEN
    const virtualGateway = appmesh.VirtualGateway.fromVirtualGatewayAttributes(stack, 'importedGateway', {
      mesh: appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName),
      virtualGatewayName: virtualGatewayName,
    });
    // THEN
    expect(virtualGateway.mesh.meshName).toEqual(meshName);
    expect(virtualGateway.virtualGatewayName).toEqual(virtualGatewayName);
  });

  test('Can grant an identity StreamAggregatedResources for a given VirtualGateway', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });
    const gateway = new appmesh.VirtualGateway(stack, 'testGateway', {
      mesh: mesh,
    });

    // WHEN
    const user = new iam.User(stack, 'test');
    gateway.grantStreamAggregatedResources(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appmesh:StreamAggregatedResources',
            Effect: 'Allow',
            Resource: {
              Ref: 'testGatewayF09EC349',
            },
          },
        ],
      },
    });
  });
});