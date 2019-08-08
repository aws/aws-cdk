import { expect, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';

import appmesh = require('../lib');
import { Protocol } from '../lib';

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

        const vpc = new ec2.Vpc(stack, 'vpc');
        const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
          vpc,
          name: 'domain.local',
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

        node.addBackend({
          virtualService: service2,
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            Spec: {
              Backends: [
                {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['service1VirtualService34F32322', 'VirtualServiceName'],
                    },
                  },
                },
                {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['service2VirtualService95387A49', 'VirtualServiceName'],
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

        node.addPortMapping({
          port: 8081,
          protocol: Protocol.TCP,
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            Spec: {
              Listeners: [
                {
                  PortMapping: {
                    Port: 8080,
                    Protocol: 'http',
                  },
                },
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

    const stack2 = new cdk.Stack();

    const node2 = appmesh.VirtualNode.fromVirtualNodeName(stack2, 'imported-node', mesh.meshName, node.virtualNodeName);

    node2.addPortMapping({
      port: 8081,
      protocol: Protocol.TCP,
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
          ServiceDiscovery: {
            DNS: {
              Hostname: 'test.domain.local',
            },
          },
        },
        VirtualNodeName: 'test-node',
      })
    );

    test.done();
  },
};
