import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
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
            egressFilter: appmesh.MeshFilterType.Allow_All,
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

        // THEN
        test.throws(() => {
          mesh.addVirtualService('service', {
            virtualServiceName: 'test-service.domain.local',
            virtualNodeName: 'test-node',
            virtualRouterName: 'test-router',
          });
        });

        test.done();
      },
    },
    'with single provider resource': {
      'should create service'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualService('service', {
          virtualServiceName: 'test-service.domain.local',
          virtualRouterName: 'test-router',
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualService', {
            Spec: {
              Provider: {
                VirtualRouter: {
                  VirtualRouterName: 'test-router',
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

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespaceName: 'domain.local',
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshAppMeshD6FCBDD7', 'MeshName'],
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

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespaceName: 'domain.local',
          listeners: {
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
              'Fn::GetAtt': ['meshAppMeshD6FCBDD7', 'MeshName'],
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

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespaceName: 'domain.local',
          listeners: {
            portMappings: [
              {
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
              },
            ],
            healthChecks: [
              {
                healthyThreshold: 3,
                interval: 5000, // min
                path: '/',
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
                timeout: 2000, // min
                unhealthyThreshold: 2,
              },
            ],
          },
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshAppMeshD6FCBDD7', 'MeshName'],
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

        // THEN
        test.throws(() => {
          mesh.addVirtualNode('test-node', {
            hostname: 'test',
            namespaceName: 'domain.local',
            listeners: {
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
                  interval: 5000, // min
                  path: '/',
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                  timeout: 2000, // min
                  unhealthyThreshold: 2,
                },
              ],
            },
          });
        });
        test.throws(() => {
          mesh.addVirtualNode('test-node', {
            hostname: 'test',
            namespaceName: 'domain.local',
            listeners: {
              portMappings: [
                {
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                },
              ],
              healthChecks: [
                {
                  healthyThreshold: 3,
                  interval: 5000, // min
                  path: '/',
                  port: 8080,
                  protocol: appmesh.Protocol.HTTP,
                  timeout: 2000, // min
                  unhealthyThreshold: 2,
                },
                {
                  healthyThreshold: 5,
                  interval: 5000, // min
                  path: '/path2',
                  port: 8081,
                  protocol: appmesh.Protocol.TCP,
                  timeout: 3000, // min
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

        mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespaceName: 'domain.local',
          listeners: {
            portMappings: [
              {
                port: 8080,
                protocol: appmesh.Protocol.HTTP,
              },
            ],
          },
          backends: [
            {
              virtualServiceName: `test.service.backend`,
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
                    VirtualServiceName: 'test.service.backend',
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
};
