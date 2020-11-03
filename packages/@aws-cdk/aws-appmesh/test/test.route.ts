import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'Can import Routes using ARN and attributes'(test: Test) {
    const app = new cdk.App();
    // GIVEN
    const stack = new cdk.Stack(app, 'Imports', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const meshName = 'test-mesh';
    const virtualRouterName = 'test-virtual-router';
    const routeName = 'test-route';
    const arn = `arn:aws:appmesh:us-east-1:123456789012:mesh/${meshName}/virtualRouter/${virtualRouterName}/gatewayRoute/${routeName}`;

    // WHEN
    const mesh = appmesh.Mesh.fromMeshName(stack, 'Mesh', meshName);
    const virtualRouter = mesh.addVirtualRouter('VirtualGateway', {
      virtualRouterName: virtualRouterName,
    });
    const route1 = appmesh.Route.fromRouteAttributes(stack, 'importedRoute1', { routeName, virtualRouter });
    // THEN
    test.equal(route1.routeName, routeName);
    // test.equal(route1.virtualRouter.virtualRouterName, virtualRouterName);
    test.equal(route1.virtualRouter.mesh.meshName, meshName);
    // WHEN
    const route2 = appmesh.Route.fromRouteArn(stack, 'importedRoute2', arn);
    // THEN
    test.equal(route2.routeName, routeName);
    test.equal(route2.virtualRouter.virtualRouterName, virtualRouterName);
    test.equal(route2.virtualRouter.mesh.meshName, meshName);
    test.done();
  },
};
