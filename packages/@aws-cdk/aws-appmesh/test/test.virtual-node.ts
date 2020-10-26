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

        node.addBackends(service2);

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            Spec: {
              Listeners: [{
                PortMapping: {
                  Port: 8080,
                  Protocol: 'http',
                },
              }],
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
          }),
        );

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

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          dnsHostName: 'test',
          listeners: [appmesh.VirtualNodeListener.httpNodeListener({
            port: 8081,
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            Spec: {
              Listeners: [
                {
                  PortMapping: {
                    Port: 8081,
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
          listeners: [appmesh.VirtualNodeListener.grpcNodeListener({
            port: 80,
            timeout: {
              idle: cdk.Duration.seconds(10),
              perRequest: cdk.Duration.seconds(10),
            },
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
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
          }),
        );

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
          listeners: [appmesh.VirtualNodeListener.http2NodeListener({
            port: 80,
            healthCheck: {},
            timeout: { idle: cdk.Duration.seconds(10) },
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
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
          }),
        );

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

        new appmesh.VirtualNode(stack, 'test-node', {
          mesh,
          dnsHostName: 'test',
          listeners: [appmesh.VirtualNodeListener.tcpNodeListener({
            port: 80,
            healthCheck: { timeout: cdk.Duration.seconds(3) },
            timeout: { idle: cdk.Duration.seconds(10) },
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
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
          }),
        );

        test.done();
      },
    },
  },
  'Can export and import VirtualNode and perform actions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    const node = mesh.addVirtualNode('test-node', {
      dnsHostName: 'test.domain.local',
    });

    const stack2 = new cdk.Stack();

    const node2 = appmesh.VirtualNode.fromVirtualNodeName(stack2, 'imported-node', mesh.meshName, node.virtualNodeName);

    node2.addListeners([appmesh.VirtualNodeListener.httpNodeListener({
      port: 8081,
    })]);

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
          ServiceDiscovery: {
            DNS: {
              Hostname: 'test.domain.local',
            },
          },
        },
        VirtualNodeName: 'meshtestnode428A9479',
      }),
    );

    test.done();
  },
};
