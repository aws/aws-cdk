import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'Can import Virtual Services using ARN and attributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const meshName = 'testMesh';
    const virtualServiceName = 'virtual-service';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualService/${virtualServiceName}`;

    // WHEN
    const virtualService1 = appmesh.VirtualService.fromVirtualServiceAttributes(stack, 'importedVirtualService1', {
      mesh: appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName),
      virtualServiceName: virtualServiceName,
    });
    // THEN
    test.equal(virtualService1.mesh.meshName, meshName);
    test.equal(virtualService1.virtualServiceName, virtualServiceName);

    // WHEN
    const virtualRouter2 = appmesh.VirtualRouter.fromVirtualRouterArn(stack, 'importedVirtualRouter2', arn);
    // THEN
    test.equal(virtualRouter2.mesh.meshName, meshName);
    test.equal(virtualRouter2.virtualRouterName, virtualServiceName);

    test.done();
  },
};
