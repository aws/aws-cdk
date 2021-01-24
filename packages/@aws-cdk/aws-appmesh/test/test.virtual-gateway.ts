import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as appmesh from '../lib';

export = {
  'When creating a VirtualGateway': {
    'should have expected defaults'(test: Test) {
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
          healthCheck: {
            interval: cdk.Duration.seconds(10),
          },
        })],
      });

      new appmesh.VirtualGateway(stack, 'http2Gateway', {
        mesh: mesh,
        listeners: [appmesh.VirtualGatewayListener.http2({
          port: 443,
          healthCheck: {
            interval: cdk.Duration.seconds(10),
          },
        })],
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
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
      }));

      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
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
      }));

      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
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
      }));
      test.done();
    },

    'should have expected features'(test: Test) {
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
          healthCheck: {
          },
        })],
        mesh: mesh,
        accessLog: appmesh.AccessLog.fromFilePath('/dev/stdout'),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
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
      }));
      test.done();
    },

    'with an http listener with a TLS certificate from ACM'(test: Test) {
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
          tlsCertificate: appmesh.TlsCertificate.acm({
            tlsMode: appmesh.TlsMode.STRICT,
            certificate: cert,
          }),
        })],
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
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
            },
          ],
        },
      }));

      test.done();
    },

    'with an grpc listener with a TLS certificate from file'(test: Test) {
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
          tlsCertificate: appmesh.TlsCertificate.file({
            certificateChainPath: 'path/to/certChain',
            privateKeyPath: 'path/to/privateKey',
            tlsMode: appmesh.TlsMode.STRICT,
          }),
        })],
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
              TLS: {
                Mode: appmesh.TlsMode.STRICT,
                Certificate: {
                  File: {
                    CertificateChain: 'path/to/certChain',
                    PrivateKey: 'path/to/privateKey',
                  },
                },
              },
            },
          ],
        },
      }));

      test.done();
    },

    'with an grpc listener with the TLS mode permissive'(test: Test) {
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
          tlsCertificate: appmesh.TlsCertificate.file({
            certificateChainPath: 'path/to/certChain',
            privateKeyPath: 'path/to/privateKey',
            tlsMode: appmesh.TlsMode.PERMISSIVE,
          }),
        })],
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
        Spec: {
          Listeners: [
            {
              TLS: {
                Mode: appmesh.TlsMode.PERMISSIVE,
                Certificate: {
                  File: {
                    CertificateChain: 'path/to/certChain',
                    PrivateKey: 'path/to/privateKey',
                  },
                },
              },
            },
          ],
        },
      }));

      test.done();
    },
  },

  'When adding a gateway route to existing VirtualGateway ': {
    'should create gateway route resource'(test: Test) {
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

      const virtualService = mesh.addVirtualService('virtualService', {});

      virtualGateway.addGatewayRoute('testGatewayRoute', {
        gatewayRouteName: 'test-gateway-route',
        routeSpec: appmesh.GatewayRouteSpec.http({
          routeTarget: virtualService,
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'test-gateway-route',
        Spec: {
          HttpRoute: {
            Action: {
              Target: {
                VirtualService: {
                  VirtualServiceName: {
                    'Fn::GetAtt': ['meshvirtualService93460D43', 'VirtualServiceName'],
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
      test.done();
    },
  },

  'When adding gateway routes to a VirtualGateway with existing gateway routes': {
    'should add gateway routes and not overwite'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualService = mesh.addVirtualService('virtualService', {});

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
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'test-gateway-route',
      }));
      expect(stack).to(haveResourceLike('AWS::AppMesh::GatewayRoute', {
        GatewayRouteName: 'test-gateway-route-2',
      }));
      test.done();
    },
  },

  'When creating a VirtualGateway with backend defaults': {
    'should add backend defaults to the VirtualGateway'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'virtual-gateway', {
        virtualGatewayName: 'virtual-gateway',
        mesh: mesh,
        backendsDefaultClientPolicy: appmesh.ClientPolicy.fileTrust({
          certificateChain: 'path-to-certificate',
        }),
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualGateway', {
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
      }));

      test.done();
    },
  },

  'Can import VirtualGateways using an ARN'(test: Test) {
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
    test.equal(virtualGateway.mesh.meshName, meshName);
    test.equal(virtualGateway.virtualGatewayName, virtualGatewayName);
    test.done();
  },
  'Can import VirtualGateways using attributes'(test: Test) {
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
    test.equal(virtualGateway.mesh.meshName, meshName);
    test.equal(virtualGateway.virtualGatewayName, virtualGatewayName);

    test.done();
  },
};