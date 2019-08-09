import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';

import appmesh = require('../lib');

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
              EgressFilter: {
                Type: 'DROP_ALL',
              },
            },
          })
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
          meshSpec: {
            egressFilter: appmesh.MeshFilterType.ALLOW_ALL,
          },
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::Mesh', {
            Spec: {
              EgressFilter: {
                Type: 'ALLOW_ALL',
              },
            },
          })
        );

        test.done();
      },
    },
  },

  'When adding a Virtual Router to existing mesh': {
    'with empty portMappings array': {
      'should throw error'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        // THEN
        test.throws(() => {
          mesh.addVirtualRouter('router', { portMappings: [] });
        });

        test.done();
      },
    },
    'with at least one complete port mappings': {
      'shoulld create proper router'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualRouter('router', {
          portMappings: [
            {
              port: 8080,
              protocol: appmesh.Protocol.HTTP,
            },
          ],
        });

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
          })
        );

        test.done();
      },
    },
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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        const testNode = new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          hostname: 'test-node',
          namespace,
        });

        const testRouter = mesh.addVirtualRouter('router', {
          portMappings: [
            {
              port: 8080,
              protocol: appmesh.Protocol.HTTP,
            },
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
          portMappings: [
            {
              port: 8080,
              protocol: appmesh.Protocol.HTTP,
            },
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
          })
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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        const node = mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespace,
          listener: {
            portMappings: [
              {
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
              },
            ],
          },
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
          })
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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespace,
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              Backends: [],
              Listeners: [],
            },
          })
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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespace,
          listener: {
            portMappings: [
              {
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
              },
            ],
          },
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
          })
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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespace,
          listener: {
            portMappings: [
              {
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
              },
            ],
            healthChecks: [
              {
                healthyThreshold: 3,
                path: '/',
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
                interval: cdk.Duration.seconds(5), // min
                timeout: cdk.Duration.seconds(2), // min
                unhealthyThreshold: 2,
              },
            ],
          },
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
          })
        );

        test.done();
      },
    },
    'with portMappings and healthChecks !== in length': {
      'should throw error'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        // THEN
        test.throws(() => {
          mesh.addVirtualNode('test-node', {
            hostname: 'test',
            namespace,
            listener: {
              portMappings: [
                {
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                },
                {
                  port: 8081,
                  protocol: appmesh.Protocol.TCP,
                },
              ],
              healthChecks: [
                {
                  healthyThreshold: 3,
                  path: '/',
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                  interval: cdk.Duration.seconds(5), // min
                  timeout: cdk.Duration.seconds(2), // min
                  unhealthyThreshold: 2,
                },
              ],
            },
          });
        });
        test.throws(() => {
          mesh.addVirtualNode('test-node', {
            hostname: 'test',
            namespace,
            listener: {
              portMappings: [
                {
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                },
              ],
              healthChecks: [
                {
                  healthyThreshold: 3,
                  path: '/',
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                  interval: cdk.Duration.seconds(5), // min
                  timeout: cdk.Duration.seconds(2), // min
                  unhealthyThreshold: 2,
                },
                {
                  healthyThreshold: 5,
                  path: '/path2',
                  port: 8081,
                  protocol: appmesh.Protocol.TCP,
                  interval: cdk.Duration.seconds(5), // min
                  timeout: cdk.Duration.seconds(3), // min
                  unhealthyThreshold: 5,
                },
              ],
            },
          });
        });

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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
        });

        const service1 = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceName: 'service1.domain.local',
          mesh,
        });

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespace,
          listener: {
            portMappings: [
              {
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
              },
            ],
          },
          backends: [
            {
              virtualService: service1,
            },
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
          })
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
      })
    );

    test.done();
  },
};
