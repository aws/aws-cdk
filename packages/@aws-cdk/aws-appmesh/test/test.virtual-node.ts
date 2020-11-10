import { expect, haveResourceLike } from '@aws-cdk/assert';
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
          dnsHostName: 'test',
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
          dnsHostName: 'test',
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
          dnsHostName: 'test',
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
          dnsHostName: 'test',
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
          dnsHostName: 'test',
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
