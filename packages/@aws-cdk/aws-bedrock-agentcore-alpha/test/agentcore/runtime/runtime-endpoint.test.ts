/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { RuntimeEndpoint } from '../../../agentcore/runtime/runtime-endpoint';

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
        agentRuntimeId: 'test_runtime_id',
        agentRuntimeVersion: '1',
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource is created
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'test_runtime_id',
        AgentRuntimeVersion: '1',
      });
    });

    test('Should create RuntimeEndpoint with description', () => {
      // Create a runtime endpoint with description
      new RuntimeEndpoint(stack, 'TestEndpoint', {
        endpointName: 'test_endpoint',
        agentRuntimeId: 'test_runtime_id',
        agentRuntimeVersion: '1',
        description: 'Test endpoint description',
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource is created
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'test_runtime_id',
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
        agentRuntimeId: 'test_runtime_id',
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
        AgentRuntimeId: 'test_runtime_id',
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
        agentRuntimeId: 'test_runtime_id',
        agentRuntimeVersion: '1',
      });

      // Get the CloudFormation template
      const template = Template.fromStack(stack);

      // Verify the RuntimeEndpoint resource is created
      template.hasResourceProperties('AWS::BedrockAgentCore::RuntimeEndpoint', {
        Name: 'test_endpoint',
        AgentRuntimeId: 'test_runtime_id',
        AgentRuntimeVersion: '1',
      });
    });
  });

  describe('RuntimeEndpoint validation tests', () => {
    test('Should throw error for invalid endpoint name with hyphen', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test-endpoint',
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '1',
        });
      }).toThrow('Endpoint name must start with a letter and contain only letters, numbers, and underscores');
    });

    test('Should throw error for endpoint name too long', () => {
      const longName = 'a'.repeat(49);
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: longName,
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '1',
        });
      }).toThrow(/The field Endpoint name is 49 characters long but must be less than or equal to 48 characters/);
    });

    test('Should throw error for invalid runtime version', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '0',
        });
      }).toThrow(/Agent runtime version must be a number starting with 1-9/);
    });

    test('Should throw error for runtime version too long', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '123456',
        });
      }).toThrow(/Agent runtime version must be between 1 and 5 characters long/);
    });

    test('Should accept valid endpoint name with underscores', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint_name',
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '1',
        });
      }).not.toThrow();
    });

    test('Should accept valid runtime version', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'test_runtime_id',
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
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '1',
          tags: {
            [longKey]: 'value',
          },
        });
      }).toThrow(/Tag key .* must be between 1 and 256 characters long/);
    });

    test('Should throw error for tag value too long', () => {
      const longValue = 'a'.repeat(257);
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'test_runtime_id',
          agentRuntimeVersion: '1',
          tags: {
            TestKey: longValue,
          },
        });
      }).toThrow(/Tag value .* must be between 0 and 256 characters long/);
    });

    test('Should throw error for invalid tag key characters', () => {
      expect(() => {
        new RuntimeEndpoint(stack, 'TestEndpoint', {
          endpointName: 'test_endpoint',
          agentRuntimeId: 'test_runtime_id',
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
          agentRuntimeId: 'test_runtime_id',
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
});
