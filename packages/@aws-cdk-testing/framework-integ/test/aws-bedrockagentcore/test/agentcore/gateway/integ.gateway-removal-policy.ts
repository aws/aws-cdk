import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayRemovalPolicyIntegTest', {
});

// Verify applyRemovalPolicy works on the Gateway L2 (sets DeletionPolicy/UpdateReplacePolicy on the CfnGateway)
const gateway = new agentcore.Gateway(stack, 'RemovalPolicyGateway', {
  gatewayName: 'integ-test-removal-policy-gateway',
  description: 'Gateway used to verify applyRemovalPolicy on the L2',
  authorizerConfiguration: agentcore.GatewayAuthorizer.withNoAuth(),
});

gateway.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

new integ.IntegTest(app, 'GatewayRemovalPolicyIntegTest', {
  testCases: [stack],
});
