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

  'When defining a VirtualServiceProvider': {
    'Should throw when the VirtualService and Provider are in different meshes'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });
      const mesh2 = new appmesh.Mesh(stack, 'mesh2', {
        meshName: 'test-mesh-2',
      });
      const differentMeshVn = mesh2.addVirtualNode('testVn');
      test.throws(() =>
        mesh.addVirtualService('testVS', {
          virtualServiceName: 'testVS',
          virtualServiceProvider: appmesh.VirtualServiceProvider.virtualNode(differentMeshVn),
        }), /Virtual Service provider must belong to mesh/);

      test.done();
    },
  },
};
