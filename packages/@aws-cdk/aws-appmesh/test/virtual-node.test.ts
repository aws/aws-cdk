import { Match, Template } from '@aws-cdk/assertions';
import * as acmpca from '@aws-cdk/aws-acmpca';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import * as appmesh from '../lib';

describe('virtual node', () => {
  describe('When an existing VirtualNode', () => {
    describe('with existing backends, adds new backend', () => {
      test('should add resource with service backends', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const service1 = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceName: 'service1.domain.local',
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        });
        const service2 = new appmesh.VirtualService(stack, 'service-2', {
          virtualServiceName: 'service2.domain.local',
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          backends: [appmesh.Backend.virtualService(service1)],
        });

        node.addBackend(appmesh.Backend.virtualService(service2));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Backends: [
              {
                VirtualService: {
                  VirtualServiceName: 'service1.domain.local',
                },
              },
              {
                VirtualService: {
                  VirtualServiceName: 'service2.domain.local',
                },
              },
            ],
          },
          MeshOwner: Match.absent(),
        });
      });
    });

    describe('when a single portmapping is added', () => {
      test('should add the portmapping to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        node.addListener(appmesh.VirtualNodeListener.tcp({
          port: 8081,
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              {
                PortMapping: {
                  Port: 8081,
                  Protocol: 'tcp',
                },
              },
            ],
          },
        });
      });
    });

    describe('when a listener is added with timeout', () => {
      test('should add the listener timeout to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          listeners: [appmesh.VirtualNodeListener.grpc({
            port: 80,
            timeout: {
              idle: cdk.Duration.seconds(10),
              perRequest: cdk.Duration.seconds(10),
            },
          })],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              {
                PortMapping: {
                  Port: 80,
                  Protocol: 'grpc',
                },
                Timeout: {
                  GRPC: {
                    Idle: {
                      Unit: 'ms',
                      Value: 10000,
                    },
                    PerRequest: {
                      Unit: 'ms',
                      Value: 10000,
                    },
                  },
                },
              },
            ],
          },
        });
      });
    });

    describe('when a listener is added with healthcheck ', () => {
      test('should add a default listener healthcheck to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          listeners: [appmesh.VirtualNodeListener.http2({
            port: 80,
            healthCheck: appmesh.HealthCheck.http2(),
            timeout: { idle: cdk.Duration.seconds(10) },
          })],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              Match.objectLike({
                HealthCheck: {
                  HealthyThreshold: 2,
                  IntervalMillis: 5000,
                  Port: 80,
                  Protocol: 'http2',
                  TimeoutMillis: 2000,
                  UnhealthyThreshold: 2,
                },
                PortMapping: {
                  Port: 80,
                  Protocol: 'http2',
                },
                Timeout: {
                  HTTP2: {
                    Idle: {
                      Unit: 'ms',
                      Value: 10000,
                    },
                  },
                },
              }),
            ],
          },
        });
      });
    });

    describe('when a listener is added with healthcheck with user defined props', () => {
      test('should add a listener healthcheck to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        node.addListener(appmesh.VirtualNodeListener.tcp({
          port: 80,
          healthCheck: appmesh.HealthCheck.tcp({
            timeout: cdk.Duration.seconds(3),
          }),
          timeout: { idle: cdk.Duration.seconds(10) },
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              Match.objectLike({
                HealthCheck: {
                  HealthyThreshold: 2,
                  IntervalMillis: 5000,
                  Port: 80,
                  Protocol: 'tcp',
                  TimeoutMillis: 3000,
                  UnhealthyThreshold: 2,
                },
                PortMapping: {
                  Port: 80,
                  Protocol: 'tcp',
                },
                Timeout: {
                  TCP: {
                    Idle: {
                      Unit: 'ms',
                      Value: 10000,
                    },
                  },
                },
              }),
            ],
          },
        });
      });
    });

    describe('when a listener is added with outlier detection with user defined props', () => {
      test('should add a listener outlier detection to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        node.addListener(appmesh.VirtualNodeListener.tcp({
          port: 80,
          outlierDetection: {
            baseEjectionDuration: cdk.Duration.seconds(10),
            interval: cdk.Duration.seconds(30),
            maxEjectionPercent: 50,
            maxServerErrors: 5,
          },
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              {
                OutlierDetection: {
                  BaseEjectionDuration: {
                    Unit: 'ms',
                    Value: 10000,
                  },
                  Interval: {
                    Unit: 'ms',
                    Value: 30000,
                  },
                  MaxEjectionPercent: 50,
                  MaxServerErrors: 5,
                },
                PortMapping: {
                  Port: 80,
                  Protocol: 'tcp',
                },
              },
            ],
          },
        });
      });
    });

    describe('when a default backend is added', () => {
      test('should add a backend default to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const certificateAuthorityArn = 'arn:aws:acm-pca:us-east-1:123456789012:certificate-authority/12345678-1234-1234-1234-123456789012';

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          backendDefaults: {
            tlsClientPolicy: {
              ports: [8080, 8081],
              validation: {
                trust: appmesh.TlsValidationTrust.acm([acmpca.CertificateAuthority.fromCertificateAuthorityArn(stack, 'certificate', certificateAuthorityArn)]),
              },
            },
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            BackendDefaults: {
              ClientPolicy: {
                TLS: {
                  Ports: [8080, 8081],
                  Validation: {
                    Trust: {
                      ACM: {
                        CertificateAuthorityArns: [`${certificateAuthorityArn}`],
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

    describe("with client's TLS certificate from SDS", () => {
      test('should add a backend default to the resource with TLS certificate', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          backendDefaults: {
            tlsClientPolicy: {
              mutualTlsCertificate: appmesh.TlsCertificate.sds('secret_certificate'),
              ports: [8080, 8081],
              validation: {
                subjectAlternativeNames: appmesh.SubjectAlternativeNames.matchingExactly('mesh-endpoint.apps.local'),
                trust: appmesh.TlsValidationTrust.sds('secret_validation'),
              },
            },
          },
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            BackendDefaults: {
              ClientPolicy: {
                TLS: {
                  Certificate: {
                    SDS: {
                      SecretName: 'secret_certificate',
                    },
                  },
                  Ports: [8080, 8081],
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

    describe('when a backend is added', () => {
      test('should add a backend virtual service to the resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        const service1 = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceName: 'service1.domain.local',
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        });

        node.addBackend(appmesh.Backend.virtualService(service1, {
          tlsClientPolicy: {
            ports: [8080, 8081],
            validation: {
              trust: appmesh.TlsValidationTrust.file('path-to-certificate'),
            },
          },
        }));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Backends: [
              {
                VirtualService: {
                  VirtualServiceName: 'service1.domain.local',
                  ClientPolicy: {
                    TLS: {
                      Ports: [8080, 8081],
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
            ],
          },
        });
      });

      test('you can add a Virtual Service as a backend to a Virtual Node which is the provider for that Virtual Service', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        const myVirtualService = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
          virtualServiceName: 'service1.domain.local',
        });

        node.addBackend(appmesh.Backend.virtualService(myVirtualService));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Backends: [
              {
                VirtualService: {
                  VirtualServiceName: 'service1.domain.local',
                },
              },
            ],
          },
        });
      });

      test('you can add a Virtual Service with an automated name as a backend to a Virtual Node which is the provider for that Virtual Service, ', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        const myVirtualService = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
        });

        node.addBackend(appmesh.Backend.virtualService(myVirtualService));

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            Backends: [
              {
                VirtualService: {
                  VirtualServiceName: 'service1',
                },
              },
            ],
          },
        });
      });
    });

    describe('when a grpc listener is added with a TLS certificate from ACM', () => {
      test('the listener should include the TLS configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const cert = new acm.Certificate(stack, 'cert', {
          domainName: '',
        });

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          listeners: [appmesh.VirtualNodeListener.grpc({
            port: 80,
            tls: {
              mode: appmesh.TlsMode.STRICT,
              certificate: appmesh.TlsCertificate.acm(cert),
            },
          },
          )],
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
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
    });

    describe('when an http listener is added with a TLS certificate from file', () => {
      test('the listener should include the TLS configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          listeners: [appmesh.VirtualNodeListener.http({
            port: 80,
            tls: {
              mode: appmesh.TlsMode.STRICT,
              certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
            },
          })],
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
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
    });

    describe('when an http2 listener is added with a TLS certificate from SDS', () => {
      test('the listener should include the TLS configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          listeners: [appmesh.VirtualNodeListener.http2({
            port: 80,
            tls: {
              mode: appmesh.TlsMode.STRICT,
              certificate: appmesh.TlsCertificate.sds('secret_certificate'),
            },
          })],
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
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
    });

    describe('when an http listener is added with the TLS mode permissive', () => {
      test('the listener should include the TLS configuration', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          listeners: [appmesh.VirtualNodeListener.http({
            port: 80,
            tls: {
              mode: appmesh.TlsMode.PERMISSIVE,
              certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
            },
          })],
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
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
    });

    test('Can add an http connection pool to listener', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualNode(stack, 'test-node', {
        mesh,
        listeners: [
          appmesh.VirtualNodeListener.http({
            port: 80,
            connectionPool: {
              maxConnections: 100,
              maxPendingRequests: 10,
            },
          }),
        ],
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
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

    test('Can add an tcp connection pool to listener', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualNode(stack, 'test-node', {
        mesh,
        listeners: [
          appmesh.VirtualNodeListener.tcp({
            port: 80,
            connectionPool: {
              maxConnections: 100,
            },
          }),
        ],
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
        Spec: {
          Listeners: Match.arrayWith([
            Match.objectLike({
              ConnectionPool: {
                TCP: {
                  MaxConnections: 100,
                },
              },
            }),
          ]),
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

      new appmesh.VirtualNode(stack, 'test-node', {
        mesh,
        listeners: [
          appmesh.VirtualNodeListener.grpc({
            port: 80,
            connectionPool: {
              maxRequests: 10,
            },
          }),
        ],
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
        Spec: {
          Listeners: Match.arrayWith([
            Match.objectLike({
              ConnectionPool: {
                GRPC: {
                  MaxRequests: 10,
                },
              },
            }),
          ]),
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

      new appmesh.VirtualNode(stack, 'test-node', {
        mesh,
        listeners: [
          appmesh.VirtualNodeListener.http2({
            port: 80,
            connectionPool: {
              maxRequests: 10,
            },
          }),
        ],
        serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
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
  });

  test('Can import Virtual Nodes using an ARN', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualNodeName = 'test-node';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualNode/${virtualNodeName}`;

    // WHEN
    const virtualNode = appmesh.VirtualNode.fromVirtualNodeArn(
      stack, 'importedVirtualNode', arn);
    // THEN
    expect(virtualNode.mesh.meshName).toEqual(meshName);
    expect(virtualNode.virtualNodeName).toEqual(virtualNodeName);
  });

  test('Can import Virtual Nodes using attributes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const meshName = 'testMesh';
    const virtualNodeName = 'test-node';
    // WHEN
    const virtualNode = appmesh.VirtualNode.fromVirtualNodeAttributes(stack, 'importedVirtualNode', {
      mesh: appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName),
      virtualNodeName: virtualNodeName,
    });
    // THEN
    expect(virtualNode.mesh.meshName).toEqual(meshName);
    expect(virtualNode.virtualNodeName).toEqual(virtualNodeName);
  });

  test('Can grant an identity StreamAggregatedResources for a given VirtualNode', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });
    const node = new appmesh.VirtualNode(stack, 'test-node', {
      mesh,
      listeners: [appmesh.VirtualNodeListener.http({
        port: 80,
        tls: {
          mode: appmesh.TlsMode.PERMISSIVE,
          certificate: appmesh.TlsCertificate.file('path/to/certChain', 'path/to/privateKey'),
        },
      })],
      serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
    });

    // WHEN
    const user = new iam.User(stack, 'test');
    node.grantStreamAggregatedResources(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'appmesh:StreamAggregatedResources',
            Effect: 'Allow',
            Resource: {
              Ref: 'testnode3EE2776E',
            },
          },
        ],
      },
    });
  });

  describe('When creating a VirtualNode', () => {
    describe('with shared service mesh', () => {
      test('Mesh Owner is the AWS account ID of the account that shared the mesh with your account', () => {
        // GIVEN
        const app = new cdk.App();
        const meshEnv = { account: '1234567899', region: 'us-west-2' };
        const virtualNodeEnv = { account: '9987654321', region: 'us-west-2' };

        // Creating stack in Account 9987654321
        const stack = new cdk.Stack(app, 'mySharedStack', { env: virtualNodeEnv });
        // Mesh is in Account 1234567899
        const sharedMesh = appmesh.Mesh.fromMeshArn(stack, 'shared-mesh',
          `arn:aws:appmesh:${meshEnv.region}:${meshEnv.account}:mesh/shared-mesh`);

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh: sharedMesh,
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          MeshOwner: meshEnv.account,
        });
      });
    });

    describe('with DNS service discovery', () => {
      test('with basic configuration and without optional fields', () => {
        // GIVEN
        const stack = new cdk.Stack();

        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            ServiceDiscovery: {
              DNS: {
                Hostname: 'test',
              },
            },
          },
        });
      });

      test('should allow set response type', () => {
        // GIVEN
        const stack = new cdk.Stack();

        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test', appmesh.DnsResponseType.LOAD_BALANCER),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            ServiceDiscovery: {
              DNS: {
                Hostname: 'test',
                ResponseType: 'LOADBALANCER',
              },
            },
          },
        });
      });

      test('has an IP Preference applied', () => {
        // GIVEN
        const stack = new cdk.Stack();

        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test', appmesh.DnsResponseType.LOAD_BALANCER, appmesh.IpPreference.IPV4_ONLY),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            ServiceDiscovery: {
              DNS: {
                Hostname: 'test',
                ResponseType: 'LOADBALANCER',
                IpPreference: 'IPv4_ONLY',
              },
            },
          },
        });
      });
    });

    describe('with CloudMap service discovery', () => {
      test('with basic configuration and without optional fields', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });
        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });
        const service = namespace.createService('Svc');

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            ServiceDiscovery: {
              AWSCloudMap: {
                NamespaceName: 'domain.local',
                ServiceName: { 'Fn::GetAtt': ['testnamespaceSvcB55702EC', 'Name'] },
              },
            },
          },
        });
      });

      test('has an IP Preference applied', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });
        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });
        const service = namespace.createService('Svc');

        // WHEN
        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service, undefined, appmesh.IpPreference.IPV4_ONLY),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
          Spec: {
            ServiceDiscovery: {
              AWSCloudMap: {
                NamespaceName: 'domain.local',
                ServiceName: { 'Fn::GetAtt': ['testnamespaceSvcB55702EC', 'Name'] },
                IpPreference: 'IPv4_ONLY',
              },
            },
          },
        });
      });
    });

    describe('with listener and without service discovery', () => {
      test('should throw an error', () => {
        // GIVEN
        const stack = new cdk.Stack();

        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
        });

        // WHEN + THEN
        expect(() => {
          new appmesh.VirtualNode(stack, 'test-node-2', {
            mesh,
            listeners: [appmesh.VirtualNodeListener.http()],
          });
        }).toThrow(/Service discovery information is required for a VirtualNode with a listener/);

        expect(() => {
          mesh.addVirtualNode('test-node-3', {
            listeners: [appmesh.VirtualNodeListener.http()],
          });
        }).toThrow(/Service discovery information is required for a VirtualNode with a listener/);

        expect(() => {
          node.addListener(appmesh.VirtualNodeListener.http());
        }).toThrow(/Service discovery information is required for a VirtualNode with a listener/);
      });
    });
  });
});
