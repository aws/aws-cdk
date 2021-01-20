import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as acmpca from '@aws-cdk/aws-acmpca';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as appmesh from '../lib';

export = {
  'When an existing VirtualNode': {
    'with existing backends, adds new backend': {
      'should add resource with service backends'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const service1 = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceName: 'service1.domain.local',
          mesh,
        });
        const service2 = new appmesh.VirtualService(stack, 'service-2', {
          virtualServiceName: 'service2.domain.local',
          mesh,
        });

        const node = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test'),
          backends: [service1],
        });

        node.addBackend(service2);

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
          Spec: {
            Backends: [
              {
                VirtualService: {
                  VirtualServiceName: {
                    'Fn::GetAtt': ['service1A48078CF', 'VirtualServiceName'],
                  },
                },
              },
              {
                VirtualService: {
                  VirtualServiceName: {
                    'Fn::GetAtt': ['service27C65CF7D', 'VirtualServiceName'],
                  },
                },
              },
            ],
          },
        }));

        test.done();
      },
    },

    'when a single portmapping is added': {
      'should add the portmapping to the resource'(test: Test) {
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
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
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
        }));

        test.done();
      },
    },

    'when a listener is added with timeout': {
      'should add the listener timeout to the resource'(test: Test) {
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
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
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
        }));

        test.done();
      },
    },

    'when a listener is added with healthcheck ': {
      'should add a default listener healthcheck to the resource'(test: Test) {
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
            healthCheck: {},
            timeout: { idle: cdk.Duration.seconds(10) },
          })],
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              {
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
              },
            ],
          },
        }));

        test.done();
      },
    },

    'when a listener is added with healthcheck with user defined props': {
      'should add a listener healthcheck to the resource'(test: Test) {
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
          healthCheck: { timeout: cdk.Duration.seconds(3) },
          timeout: { idle: cdk.Duration.seconds(10) },
        }));

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
          Spec: {
            Listeners: [
              {
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
              },
            ],
          },
        }));

        test.done();
      },
    },

    'when a default backend is added': {
      'should add a backend default to the resource'(test: Test) {
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
          backendsDefaultClientPolicy: appmesh.ClientPolicy.acmTrust({
            certificateAuthorities: [acmpca.CertificateAuthority.fromCertificateAuthorityArn(stack, 'certificate', certificateAuthorityArn)],
            ports: [8080, 8081],
          }),
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
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
        }));

        test.done();
      },
    },

    'when a backend is added': {
      'should add a backend virtual service to the resource'(test: Test) {
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
          mesh,
          clientPolicy: appmesh.ClientPolicy.fileTrust({
            certificateChain: 'path-to-certificate',
            ports: [8080, 8081],
          }),
        });

        node.addBackend(service1);

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
          Spec: {
            Backends: [
              {
                VirtualService: {
                  VirtualServiceName: {
                    'Fn::GetAtt': ['service1A48078CF', 'VirtualServiceName'],
                  },
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
        }));

        test.done();
      },
    },

    'when a grpc listener is added with a TLS certificate from ACM': {
      'the listener should include the TLS configuration'(test: Test) {
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
            tlsCertificate: appmesh.TlsCertificate.acm({
              certificate: cert,
              tlsMode: appmesh.TlsMode.STRICT,
            }),
          },
          )],
        });

        // THEN

        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
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
    },

    'when an http listener is added with a TLS certificate from file': {
      'the listener should include the TLS configuration'(test: Test) {
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
            tlsCertificate: appmesh.TlsCertificate.file({
              certificateChainPath: 'path/to/certChain',
              privateKeyPath: 'path/to/privateKey',
              tlsMode: appmesh.TlsMode.STRICT,
            }),
          })],
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
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
    },

    'when an http listener is added with the TLS mode permissive': {
      'the listener should include the TLS configuration'(test: Test) {
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
            tlsCertificate: appmesh.TlsCertificate.file({
              certificateChainPath: 'path/to/certChain',
              privateKeyPath: 'path/to/privateKey',
              tlsMode: appmesh.TlsMode.PERMISSIVE,
            }),
          })],
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
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
  },

  'Can import Virtual Nodes using an ARN'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualNodeName = 'test-node';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualNode/${virtualNodeName}`;

    // WHEN
    const virtualNode = appmesh.VirtualNode.fromVirtualNodeArn(
      stack, 'importedVirtualNode', arn);
    // THEN
    test.equal(virtualNode.mesh.meshName, meshName);
    test.equal(virtualNode.virtualNodeName, virtualNodeName);

    test.done();
  },
  'Can import Virtual Nodes using attributes'(test: Test) {
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
    test.equal(virtualNode.mesh.meshName, meshName);
    test.equal(virtualNode.virtualNodeName, virtualNodeName);

    test.done();
  },
};
