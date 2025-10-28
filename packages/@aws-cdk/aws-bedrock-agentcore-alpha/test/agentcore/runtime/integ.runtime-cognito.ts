import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-cognito');

const userPool = new cognito.UserPool(stack, 'MyUserPool', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const userPoolClient = userPool.addClient('MyUserPoolClient', {});

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Create a single runtime (similar to the working strands example)
const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime_cognito',
  agentRuntimeArtifact: runtimeArtifact,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  authorizerConfiguration: agentcore.RuntimeAuthorizerConfiguration.usingCognito(userPool, userPoolClient),
});

// Output runtime and endpoint information for verification
new cdk.CfnOutput(stack, 'RuntimeId', {
  value: runtime.agentRuntimeId,
  description: 'Runtime ID',
});

new cdk.CfnOutput(stack, 'RuntimeArn', {
  value: runtime.agentRuntimeArn,
  description: 'Runtime ARN',
});

// Create the integration test
new integ.IntegTest(app, 'BedrockAgentCoreRuntimeCognitoTest', {
  testCases: [stack],
});
