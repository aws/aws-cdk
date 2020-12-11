import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When creating a Mesh': {
    'with no spec applied': {
      'should defaults to DROP_ALL egress filter'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', { meshName: 'test-mesh' });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::Mesh', {
            Spec: {
            },
          }),
        );

        test.done();
      },
    },

    'with spec applied': {
      'should take egress filter from props'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
          egressFilter: appmesh.MeshFilterType.ALLOW_ALL,
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::Mesh', {
            Spec: {
              EgressFilter: {
                Type: 'ALLOW_ALL',
              },
            },
          }),
        );

        test.done();
      },
    },
  },

  'When adding a Virtual Router to existing mesh': {
    'with at least one complete port mappings': {
      'should create proper router'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualRouter('router');

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualRouter', {
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
          }),
        );

        test.done();
      },
    },
  },

  'VirtualService can use CloudMap service'(test: Test) {
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
      serviceDiscovery: appmesh.ServiceDiscovery.cloudMap({
        service: service,
      }),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
      Spec: {
        ServiceDiscovery: {
          AWSCloudMap: {
            NamespaceName: 'domain.local',
            ServiceName: { 'Fn::GetAtt': ['testnamespaceSvcB55702EC', 'Name'] },
          },
        },
      },
    }));

    test.done();
  },

  'When adding a VirtualService to a mesh': {
    'with VirtualRouter and VirtualNode as providers': {
      'should throw error'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const testNode = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test-node'),
        });

        const testRouter = mesh.addVirtualRouter('router', {
          listeners: [
            appmesh.VirtualRouterListener.http(),
          ],
        });

        // THEN
        test.throws(() => {
          mesh.addVirtualService('service', {
            virtualServiceName: 'test-service.domain.local',
            virtualNode: testNode,
            virtualRouter: testRouter,
          });
        });

        test.done();
      },
    },
    'with single virtual router provider resource': {
      'should create service'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const testRouter = mesh.addVirtualRouter('test-router', {
          listeners: [
            appmesh.VirtualRouterListener.http(),
          ],
        });

        mesh.addVirtualService('service', {
          virtualServiceName: 'test-service.domain.local',
          virtualRouter: testRouter,
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualService', {
            Spec: {
              Provider: {
                VirtualRouter: {
                  VirtualRouterName: {
                    'Fn::GetAtt': ['meshtestrouterF78D72DD', 'VirtualRouterName'],
                  },
                },
              },
            },
          }),
        );

        test.done();
      },
    },
    'with single virtual node provider resource': {
      'should create service'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
        });

        mesh.addVirtualService('service2', {
          virtualServiceName: 'test-service.domain.local',
          virtualNode: node,
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualService', {
            Spec: {
              Provider: {
                VirtualNode: {
                  VirtualNodeName: {
                    'Fn::GetAtt': ['meshtestnodeF93946D4', 'VirtualNodeName'],
                  },
                },
              },
            },
          }),
        );

        test.done();
      },
    },
  },
  'When adding a VirtualNode to a mesh': {
    'with empty default listeners and backends': {
      'should create default resource'(test: Test) {
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
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualNode', {
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
          }),
        );

        test.done();
      },
    },
    'with added listeners': {
      'should create listener resource'(test: Test) {
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
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
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
          }),
        );

        test.done();
      },
    },
    'with added listeners with healthchecks': {
      'should create healthcheck resource'(test: Test) {
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
            healthCheck: {
              healthyThreshold: 3,
              path: '/',
              interval: cdk.Duration.seconds(5), // min
              timeout: cdk.Duration.seconds(2), // min
              unhealthyThreshold: 2,
            },
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              Listeners: [
                {
                  HealthCheck: {
                    HealthyThreshold: 3,
                    IntervalMillis: 5000,
                    Path: '/',
                    Port: 8080,
                    Protocol: 'http',
                    TimeoutMillis: 2000,
                    UnhealthyThreshold: 2,
                  },
                },
              ],
            },
          }),
        );

        test.done();
      },
    },
    'with backends': {
      'should create resource with service backends'(test: Test) {
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

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
          backends: [
            service1,
          ],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            Spec: {
              Backends: [
                {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['service1A48078CF', 'VirtualServiceName'],
                    },
                  },
                },
              ],
            },
          }),
        );

        test.done();
      },
    },
  },
  'Can construct a mesh from a name'(test: Test) {
    // WHEN
    const stack2 = new cdk.Stack();
    const mesh2 = appmesh.Mesh.fromMeshName(stack2, 'imported-mesh', 'abc');

    mesh2.addVirtualService('service', {
      virtualServiceName: 'test.domain.local',
    });

    // THEN
    expect(stack2).to(
      haveResourceLike('AWS::AppMesh::VirtualService', {
        MeshName: 'abc',
        Spec: {},
        VirtualServiceName: 'test.domain.local',
      }),
    );

    test.done();
  },
};
