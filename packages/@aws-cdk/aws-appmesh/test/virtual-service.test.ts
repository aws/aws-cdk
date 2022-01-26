import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as appmesh from '../lib';

describe('virtual service', () => {
  test('Can import Virtual Services using an ARN', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualServiceName = 'virtual-service';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualService/${virtualServiceName}`;
    // WHEN
    const virtualRouter = appmesh.VirtualRouter.fromVirtualRouterArn(stack, 'importedVirtualRouter', arn);
    // THEN
    expect(virtualRouter.mesh.meshName).toEqual(meshName);
    expect(virtualRouter.virtualRouterName).toEqual(virtualServiceName);
  });

  test('Can import Virtual Services using attributes', () => {
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
    expect(virtualService.mesh.meshName).toEqual(meshName);
    expect(virtualService.virtualServiceName).toEqual(virtualServiceName);
  });

  describe('When adding a VirtualService to a mesh', () => {
    describe('with single virtual router provider resource', () => {
      test('should create service', () => {
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
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualService', {
            Spec: {
              Provider: {
                VirtualRouter: {
                  VirtualRouterName: {
                    'Fn::GetAtt': ['meshtestrouterF78D72DD', 'VirtualRouterName'],
                  },
                },
              },
            },
            MeshOwner: Match.absent(),
          });
      });
    });

    describe('with single virtual node provider resource', () => {
      test('should create service', () => {
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
        Template.fromStack(stack).
          hasResourceProperties('AWS::AppMesh::VirtualService', {
            Spec: {
              Provider: {
                VirtualNode: {
                  VirtualNodeName: {
                    'Fn::GetAtt': ['meshtestnodeF93946D4', 'VirtualNodeName'],
                  },
                },
              },
            },
          });
      });
    });
  });

  describe('When creating a VirtualService', () => {
    describe('with shared service mesh', () => {
      test('Mesh Owner is the AWS account ID of the account that shared the mesh with your account', () => {
        // GIVEN
        const app = new cdk.App();
        const meshEnv = { account: '1234567899', region: 'us-west-2' };
        const virtualServiceEnv = { account: '9987654321', region: 'us-west-2' };

        // Creating stack in Account B
        const stack = new cdk.Stack(app, 'mySharedStack', { env: virtualServiceEnv });
        // Mesh is in Account A
        const sharedMesh = appmesh.Mesh.fromMeshArn(stack, 'shared-mesh',
          `arn:aws:appmesh:${meshEnv.region}:${meshEnv.account}:mesh/shared-mesh`);

        const node = sharedMesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
        });

        // WHEN
        new appmesh.VirtualService(stack, 'test-node', {
          virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(node),
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::AppMesh::VirtualService', {
          MeshOwner: meshEnv.account,
        });
      });
    });
  });
});
