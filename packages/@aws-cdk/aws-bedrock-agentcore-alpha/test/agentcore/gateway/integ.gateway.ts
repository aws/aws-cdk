/**
 * Comprehensive Integration test for AWS Bedrock AgentCore Gateway
 *
 * Tests Gateway with:
 * - All target types: Lambda and Smithy
 * - REQUEST and RESPONSE interceptors using the bind pattern
 * - Convenience methods (addLambdaTarget, addSmithyTarget, addInterceptor)
 */

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BedrockAgentCoreGatewayIntegTest', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

// Create Gateway with default configuration
const gateway = new agentcore.Gateway(stack, 'TestGateway', {
  gatewayName: 'integ-test-gateway',
  description: 'Comprehensive integration test gateway with targets and interceptors',
});

// ===== Interceptor Lambda Functions =====
const requestInterceptorFn = new lambda.Function(stack, 'RequestInterceptor', {
  functionName: 'integ-test-gateway-request-interceptor',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
def handler(event, context):
    """
    REQUEST interceptor - executes before gateway calls the target.
    Validates and transforms the request before it reaches the target.
    """
    import json
    print(f"Request Interceptor invoked with event: {json.dumps(event)}")
    
    # Return the request unchanged (pass-through interceptor for testing)
    return {
        "interceptorOutputVersion": "1.0",
        "mcp": {
            "transformedGatewayRequest": event.get("mcp", {}).get("gatewayRequest", {})
        }
    }
  `),
  description: 'REQUEST interceptor for Gateway integration test',
});

const responseInterceptorFn = new lambda.Function(stack, 'ResponseInterceptor', {
  functionName: 'integ-test-gateway-response-interceptor',
  runtime: lambda.Runtime.PYTHON_3_12,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
def handler(event, context):
    """
    RESPONSE interceptor - executes after target responds.
    Can transform, filter, or add custom headers to the response.
    """
    import json
    print(f"Response Interceptor invoked with event: {json.dumps(event)}")
    
    # Return the response unchanged (pass-through interceptor for testing)
    return {
        "interceptorOutputVersion": "1.0",
        "mcp": {
            "transformedGatewayResponse": event.get("mcp", {}).get("gatewayResponse", {})
        }
    }
  `),
  description: 'RESPONSE interceptor for Gateway integration test',
});

// Add interceptors to gateway using addInterceptor method
gateway.addInterceptor(
  agentcore.LambdaInterceptor.forRequest(requestInterceptorFn, {
    passRequestHeaders: false,
  }),
);

gateway.addInterceptor(
  agentcore.LambdaInterceptor.forResponse(responseInterceptorFn),
);

// ===== Lambda Target =====
const lambdaFunction = new lambda.Function(stack, 'TestFunction', {
  functionName: 'integ-test-gateway-lambda',
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
  description: 'Lambda function for Gateway integration test',
});

const lambdaToolSchema = agentcore.ToolSchema.fromInline([
  {
    name: 'greeting_tool',
    description: 'A greeting tool that returns a message',
    inputSchema: {
      type: agentcore.SchemaDefinitionType.OBJECT,
      properties: {
        name: {
          type: agentcore.SchemaDefinitionType.STRING,
          description: 'Name to greet',
        },
      },
      required: ['name'],
    },
  },
]);

const lambdaTarget = gateway.addLambdaTarget('LambdaTarget', {
  gatewayTargetName: 'lambda-greeting-target',
  description: 'Lambda target using convenience method',
  lambdaFunction: lambdaFunction,
  toolSchema: lambdaToolSchema,
});

// ===== OpenAPI Target =====
// NOTE: OpenAPI targets are NOT included in this integration test because they require
// either API_KEY or OAUTH credential providers (IAM is not supported for OpenAPI targets).
// Setting up these credential providers requires external resources (Secrets Manager, OAuth providers)
// that are not suitable for automated integration tests.

// ===== Smithy Target =====
// Using Smithy AST JSON format (required by AWS Bedrock AgentCore)
// The schema is loaded from a file containing the Smithy model in JSON AST format
const smithyTarget = gateway.addSmithyTarget('SmithyTarget', {
  gatewayTargetName: 'smithy-test-target',
  description: 'Smithy target using convenience method',
  smithyModel: agentcore.ApiSchema.fromLocalAsset(path.join(__dirname, 'schemas', 'smithy', 'basic-service.json')),
});

// ===== Outputs =====
new cdk.CfnOutput(stack, 'GatewayId', {
  value: gateway.gatewayId,
  description: 'The ID of the created gateway',
});

new cdk.CfnOutput(stack, 'LambdaTargetId', {
  value: lambdaTarget.targetId,
  description: 'The ID of the Lambda target',
});

new cdk.CfnOutput(stack, 'SmithyTargetId', {
  value: smithyTarget.targetId,
  description: 'The ID of the Smithy target',
});

new cdk.CfnOutput(stack, 'RequestInterceptorArn', {
  value: requestInterceptorFn.functionArn,
  description: 'ARN of the REQUEST interceptor Lambda function',
});

new cdk.CfnOutput(stack, 'ResponseInterceptorArn', {
  value: responseInterceptorFn.functionArn,
  description: 'ARN of the RESPONSE interceptor Lambda function',
});

// Create the integration test with safe assertions
const integTest = new integ.IntegTest(app, 'GatewayIntegTest', {
  testCases: [stack],
});

// Assert Lambda target function was deployed successfully
integTest.assertions
  .awsApiCall('Lambda', 'getFunction', {
    FunctionName: 'integ-test-gateway-lambda',
  })
  .expect(
    integ.ExpectedResult.objectLike({
      Configuration: {
        FunctionName: 'integ-test-gateway-lambda',
        Handler: 'index.handler',
      },
    }),
  );

// Assert REQUEST interceptor Lambda was deployed successfully
integTest.assertions
  .awsApiCall('Lambda', 'getFunction', {
    FunctionName: 'integ-test-gateway-request-interceptor',
  })
  .expect(
    integ.ExpectedResult.objectLike({
      Configuration: {
        FunctionName: 'integ-test-gateway-request-interceptor',
        Runtime: 'python3.12',
      },
    }),
  );

// Assert RESPONSE interceptor Lambda was deployed successfully
integTest.assertions
  .awsApiCall('Lambda', 'getFunction', {
    FunctionName: 'integ-test-gateway-response-interceptor',
  })
  .expect(
    integ.ExpectedResult.objectLike({
      Configuration: {
        FunctionName: 'integ-test-gateway-response-interceptor',
        Runtime: 'python3.12',
      },
    }),
  );

app.synth();
