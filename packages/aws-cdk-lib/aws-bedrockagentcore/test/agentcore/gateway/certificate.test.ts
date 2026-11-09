import { Match, Template } from '../../../../assertions';
import * as kms from '../../../../aws-kms';
import * as lambda from '../../../../aws-lambda';
import * as s3 from '../../../../aws-s3';
import * as secretsmanager from '../../../../aws-secretsmanager';
import * as cdk from '../../../../core';
import { Gateway } from '../../../lib';
import { GatewayCredentialProvider } from '../../../lib/gateway/outbound-auth/credential-provider';
import { CertificateConfiguration } from '../../../lib/gateway/targets/certificate';
import { PrivateEndpoint } from '../../../lib/gateway/targets/private-endpoint';
import { ApiSchema } from '../../../lib/gateway/targets/schema/api-schema';
import { ToolSchema, SchemaDefinitionType } from '../../../lib/gateway/targets/schema/tool-schema';
import { GatewayTarget } from '../../../lib/gateway/targets/target';
import { LambdaTargetConfiguration } from '../../../lib/gateway/targets/target-configuration';

describe('Gateway target certificate configurations', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'CertificateConfigurations is a newly launched property not yet in the bundled schema' });
    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });
  });

  const privateEndpoint = PrivateEndpoint.fromResourceConfiguration('rcfg-0123456789abcdef0');

  const addMcpServerTarget = (certificateConfigurations?: CertificateConfiguration[]) =>
    gateway.addMcpServerTarget('McpTarget', {
      gatewayTargetName: 'mcp-target',
      endpoint: 'https://mcp.internal.example.com/mcp',
      credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      certificateConfigurations,
      privateEndpoint,
    });

  describe('fromBucket', () => {
    test('renders the S3 URI and grants s3:GetObject on the object to the gateway role', () => {
      const bucket = new s3.Bucket(stack, 'CaBucket');

      addMcpServerTarget([CertificateConfiguration.fromBucket(bucket, 'ca/root.pem')]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CertificateConfigurations: [{
          S3: {
            Uri: { 'Fn::Join': ['', ['s3://', { Ref: Match.stringLikeRegexp('CaBucket') }, '/ca/root.pem']] },
          },
        }],
      });
      template.hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: Match.stringLikeRegexp('TestGatewayServiceRole') }],
        PolicyDocument: {
          Statement: Match.arrayWith([Match.objectLike({
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:', { Ref: 'AWS::Partition' }, ':s3:::', { Ref: Match.stringLikeRegexp('CaBucket') }, '/ca/root.pem',
              ]],
            },
          })]),
        },
      });
    });

    test('renders bucketOwnerAccountId for a cross-account bucket', () => {
      const bucket = s3.Bucket.fromBucketName(stack, 'CaBucket', 'other-account-ca');

      addMcpServerTarget([CertificateConfiguration.fromBucket(bucket, 'root.pem', {
        bucketOwnerAccountId: '210987654321',
      })]);

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CertificateConfigurations: [{
          S3: {
            Uri: 's3://other-account-ca/root.pem',
            BucketOwnerAccountId: '210987654321',
          },
        }],
      });
    });

    test('grants kms:Decrypt when the bucket is encrypted with a customer managed key', () => {
      const key = new kms.Key(stack, 'Key');
      const bucket = new s3.Bucket(stack, 'CaBucket', {
        encryption: s3.BucketEncryption.KMS,
        encryptionKey: key,
      });

      addMcpServerTarget([CertificateConfiguration.fromBucket(bucket, 'root.pem')]);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: Match.stringLikeRegexp('TestGatewayServiceRole') }],
        PolicyDocument: {
          Statement: Match.arrayWith([Match.objectLike({
            Action: 'kms:Decrypt',
            Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('Key'), 'Arn'] },
          })]),
        },
      });
    });

    test('throws on an empty object key', () => {
      const bucket = new s3.Bucket(stack, 'CaBucket');
      expect(() => CertificateConfiguration.fromBucket(bucket, '')).toThrow(/the object key of the certificate must not be empty/);
    });

    test('skips validation of unresolved tokens', () => {
      const bucket = new s3.Bucket(stack, 'CaBucket');
      expect(() => CertificateConfiguration.fromBucket(
        bucket,
        cdk.Lazy.string({ produce: () => '' }),
        { bucketOwnerAccountId: cdk.Lazy.string({ produce: () => '1234' }) },
      )).not.toThrow();
    });

    test('throws on an invalid bucket owner account ID', () => {
      const bucket = new s3.Bucket(stack, 'CaBucket');
      expect(() => CertificateConfiguration.fromBucket(bucket, 'root.pem', {
        bucketOwnerAccountId: '1234',
      })).toThrow(/12-digit AWS account ID/);
    });
  });

  describe('fromSecret', () => {
    test('renders the secret ARN and grants read access to the gateway role', () => {
      const secret = new secretsmanager.Secret(stack, 'CaSecret');

      addMcpServerTarget([CertificateConfiguration.fromSecret(secret)]);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
        CertificateConfigurations: [{
          SecretsManager: { SecretArn: { Ref: Match.stringLikeRegexp('CaSecret') } },
        }],
      });
      template.hasResourceProperties('AWS::IAM::Policy', {
        Roles: [{ Ref: Match.stringLikeRegexp('TestGatewayServiceRole') }],
        PolicyDocument: {
          Statement: Match.arrayWith([Match.objectLike({
            Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            Resource: { Ref: Match.stringLikeRegexp('CaSecret') },
          })]),
        },
      });
    });
  });

  test('the target depends on the gateway role policy that grants certificate access', () => {
    const secret = new secretsmanager.Secret(stack, 'CaSecret');

    addMcpServerTarget([CertificateConfiguration.fromSecret(secret)]);

    const template = Template.fromStack(stack);
    const policies = template.findResources('AWS::IAM::Policy');
    const targets = template.findResources('AWS::BedrockAgentCore::GatewayTarget');
    const dependsOn: string[] = Object.values(targets)[0].DependsOn ?? [];
    expect(Object.keys(policies).some(policyId => dependsOn.includes(policyId))).toBe(true);
  });

  test('omits CertificateConfigurations when none or an empty list is given', () => {
    addMcpServerTarget([]);

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      CertificateConfigurations: Match.absent(),
    });
  });

  test('throws when more than one certificate is given', () => {
    const secret = new secretsmanager.Secret(stack, 'CaSecret');
    const bucket = new s3.Bucket(stack, 'CaBucket');

    expect(() => addMcpServerTarget([
      CertificateConfiguration.fromSecret(secret),
      CertificateConfiguration.fromBucket(bucket, 'root.pem'),
    ])).toThrow(/at most 1 certificate configuration can be specified for a gateway target, got 2/);
  });

  test('throws when certificates are given without a private endpoint', () => {
    const secret = new secretsmanager.Secret(stack, 'CaSecret');

    expect(() => gateway.addMcpServerTarget('McpTarget', {
      gatewayTargetName: 'mcp-target',
      endpoint: 'https://mcp.internal.example.com/mcp',
      credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      certificateConfigurations: [CertificateConfiguration.fromSecret(secret)],
    })).toThrow(/certificateConfigurations can only be specified for a gateway target with a privateEndpoint/);
  });

  test('is forwarded by addOpenApiTarget', () => {
    const secret = new secretsmanager.Secret(stack, 'CaSecret');

    gateway.addOpenApiTarget('OpenApiTarget', {
      gatewayTargetName: 'openapi-target',
      apiSchema: ApiSchema.fromInline(JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Internal', version: '1.0.0' },
        servers: [{ url: 'https://api.internal.example.com' }],
        paths: { '/test': { get: { operationId: 'getTest', responses: { 200: { description: 'OK' } } } } },
      })),
      validateOpenApiSchema: false,
      credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      certificateConfigurations: [CertificateConfiguration.fromSecret(secret)],
      privateEndpoint,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'openapi-target',
      CertificateConfigurations: [{
        SecretsManager: { SecretArn: { Ref: Match.stringLikeRegexp('CaSecret') } },
      }],
      PrivateEndpoint: {
        SelfManagedLatticeResource: { ResourceConfigurationIdentifier: 'rcfg-0123456789abcdef0' },
      },
    });
  });

  test('is forwarded by GatewayTarget.forMcpServer', () => {
    const secret = new secretsmanager.Secret(stack, 'CaSecret');

    GatewayTarget.forMcpServer(stack, 'FactoryTarget', {
      gateway,
      gatewayTargetName: 'factory-target',
      endpoint: 'https://mcp.internal.example.com/mcp',
      credentialProviderConfigurations: [GatewayCredentialProvider.fromIamRole()],
      certificateConfigurations: [CertificateConfiguration.fromSecret(secret)],
      privateEndpoint,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'factory-target',
      CertificateConfigurations: [{
        SecretsManager: { SecretArn: { Ref: Match.stringLikeRegexp('CaSecret') } },
      }],
    });
  });

  test('fails for a target type that does not support certificates', () => {
    const secret = new secretsmanager.Secret(stack, 'CaSecret');
    const lambdaFunction = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {}'),
    });

    expect(() => new GatewayTarget(stack, 'LambdaTarget', {
      gateway,
      targetConfiguration: LambdaTargetConfiguration.create(lambdaFunction, ToolSchema.fromInline([{
        name: 'tool',
        description: 'Test tool',
        inputSchema: { type: SchemaDefinitionType.OBJECT, properties: {} },
      }])),
      certificateConfigurations: [CertificateConfiguration.fromSecret(secret)],
      privateEndpoint,
    })).toThrow(/certificateConfigurations is only supported for MCP Server and OpenAPI targets, got target type "LAMBDA"/);
  });
});
