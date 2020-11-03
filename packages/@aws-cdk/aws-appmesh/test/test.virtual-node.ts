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
          }),
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
          },
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
          }),
        );

        test.done();
      },
    },
  },
  'Can import Virtual Nodes using ARN and attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualNodeName = 'test-node';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualNode/${virtualNodeName}`;

    // WHEN
    const virtualNode1 = appmesh.VirtualNode.fromVirtualNodeAttributes(stack, 'importedVirtualNode1', {
      mesh: appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName),
      virtualNodeName: virtualNodeName,
    });
    // THEN
    test.equal(virtualNode1.mesh.meshName, meshName);
    test.equal(virtualNode1.virtualNodeName, virtualNodeName);

    // WHEN
    const virtualNode2 = appmesh.VirtualNode.fromVirtualNodeArn(
      stack, 'importedVirtualNode2', arn);
    // THEN
    test.equal(virtualNode2.mesh.meshName, meshName);
    test.equal(virtualNode2.virtualNodeName, virtualNodeName);

    test.done();
  },
};
