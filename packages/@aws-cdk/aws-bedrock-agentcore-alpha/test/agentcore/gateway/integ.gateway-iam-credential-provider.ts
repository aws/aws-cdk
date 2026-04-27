import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-agentcore-gateway-iam-credential-provider');

const gateway = new agentcore.Gateway(stack, 'Gateway', {
  gatewayName: 'iam-cred-provider-gw',
});

const fn = new lambda.Function(stack, 'TestFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
});

const toolSchema = agentcore.ToolSchema.fromInline([{
  name: 'test_tool',
  description: 'A test tool',
  inputSchema: {
    type: agentcore.SchemaDefinitionType.OBJECT,
    properties: {},
  },
}]);

// Lambda target with the explicit IAM credential provider service / region.
const target = gateway.addLambdaTarget('LambdaTarget', {
  gatewayTargetName: 'lambda-with-explicit-sigv4',
  lambdaFunction: fn,
  toolSchema,
  credentialProviderConfigurations: [
    agentcore.GatewayCredentialProvider.fromIamRole({
      service: 'bedrock-runtime',
      region: 'us-east-1',
    }),
  ],
});

const integTest = new integ.IntegTest(app, 'GatewayIamCredentialProvider', {
  testCases: [stack],
});

integTest.assertions
  .awsApiCall('BedrockAgentCoreControl', 'getGatewayTarget', {
    gatewayIdentifier: gateway.gatewayId,
    targetId: target.targetId,
  })
  .expect(integ.ExpectedResult.objectLike({
    name: 'lambda-with-explicit-sigv4',
    credentialProviderConfigurations: [
      {
        credentialProviderType: 'GATEWAY_IAM_ROLE',
        credentialProvider: {
          iamCredentialProvider: {
            service: 'bedrock-runtime',
            region: 'us-east-1',
          },
        },
      },
    ],
  }));
