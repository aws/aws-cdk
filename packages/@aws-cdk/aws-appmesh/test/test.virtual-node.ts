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
          listener: {},
          backends: [service1],
        });

        node.addBackends(service2);

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
                {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['service27C65CF7D', 'VirtualServiceName'],
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
    'when a single portmapping is added': {
      'should add the portmapping to the resoource'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const node = mesh.addVirtualNode('test-node', {
          dnsHostName: 'test',
        });

        node.addListeners({
          portMapping: {
            port: 8081,
            protocol: appmesh.Protocol.TCP,
          }
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
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
          })
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
      listener: {},
    });

    const stack2 = new cdk.Stack();

    const node2 = appmesh.VirtualNode.fromVirtualNodeName(stack2, 'imported-node', mesh.meshName, node.virtualNodeName);

    node2.addListeners({
      portMapping: {
        port: 8081,
        protocol: appmesh.Protocol.TCP,
      }
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
          ServiceDiscovery: {
            DNS: {
              Hostname: 'test.domain.local',
            },
          },
        },
        VirtualNodeName: 'meshtestnode428A9479',
      })
    );

    test.done();
  },
};
