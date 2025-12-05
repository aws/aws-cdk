import * as path from 'path';
import { randomUUID } from 'crypto';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreRuntimeGatewayIntegTest', {});

const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'integ-test-runtime-gateway',
  description: 'Gateway for Runtime integration test with M2M auth',
});

const calculatorFunction = new lambda.Function(stack, 'TestFunction', {
  functionName: 'integ-test-simple-tool',
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
  description: 'Simple test function for Gateway M2M authentication test',
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
);

const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_runtime_with_gateway',
  description: 'Runtime using Gateway tools',
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

invokeRuntime.assertAtPath('response.output.result.content[0].text', integ.ExpectedResult.stringLikeRegexp('.*Hello from Gateway Lambda.*'));
