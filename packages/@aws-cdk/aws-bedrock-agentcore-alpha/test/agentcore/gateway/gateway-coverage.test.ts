/**
 * Targeted tests to improve branch coverage
 */

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Gateway } from '../../../lib';
import { PolicyEngineMode } from '../../../lib/gateway/gateway';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import { PolicyEngine } from '../../../lib/policy/policy-engine';

describe('Gateway Coverage Tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should grant KMS permissions when both kmsKey and custom role provided', () => {
    const key = new kms.Key(stack, 'Key');
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    new Gateway(stack, 'Gateway', {
      gatewayName: 'test-gateway',
      kmsKey: key,
      role: role,
    });

    const template = Template.fromStack(stack);
    // Verify that KMS permissions are granted to the role
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['kms:Decrypt', 'kms:Encrypt']),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('Should automatically grant GetPolicyEngine to gateway role scoped to policy engine ARN', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine', {
      policyEngineName: 'test_policy_engine',
    });

    new Gateway(stack, 'Gateway', {
      gatewayName: 'test-gateway',
      policyEngineConfiguration: { policyEngine },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetPolicyEngine',
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('PolicyEngine.*'), 'PolicyEngineArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('Should automatically grant AuthorizeAction and PartiallyAuthorizeActions to both policy engine and gateway ARNs', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine2', {
      policyEngineName: 'test_policy_engine_2',
    });

    new Gateway(stack, 'Gateway2', {
      gatewayName: 'test-gateway-2',
      policyEngineConfiguration: {
        policyEngine,
        mode: PolicyEngineMode.ENFORCE,
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:AuthorizeAction',
              'bedrock-agentcore:PartiallyAuthorizeActions',
            ]),
            Effect: 'Allow',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('PolicyEngine2.*'), 'PolicyEngineArn']),
              }),
              Match.objectLike({
                'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('Gateway2.*'), 'GatewayArn']),
              }),
            ]),
          }),
        ]),
      },
    });
  });

  test('Should set PolicyEngineConfiguration on the CfnGateway with LOG_ONLY as default mode', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine3', {
      policyEngineName: 'test_policy_engine_3',
    });

    new Gateway(stack, 'Gateway3', {
      gatewayName: 'test-gateway-3',
      policyEngineConfiguration: { policyEngine },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway-3',
      PolicyEngineConfiguration: {
        Arn: Match.objectLike({
          'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('PolicyEngine3.*'), 'PolicyEngineArn']),
        }),
        Mode: 'LOG_ONLY',
      },
    });
  });

  test('Should set PolicyEngineConfiguration with ENFORCE mode when specified', () => {
    const policyEngine = new PolicyEngine(stack, 'PolicyEngine4', {
      policyEngineName: 'test_policy_engine_4',
    });

    new Gateway(stack, 'Gateway4', {
      gatewayName: 'test-gateway-4',
      policyEngineConfiguration: {
        policyEngine,
        mode: PolicyEngineMode.ENFORCE,
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'test-gateway-4',
      PolicyEngineConfiguration: {
        Mode: 'ENFORCE',
      },
    });
  });

  test('Should not set PolicyEngineConfiguration when not provided', () => {
    new Gateway(stack, 'GatewayNoPolicyEngine', {
      gatewayName: 'no-policy-engine-gateway',
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Gateway', {
      Name: 'no-policy-engine-gateway',
      PolicyEngineConfiguration: Match.absent(),
    });
  });

  test('Should pass credentialProviderConfigurations when provided to Lambda target', () => {
    const gateway = new Gateway(stack, 'Gateway', { gatewayName: 'test-gateway' });

    const fn = new lambda.Function(stack, 'Function', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 });'),
    });

    const toolSchema = ToolSchema.fromInline([{
      name: 'test_tool',
      description: 'Test tool',
      inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
    }]);

    const creds = [GatewayCredentialProvider.fromIamRole()];

    const target = gateway.addLambdaTarget('Target', {
      lambdaFunction: fn,
      toolSchema: toolSchema,
      credentialProviderConfigurations: creds,
    });

    expect(target.credentialProviderConfigurations).toEqual(creds);
  });
});
