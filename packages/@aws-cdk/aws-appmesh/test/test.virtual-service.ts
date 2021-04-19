import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'Can import Virtual Services using an ARN'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualServiceName = 'virtual-service';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualService/${virtualServiceName}`;
    // WHEN
    const virtualRouter = appmesh.VirtualRouter.fromVirtualRouterArn(stack, 'importedVirtualRouter', arn);
    // THEN
    test.equal(virtualRouter.mesh.meshName, meshName);
    test.equal(virtualRouter.virtualRouterName, virtualServiceName);

    test.done();
  },

  'Can import Virtual Services using attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualServiceName = 'virtual-service';

    // WHEN
    const virtualService = appmesh.VirtualService.fromVirtualServiceAttributes(stack, 'importedVirtualService', {
      mesh: appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName),
      virtualServiceName: virtualServiceName,
    });
    // THEN
    test.equal(virtualService.mesh.meshName, meshName);
    test.equal(virtualService.virtualServiceName, virtualServiceName);

    test.done();
  },

  'When adding a VirtualService to a mesh': {
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

        new appmesh.VirtualService(stack, 'service', {
          virtualServiceName: 'test-service.domain.local',
          virtualServiceProvider: appmesh.VirtualServiceProvider.virtualRouter(testRouter),
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

        new appmesh.VirtualService(stack, 'service2', {
          virtualServiceName: 'test-service.domain.local',
          virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
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

  'Can grant an identity all read permissions for a given VirtualService'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });
    const node = new appmesh.VirtualNode(stack, 'test-node', {
      mesh,
      listeners: [appmesh.VirtualNodeListener.http({
        port: 80,
        tlsCertificate: appmesh.TlsCertificate.file({
          certificateChainPath: 'path/to/certChain',
          privateKeyPath: 'path/to/privateKey',
          tlsMode: appmesh.TlsMode.PERMISSIVE,
        }),
      })],
    });

    const myService = new appmesh.VirtualService(stack, 'service2', {
      virtualServiceName: 'test-service.domain.local',
      virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
    });

    // WHEN
    const user = new iam.User(stack, 'test');
    myService.grantRead(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'appmesh:DescribeVirtualService',
              'appmesh:ListVirtualService',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'service2B2862B6B',
            },
          },
        ],
      },
    }));

    test.done();
  },

  'Can grant an identity all write permissions for a given VirtualService'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });
    const node = new appmesh.VirtualNode(stack, 'test-node', {
      mesh,
      listeners: [appmesh.VirtualNodeListener.http({
        port: 80,
        tlsCertificate: appmesh.TlsCertificate.file({
          certificateChainPath: 'path/to/certChain',
          privateKeyPath: 'path/to/privateKey',
          tlsMode: appmesh.TlsMode.PERMISSIVE,
        }),
      })],
    });

    const myService = new appmesh.VirtualService(stack, 'service2', {
      virtualServiceName: 'test-service.domain.local',
      virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
    });

    // WHEN
    const user = new iam.User(stack, 'test');
    myService.grantWrite(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'appmesh:CreateVirtualService',
              'appmesh:UpdateVirtualService',
              'appmesh:DeleteVirtualService',
              'appmesh:TagResource',
              'appmesh:UntagResource',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'service2B2862B6B',
            },
          },
        ],
      },
    }));

    test.done();
  },
};
