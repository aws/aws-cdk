import { randomUUID } from 'crypto';
import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreRuntimeGatewayM2MIntegTest', {});

const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'integ-test-runtime-gateway',
});

const calculatorFunction = new lambda.Function(stack, 'TestFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event, context) => {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Hello from Gateway Lambda!',
          timestamp: new Date().toISOString()
        }),
      };
    };
  `),
});

const toolSchema = agentcore.ToolSchema.fromInline([
  {
    name: 'hello',
    description: 'Returns a hello message',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {},
    },
  },
]);

gateway.addLambdaTarget('TestTarget', {
  gatewayTargetName: 'test-tools',
  description: 'Simple test tools for M2M authentication',
  lambdaFunction: calculatorFunction,
  toolSchema: toolSchema,
});

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'gateway-agent'),
  { platform: assets.Platform.LINUX_ARM64 },
);

const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime_with_gateway',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  networkConfiguration: agentcore.RuntimeNetworkConfiguration.usingPublicNetwork(),
  environmentVariables: {
    GATEWAY_URL: gateway.gatewayUrl!,
    TOKEN_ENDPOINT: `https://${gateway.userPoolDomain!.domainName}.auth.${stack.region}.amazoncognito.com/oauth2/token`,
    CLIENT_ID: gateway.userPoolClient!.userPoolClientId,
    CLIENT_SECRET: gateway.userPoolClient!.userPoolClientSecret.unsafeUnwrap(),
    SCOPE: `${gateway.resourceServer!.userPoolResourceServerId}/read ${gateway.resourceServer!.userPoolResourceServerId}/write`,
  },
});

const integTest = new integ.IntegTest(app, 'RuntimeGatewayIntegTest', {
  testCases: [stack],
});

const invokeRuntime = integTest.assertions.awsApiCall('bedrock-agentcore', 'invokeAgentRuntime', {
  agentRuntimeArn: runtime.agentRuntimeArn,
  runtimeSessionId: randomUUID(),
  payload: JSON.stringify({
    input: {
      prompt: 'Test Gateway M2M authentication',
    },
  }),
});

// Check that the invocation returns a successful status code
// The 'response' field contains binary/streaming data that varies by agent implementation,
// so we only verify the API call succeeds (statusCode=200) rather than checking response content
invokeRuntime.expect(integ.ExpectedResult.objectLike({
  statusCode: 200,
}));
