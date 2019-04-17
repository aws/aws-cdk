import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import cdk = require('@aws-cdk/cdk');
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

        const vpc = ec2.VpcNetwork.import(stack, 'vpc', {
          vpcId: '123456',
          availabilityZones: ['us-east-1'],
        });
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
          backends: [
            {
              virtualServiceName: `test.service.backend`,
            },
          ],
        });

        node.addBackend({
          virtualServiceName: `test2.service.backend`,
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
                {
                  VirtualService: {
                    VirtualServiceName: 'test2.service.backend',
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

        const vpc = ec2.VpcNetwork.import(stack, 'vpc', {
          vpcId: '123456',
          availabilityZones: ['us-east-1'],
        });
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
};
