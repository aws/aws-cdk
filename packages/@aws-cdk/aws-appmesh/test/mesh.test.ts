import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import * as appmesh from '../lib';

describe('mesh', () => {
  describe('When creating a Mesh', () => {
    describe('with no spec applied', () => {
      test('should defaults to DROP_ALL egress filter', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', { meshName: 'test-mesh' });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::Mesh', {
            Spec: {
            },
          });
      });
    });

    describe('with spec applied', () => {
      test('should take IP preference from props', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
          serviceDiscovery: {
            ipPreference: appmesh.IpPreference.IPV4_ONLY,
          },
        });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::Mesh', {
            Spec: {
              ServiceDiscovery: {
                IpPreference: 'IPv4_ONLY',
              },
            },
          });
      });

      test('should take egress filter from props', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
          egressFilter: appmesh.MeshFilterType.ALLOW_ALL,
        });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::Mesh', {
            Spec: {
              EgressFilter: {
                Type: 'ALLOW_ALL',
              },
            },
          });
      });
    });
  });

  describe('When adding a Virtual Router to existing mesh', () => {
    describe('with at least one complete port mappings', () => {
      test('should create proper router', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualRouter('router');

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualRouter', {
            Spec: {
              Listeners: [
                {
                  PortMapping: {
                    Port: 8080,
                    Protocol: 'http',
                  },
                },
              ],
            },
          });
      });
    });
  });

  test('VirtualService can use CloudMap service', () => {
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

  test('VirtualService can use CloudMap service with instanceAttributes', () => {
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

    const instanceAttribute : { [key: string]: string} = {};
    instanceAttribute.testKey = 'testValue';

    // WHEN
    new appmesh.VirtualNode(stack, 'test-node', {
      mesh,
      serviceDiscovery: appmesh.ServiceDiscovery.cloudMap(service, instanceAttribute),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualNode', {
      Spec: {
        ServiceDiscovery: {
          AWSCloudMap: {
            NamespaceName: 'domain.local',
            ServiceName: { 'Fn::GetAtt': ['testnamespaceSvcB55702EC', 'Name'] },
            Attributes: [
              {
                Key: 'testKey',
                Value: 'testValue',
              },
            ],
          },
        },
      },
    });
  });

  describe('When adding a VirtualNode to a mesh', () => {
    describe('with empty default listeners and backends', () => {
      test('should create default resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
        });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              // Specifically: no Listeners and Backends
              ServiceDiscovery: {
                DNS: {
                  Hostname: 'test.domain.local',
                },
              },
            },
          });
      });
    });
    describe('with added listeners', () => {
      test('should create listener resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
        });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              Listeners: [
                {
                  PortMapping: {
                    Port: 8080,
                    Protocol: 'http',
                  },
                },
              ],
            },
          });
      });
    });
    describe('with added listeners with healthchecks', () => {
      test('should create healthcheck resource', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
            healthCheck: appmesh.HealthCheck.http({
              healthyThreshold: 3,
              path: '/',
              interval: cdk.Duration.seconds(5), // min
              timeout: cdk.Duration.seconds(2), // min
              unhealthyThreshold: 2,
            }),
          })],
        });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              Listeners: [
                Match.objectLike({
                  HealthCheck: {
                    HealthyThreshold: 3,
                    IntervalMillis: 5000,
                    Path: '/',
                    Port: 8080,
                    Protocol: 'http',
                    TimeoutMillis: 2000,
                    UnhealthyThreshold: 2,
                  },
                }),
              ],
            },
          });
      });
    });
    describe('with backends', () => {
      test('should create resource with service backends', () => {
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

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
          backends: [appmesh.Backend.virtualService(service1)],
        });

        // THEN
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualNode', {
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
    });
  });
  test('Can construct a mesh from a name', () => {
    // WHEN
    const stack2 = new cdk.Stack();
    const mesh2 = appmesh.Mesh.fromMeshName(stack2, 'imported-mesh', 'abc');

    new appmesh.VirtualService(stack2, 'service', {
      virtualServiceName: 'test.domain.local',
      virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh2),
    });

    // THEN
    Template.fromStack(stack2).
      hasResourceProperties('AWS::AppMesh::VirtualService', {
        MeshName: 'abc',
        Spec: {},
        VirtualServiceName: 'test.domain.local',
      });
  });
});
