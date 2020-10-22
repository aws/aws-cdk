import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'Can export existing route and re-import'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    const virtualRouter = new appmesh.VirtualRouter(stack, 'router', {
      mesh,
    });

    const service1 = new appmesh.VirtualService(stack, 'service-1', {
      virtualServiceName: 'service1.domain.local',
      mesh,
    });

    const node = mesh.addVirtualNode('test-node', {
      dnsHostName: 'test',
      listener: {
        portMapping:
          {
            port: 8080,
            protocol: appmesh.Protocol.HTTP,
          },
      },
      backends: [
        service1,
      ],
    });

    new appmesh.Route(stack, 'route-1', {
      mesh,
      virtualRouter: virtualRouter,
      routeTargets: [
        {
          virtualNode: node,
          weight: 50,
        },
      ],
      prefix: '/',
    });

    const stack2 = new cdk.Stack();
    const routeName = 'imported-route';
    const importedRoute = appmesh.Route.fromRouteAttributes(stack2, 'imported-route', { virtualRouter, routeName });

    // Nothing to do with imported route yet
    test.equal(importedRoute.routeName, routeName);

    test.done();
  },
};
