import { expect, haveResourceLike } from '@aws-cdk/assert';
import { Test } from 'nodeunit';
import cdk = require('@aws-cdk/cdk');
import appmesh = require('../lib');

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

        const node = mesh.addVirtualNode('test-node', {
          hostname: 'test',
          namespaceName: 'domain.local',
          listeners: {
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
  },
};
