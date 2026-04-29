import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { GatewayIamRoleCredentialProviderConfig } from '../../../lib/gateway/outbound-auth/iam-role';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import { GatewayTarget } from '../../../lib/gateway/targets/target';

describe('IAM credential provider', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let lambdaFunction: lambda.Function;
  const toolSchema = ToolSchema.fromInline([
    {
      name: 'test_tool',
      description: 'Test tool',
      inputSchema: {
        type: SchemaDefinitionType.OBJECT,
        properties: {},
      },
    },
  ]);

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
    lambdaFunction = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {}'),
    });
  });

  describe('rendering', () => {
    test('renders only credentialProviderType when no props are provided (backwards compatible)', () => {
      // Bare fromIamRole() is still valid for Lambda targets.
      GatewayTarget.forLambda(stack, 'Target', {
        gateway,
        gatewayTargetName: 'target',
        lambdaFunction,
        toolSchema,
        credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: Match.absent(),
          },
        ],
      });
    });

    test('renders iamCredentialProvider with service when service is provided', () => {
      gateway.addMcpServerTarget('McpTarget', {
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({ service: 'bedrock-runtime' }),
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: {
              IamCredentialProvider: {
                Service: 'bedrock-runtime',
                Region: Match.absent(),
              },
            },
          },
        ],
      });
    });

    test('renders iamCredentialProvider with service and region when both are provided', () => {
      gateway.addMcpServerTarget('McpTarget', {
        gatewayTargetName: 'mcp-target',
        endpoint: 'https://mcp-server.example.com',
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({
            service: 'bedrock-runtime',
            region: 'us-east-1',
          }),
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CredentialProviderConfigurations: [
          {
            CredentialProviderType: 'GATEWAY_IAM_ROLE',
            CredentialProvider: {
              IamCredentialProvider: {
                Service: 'bedrock-runtime',
                Region: 'us-east-1',
              },
            },
          },
        ],
      });
    });
  });

  describe('validation', () => {
    test('fails when region is provided without service', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ region: 'us-east-1' })).toThrow(
        'service must be provided when region is specified for the IAM credential provider, got: region="us-east-1"',
      );
    });

    test('fails when service is empty', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ service: '' })).toThrow(
        /IAM credential provider service is 0 characters long but must be at least 1 characters/,
      );
    });

    test('fails when service exceeds 64 characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ service: 'a'.repeat(65) })).toThrow(
        /IAM credential provider service is 65 characters long but must be less than or equal to 64 characters/,
      );
    });

    test('fails when service contains invalid characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({ service: 'bedrock runtime' })).toThrow(
        /The field IAM credential provider service with value "bedrock runtime" does not match the required pattern/,
      );
    });

    test('fails when region exceeds 32 characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({
        service: 'bedrock',
        region: 'a'.repeat(33),
      })).toThrow(
        /IAM credential provider region is 33 characters long but must be less than or equal to 32 characters/,
      );
    });

    test('fails when region contains invalid characters', () => {
      expect(() => GatewayCredentialProvider.fromIamRole({
        service: 'bedrock',
        region: 'us_east_1',
      })).toThrow(
        /The field IAM credential provider region with value "us_east_1" does not match the required pattern/,
      );
    });

    test('skips validation for unresolved tokens', () => {
      const tokenStack = new cdk.Stack();
      expect(() => GatewayCredentialProvider.fromIamRole({
        service: cdk.Token.asString({ resolve: () => 'bedrock-runtime' }),
        region: tokenStack.region,
      })).not.toThrow();
    });

    test('fails when explicit service/region is used with a Lambda target', () => {
      expect(() => GatewayTarget.forLambda(stack, 'Target', {
        gateway,
        gatewayTargetName: 'target',
        lambdaFunction,
        toolSchema,
        credentialProviderConfigurations: [
          GatewayCredentialProvider.fromIamRole({ service: 'bedrock-runtime' }),
        ],
      })).toThrow(
        /IamCredentialProvider with explicit service\/region is only supported for MCP Server targets/,
      );
    });
  });

  describe('GatewayIamRoleCredentialProviderConfig', () => {
    test('grantNeededPermissionsToRole returns undefined', () => {
      const config = new GatewayIamRoleCredentialProviderConfig({ service: 'bedrock' });
      expect(config.grantNeededPermissionsToRole(gateway.role)).toBeUndefined();
    });

    test('exposes service and region as readonly properties', () => {
      const config = new GatewayIamRoleCredentialProviderConfig({
        service: 'bedrock-runtime',
        region: 'us-east-1',
      });
      expect(config.service).toBe('bedrock-runtime');
      expect(config.region).toBe('us-east-1');
    });
  });
});
