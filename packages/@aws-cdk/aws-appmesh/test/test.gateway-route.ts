import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When creating a GatewayRoute': {
    'should have expected defaults'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      const virtualGateway = new appmesh.VirtualGateway(stack, 'gateway-1', {
        listeners: [{}],
        mesh: mesh,
      });

      virtualGateway.addGatewayRoute('gateway-route', {
        virtualGateway: virtualGateway,
        gatewayRouteName: 'gateway-route',
      });

      // THEN
      expect(stack).to(
        haveResourceLike('AWS::AppMesh::GatewayRoute', {
          GatewayRouteName: 'gateway-route',
        }),
      );

      test.done();
    },
  },
};