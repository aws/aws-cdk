import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayNoAuthIntegTest', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

const gateway = new agentcore.Gateway(stack, 'NoAuthGateway', {
  gatewayName: 'integ-test-no-auth-gateway',
  description: 'Integration test gateway with No Auth authorizer',
  authorizerConfiguration: agentcore.GatewayAuthorizer.withNoAuth(),
});

const lambdaFunction = new lambda.Function(stack, 'TestFunction', {
  functionName: 'integ-test-no-auth-gateway-lambda',
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log('Received event:', JSON.stringify(event));
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Hello from Lambda!',
          input: event,
        }),
      };
    };
  `),
  description: 'Lambda function for No Auth Gateway integration test',
});

const lambdaToolSchema = agentcore.ToolSchema.fromInline([
  {
    name: 'public_tool',
    description: 'A public tool that can be discovered without authentication',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {
        query: {
          type: agentcore.SchemaDefinitionType.STRING,
          description: 'Query parameter',
        },
      },
      required: ['query'],
    },
  },
]);

gateway.addLambdaTarget('LambdaTarget', {
  gatewayTargetName: 'lambda-public-target',
  description: 'Lambda target for No Auth gateway',
  lambdaFunction: lambdaFunction,
  toolSchema: lambdaToolSchema,
});

new integ.IntegTest(app, 'GatewayNoAuthIntegTest', {
  testCases: [stack],
});
