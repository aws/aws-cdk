
import * as cdk from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { RuntimeEndpoint } from '../../../lib/runtime/runtime-endpoint';

describe('RuntimeEndpoint tests', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('RuntimeEndpoint basic tests', () => {
    test('Should create RuntimeEndpoint with required properties', () => {
      // Create a runtime endpoint
      new RuntimeEndpoint(stack, 'TestEndpoint', {
        endpointName: 'test_endpoint',
        agentRuntimeId: 'testruntime-abc1234567',
        agentRuntimeVersion: '1',
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource is created
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'testruntime-abc1234567',
        AgentRuntimeVersion: '1',
      });
    });

    test('Should create RuntimeEndpoint with description', () => {
      // Create a runtime endpoint with description
      new RuntimeEndpoint(stack, 'TestEndpoint', {
        endpointName: 'test_endpoint',
        agentRuntimeId: 'testruntime-abc1234567',
        agentRuntimeVersion: '1',
        description: 'Test endpoint description',
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource is created
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'testruntime-abc1234567',
        AgentRuntimeVersion: '1',
      });

      // Verify the Description is set directly (L1 constructs don't use Fn::If for optional properties)
      const resources = template.findResources('AWS::BedrockAgentCore::RuntimeEndpoint');
      const endpointResource = Object.values(resources)[0];
      expect(endpointResource.Properties.Description).toBe('Test endpoint description');
    });

    test('Should create RuntimeEndpoint with tags', () => {
      // Create a runtime endpoint with tags
      new RuntimeEndpoint(stack, 'TestEndpoint', {
        endpointName: 'test_endpoint',
        agentRuntimeId: 'testruntime-abc1234567',
        agentRuntimeVersion: '1',
        tags: {
          Environment: 'Test',
          Project: 'BedrockAgentCore',
        },
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource has tags
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'testruntime-abc1234567',
        AgentRuntimeVersion: '1',
        Tags: {
          Environment: 'Test',
          Project: 'BedrockAgentCore',
        },
      });
    });

    test('Should create RuntimeEndpoint without security configuration', () => {
      // Create a runtime endpoint (security config no longer supported)
      new RuntimeEndpoint(stack, 'TestEndpoint', {
        endpointName: 'test_endpoint',
        agentRuntimeId: 'testruntime-abc1234567',
        agentRuntimeVersion: '1',
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource is created
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'testruntime-abc1234567',
        AgentRuntimeVersion: '1',
      });
    });
  });

  describe('RuntimeEndpoint validation tests', () => {
    test('Should throw error for invalid endpoint name with hyphen', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test-endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
        });
      }).toThrow('Endpoint name must start with a letter and contain only letters, numbers, and underscores');
    });

    test('Should throw error for endpoint name too long', () => {
      const longName = 'a'.repeat(49);
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: longName,
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
        });
      }).toThrow(/The field Endpoint name is 49 characters long but must be less than or equal to 48 characters/);
    });

    test('Should throw error for invalid runtime version', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '0',
        });
      }).toThrow(/Agent runtime version must be a number between 1 and 99999/);
    });

    test('Should throw error for runtime version too long', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '123456',
        });
      }).toThrow(/Agent runtime version must be a number between 1 and 99999/);
    });

    test('Should accept valid endpoint name with underscores', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint_name',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
        });
      }).not.toThrow();
    });

    test('Should accept valid runtime version', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '12345',
        });
      }).not.toThrow();
    });
  });

  describe('RuntimeEndpoint tag validation tests', () => {
    test('Should throw error for tag key too long', () => {
      const longKey = 'a'.repeat(257);
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          tags: {
            [longKey]: 'value',
          },
        });
      }).toThrow(/is 257 characters long but must be less than or equal to 256 characters/);
    });

    test('Should throw error for tag value too long', () => {
      const longValue = 'a'.repeat(257);
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          tags: {
            TestKey: longValue,
          },
        });
      }).toThrow(/is 257 characters long but must be less than or equal to 256 characters/);
    });

    test('Should throw error for invalid tag key characters', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          tags: {
            'Test!Key': 'value',
          },
        });
      }).toThrow(/Tag key .* can only contain letters/);
    });

    test('Should accept valid tags', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          tags: {
            'Environment': 'Test',
            'Project:Name': 'BedrockAgentCore',
            'aws:tag': 'value',
            'Key_with-special.chars': 'value@123',
          },
        });
      }).not.toThrow();
    });
  });

  describe('RuntimeEndpoint static methods tests', () => {
    test('Should import endpoint from attributes', () => {
      const imported = RuntimeEndpoint.fromRuntimeEndpointAttributes(stack, 'ImportedEndpoint', {
        agentRuntimeEndpointArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:endpoint/test-endpoint-id',
        endpointName: 'test-endpoint',
        agentRuntimeArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:runtime/test-runtime-id',
        description: 'Imported endpoint',
      });

      expect(imported.agentRuntimeEndpointArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:endpoint/test-endpoint-id');
      expect(imported.endpointName).toBe('test-endpoint');
      expect(imported.agentRuntimeArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:runtime/test-runtime-id');
      expect(imported.description).toBe('Imported endpoint');
      expect(imported.status).toBeUndefined();
      expect(imported.targetVersion).toBeUndefined();
      expect(imported.createdAt).toBeUndefined();
    });
  });

  describe('RuntimeEndpoint with empty tag values', () => {
    test('Should accept empty tag value', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          tags: {
            EmptyTag: '',
          },
        });
      }).not.toThrow();
    });
  });

  describe('RuntimeEndpoint validation with tokens', () => {
    test('Should skip validation for token-based endpoint name', () => {
      const tokenName = cdk.Lazy.string({ produce: () => 'test_endpoint' });

      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: tokenName,
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
        });
      }).not.toThrow();
    });

    test('Should skip validation for token-based runtime ID', () => {
      const tokenId = cdk.Lazy.string({ produce: () => 'test_runtime_id' });

      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: tokenId,
          agentRuntimeVersion: '1',
        });
      }).not.toThrow();
    });

    test('Should skip validation for token-based runtime version', () => {
      const tokenVersion = cdk.Lazy.string({ produce: () => '1' });

      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: tokenVersion,
        });
      }).not.toThrow();
    });

    test('Should skip validation for token-based description', () => {
      const tokenDescription = cdk.Lazy.string({ produce: () => 'Test description' });

      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          description: tokenDescription,
        });
      }).not.toThrow();
    });

    test('Should skip validation for token-based tag keys and values', () => {
      const tokenKey = cdk.Lazy.string({ produce: () => 'TestKey' });
      const tokenValue = cdk.Lazy.string({ produce: () => 'TestValue' });

      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'testruntime-abc1234567',
          agentRuntimeVersion: '1',
          tags: {
            [tokenKey]: tokenValue,
          },
        });
      }).not.toThrow();
    });
  });
});
