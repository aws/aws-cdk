
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as integ from '@aws-cdk/integ-tests-alpha';

import { NodeProxyAgentLayer } from 'aws-cdk-lib/lambda-layer-node-proxy-agent';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * Test verifies that node-proxy-agent is invoked successfully inside Lambda runtime.
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new cdk.Stack(app, 'lambda-layer-node-proxy-agent-integ-stack');
const layer = new NodeProxyAgentLayer(stack, 'NodeProxyAgentLayer');

const provider = new cr.Provider(stack, 'ProviderNode', {
  onEventHandler: new lambda.Function(stack, 'Lambda$Node', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
    handler: 'index.handler',
    runtime: STANDARD_NODEJS_RUNTIME,
    layers: [layer],
    memorySize: 512,
    timeout: cdk.Duration.seconds(30),
  }),
});

new cdk.CustomResource(stack, 'CustomResourceNode', {
  serviceToken: provider.serviceToken,
});

new integ.IntegTest(app, 'lambda-layer-node-proxy-agent-integ-test', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
