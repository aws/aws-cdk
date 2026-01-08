import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  Gateway,
  GatewayInterceptor,
  InterceptionPoint,
  GatewayAuthorizer,
  ToolSchema,
  SchemaDefinitionType,
  ToolDefinition,
} from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-gateway-interceptor', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

const requestInterceptorFn = new lambda.Function(stack, 'RequestInterceptor', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  console.log('=== REQUEST INTERCEPTOR INVOKED ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  return {
    interceptorOutputVersion: '1.0',
    mcp: {
      transformedGatewayRequest: {
        body: event.mcp.gatewayRequest.body,
      },
    },
  };
};
  `),
  timeout: cdk.Duration.seconds(30),
});

const responseInterceptorFn = new lambda.Function(stack, 'ResponseInterceptor', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  console.log('=== RESPONSE INTERCEPTOR INVOKED ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  const response = event.mcp.gatewayResponse || {};
  return {
    interceptorOutputVersion: '1.0',
    mcp: {
      transformedGatewayRequest: {
        body: event.mcp.gatewayRequest.body,
      },
      transformedGatewayResponse: {
        statusCode: response.statusCode || 200,
        body: response.body,
      },
    },
  };
};
  `),
  timeout: cdk.Duration.seconds(30),
});

const targetFn = new lambda.Function(stack, 'TargetFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
exports.handler = async (event) => {
  console.log('=== TARGET FUNCTION INVOKED ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  const name = event.arguments?.name || 'World';
  return {
    greeting: 'Hello, ' + name + '!',
    timestamp: new Date().toISOString(),
  };
};
  `),
  timeout: cdk.Duration.seconds(30),
});

const gateway = new Gateway(stack, 'Gateway', {
  gatewayName: 'integ-gateway-interceptor',
  authorizerConfiguration: GatewayAuthorizer.usingAwsIam(),
  interceptorConfigurations: [
    GatewayInterceptor.lambda({
      lambdaFunction: requestInterceptorFn,
      interceptionPoints: [InterceptionPoint.REQUEST],
      inputConfiguration: { passRequestHeaders: true },
    }),
    GatewayInterceptor.lambda({
      lambdaFunction: responseInterceptorFn,
      interceptionPoints: [InterceptionPoint.RESPONSE],
    }),
  ],
});

gateway.addLambdaTarget('GreetingTarget', {
  gatewayTargetName: 'greeting-tool',
  description: 'A simple greeting tool for testing interceptors',
  lambdaFunction: targetFn,
  toolSchema: ToolSchema.fromInline([
    {
      name: 'greet',
      description: 'Returns a greeting message',
      inputSchema: {
        type: SchemaDefinitionType.OBJECT,
        properties: {
          name: {
            type: SchemaDefinitionType.STRING,
            description: 'Name to greet',
          },
        },
      },
    },
  ] as ToolDefinition[]),
});

new cdk.CfnOutput(stack, 'GatewayUrl', {
  value: gateway.gatewayUrl!,
});

new integ.IntegTest(app, 'GatewayInterceptorTest', {
  testCases: [stack],
});
