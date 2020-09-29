import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When creating a VirtualGateway': {
    'should have expected defaults'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const mesh = new appmesh.Mesh(stack, 'mesh', {
        meshName: 'test-mesh',
      });

      new appmesh.VirtualGateway(stack, 'gateway-1', {
        listeners: [{}],
        mesh: mesh,
      });

      expect(stack).to(
        haveResourceLike('AWS::AppMesh::VirtualGateway', {
          Spec: {
            Listeners: [
              {
                PortMapping: {
                  Port: 8080,
                  Protocol: appmesh.Protocol.HTTP,
                },
              },
            ],
          },
          VirtualGatewayName: 'gateway1',
        }),
      );
      test.done();
    },
  },
};