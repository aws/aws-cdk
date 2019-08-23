import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';

import appmesh = require('../lib');

export = {
  'Can export existing route and re-import'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    const router = new appmesh.VirtualRouter(stack, 'router', {
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

    const route = new appmesh.Route(stack, 'route-1', {
      mesh,
      virtualRouter: router,
      routeTargets: [
        {
          virtualNode: node,
          weight: 50,
        },
      ],
      prefix: '/',
    });

    const stack2 = new cdk.Stack();
    appmesh.Route.fromRouteName(stack2, 'imported-route', mesh.meshName, router.virtualRouterName, route.routeName);

    // Nothing to do with imported route yet

    test.done();
  },
};
