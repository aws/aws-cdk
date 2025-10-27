import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { Gateway, ApiSchema, ApiKeyCredentialProviderConfiguration } from '../../agentcore';

describe('OpenAPI Schema Validation', () => {
  let stack: cdk.Stack;
  let gateway: Gateway;
  let tempDir: string;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');

    // Create a gateway
    gateway = new Gateway(stack, 'TestGateway', {
      gatewayName: 'test-gateway',
    });

    // Create a temp directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-test-'));
  });

  afterEach(() => {
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  test('validates inline OpenAPI schema with missing operationId', () => {
    const invalidSchema = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            // Missing operationId - this should fail validation
            summary: 'Test endpoint',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    });

    const apiSchema = ApiSchema.fromInline(invalidSchema);

    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).toThrow(/operations must include 'operationId' field/);
  });

  test('validates OpenAPI schema with unsupported oneOf', () => {
    const invalidSchema = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: {
              200: {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: {
                      oneOf: [
                        { type: 'string' },
                        { type: 'number' },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const apiSchema = ApiSchema.fromInline(invalidSchema);

    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).toThrow(/contains unsupported 'oneOf' schema composition/);
  });

  test('validates OpenAPI schema with unsupported version', () => {
    const invalidSchema = JSON.stringify({
      swagger: '2.0', // Using Swagger 2.0 instead of OpenAPI 3.x
      info: { title: 'Test API', version: '1.0.0' },
      host: 'api.example.com',
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    });

    const apiSchema = ApiSchema.fromInline(invalidSchema);

    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).toThrow(/must include an 'openapi' field/);
  });

  test('validates OpenAPI schema from asset file', () => {
    const invalidSchemaPath = path.join(tempDir, 'invalid-schema.json');

    // Write an invalid schema to file
    fs.writeFileSync(invalidSchemaPath, JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            // Missing operationId
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    }));

    const apiSchema = ApiSchema.fromLocalAsset(invalidSchemaPath);

    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).toThrow(/operations must include 'operationId' field/);
  });

  test('accepts valid OpenAPI schema', () => {
    const validSchema = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            summary: 'Test endpoint',
            responses: {
              200: {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const apiSchema = ApiSchema.fromInline(validSchema);

    // Should not throw
    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).not.toThrow();

    // Verify the target was added successfully
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::GatewayTarget', {
      Name: 'test-target',
    });
  });

  test('validates OpenAPI schema with unsupported media types', () => {
    const invalidSchema = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/test': {
          post: {
            operationId: 'postTest',
            requestBody: {
              content: {
                'application/octet-stream': { // Unsupported binary media type
                  schema: { type: 'string', format: 'binary' },
                },
              },
            },
            responses: {
              200: { description: 'Success' },
            },
          },
        },
      },
    });

    const apiSchema = ApiSchema.fromInline(invalidSchema);

    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).toThrow(/uses unsupported media types: application\/octet-stream/);
  });

  test('validates OpenAPI schema with complex path serializers', () => {
    const invalidSchema = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/users{;id*}': { // Complex path serializer
          get: {
            operationId: 'getUser',
            responses: { 200: { description: 'Success' } },
          },
        },
      },
    });

    const apiSchema = ApiSchema.fromInline(invalidSchema);

    expect(() => {
      gateway.addOpenApiTarget('TestTarget', {
        gatewayTargetName: 'test-target',
        apiSchema: apiSchema,
        credentialProviderConfigurations: [
          new ApiKeyCredentialProviderConfiguration({
            providerArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:token-vault/test-vault/apikeycredentialprovider/test-provider',
            secretArn: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret',
          }),
        ],
      });
    }).toThrow(/contains unsupported complex path parameter serializers/);
  });
});
