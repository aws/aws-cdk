/**
 * Targeted tests to improve branch coverage
 */

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';

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
