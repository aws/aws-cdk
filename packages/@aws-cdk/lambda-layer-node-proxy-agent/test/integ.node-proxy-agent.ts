
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as integ from '@aws-cdk/integ-tests';

import { NodeProxyAgentLayer } from '../lib';

/**
 * Test verifies that node-proxy-agent is invoked successfully inside Lambda runtime.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-layer-node-proxy-agent-integ-stack');
const layer = new NodeProxyAgentLayer(stack, 'NodeProxyAgentLayer');

const provider = new cr.Provider(stack, 'ProviderNode14', {
  onEventHandler: new lambda.Function(stack, 'Lambda$Node14', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    layers: [layer],
    memorySize: 512,
    timeout: cdk.Duration.seconds(30),
  }),
});

new cdk.CustomResource(stack, 'CustomResourceNode14', {
  serviceToken: provider.serviceToken,
});

new integ.IntegTest(app, 'lambda-layer-node-proxy-agent-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});