import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../bedrock';

describe('PromptVersion', () => {
  let stack: Stack;
  let foundationModel: bedrock.IBedrockInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;
  });

  describe('basic functionality', () => {
    test('creates prompt version with minimal properties', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
      });

      expect(promptVersion.prompt).toBe(prompt);
      expect(promptVersion.versionArn).toBeDefined();
      expect(promptVersion.version).toBeDefined();

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        PromptArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
        },
        Description: Match.absent(),
      });
    });

    test('creates prompt version with description', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: 'Version 1.0 of the test prompt',
      });

      expect(promptVersion.prompt).toBe(prompt);
      expect(promptVersion.versionArn).toBeDefined();
      expect(promptVersion.version).toBeDefined();

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        PromptArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
        },
        Description: 'Version 1.0 of the test prompt',
      });
    });

    test('creates prompt version with complex prompt', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'test-variant',
        model: foundationModel,
        promptText: 'Hello {{promptName}}!',
        promptVariables: ['promptName'],
      });

      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'complex-test-prompt',
        description: 'A complex prompt for testing',
        variants: [textVariant],
        defaultVariant: textVariant,
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: 'First version of complex prompt',
      });

      expect(promptVersion.prompt).toBe(prompt);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        PromptArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
        },
        Description: 'First version of complex prompt',
      });
    });
  });

  describe('multiple versions', () => {
    test('creates multiple versions of the same prompt', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'versioned-prompt',
      });

      const version1 = new bedrock.PromptVersion(stack, 'Version1', {
        prompt,
        description: 'Version 1',
      });

      const version2 = new bedrock.PromptVersion(stack, 'Version2', {
        prompt,
        description: 'Version 2',
      });

      expect(version1.prompt).toBe(prompt);
      expect(version2.prompt).toBe(prompt);
      expect(version1.versionArn).toBeDefined();
      expect(version2.versionArn).toBeDefined();
      expect(version1.version).toBeDefined();
      expect(version2.version).toBeDefined();

      Template.fromStack(stack).resourceCountIs('AWS::Bedrock::PromptVersion', 2);
    });

    test('each version has unique attributes', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'versioned-prompt',
      });

      const version1 = new bedrock.PromptVersion(stack, 'Version1', {
        prompt,
        description: 'First version',
      });

      const version2 = new bedrock.PromptVersion(stack, 'Version2', {
        prompt,
        description: 'Second version',
      });

      // Both versions should reference the same prompt but have different ARNs and versions
      expect(version1.prompt).toBe(version2.prompt);
      expect(version1.versionArn).not.toBe(version2.versionArn);
      expect(version1.version).not.toBe(version2.version);
    });
  });

  describe('integration with Prompt.createVersion', () => {
    test('works with Prompt.createVersion method', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      // Create version using the prompt's method
      const promptVersion = prompt.createVersion('Created via prompt method');

      // Also create a standalone version
      const standaloneVersion = new bedrock.PromptVersion(stack, 'StandaloneVersion', {
        prompt,
        description: 'Created as standalone construct',
      });

      expect(promptVersion).toBeDefined();
      expect(promptVersion.version).toBeDefined();
      expect(promptVersion.versionArn).toBeDefined();
      expect(promptVersion.prompt).toBe(prompt);
      expect(standaloneVersion.version).toBeDefined();

      Template.fromStack(stack).resourceCountIs('AWS::Bedrock::PromptVersion', 2);
    });
  });

  describe('attributes', () => {
    test('exposes correct attributes', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        description: 'Test prompt description',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: 'Test version description',
      });

      // Check that all attributes are defined
      expect(promptVersion.prompt).toBeDefined();
      expect(promptVersion.versionArn).toBeDefined();
      expect(promptVersion.version).toBeDefined();

      // Check that the prompt reference is correct
      expect(promptVersion.prompt).toBe(prompt);
    });

    test('version ARN follows expected format', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
      });

      // The version ARN should be defined and be a CloudFormation reference
      expect(promptVersion.versionArn).toBeDefined();
      expect(typeof promptVersion.versionArn).toBe('string');
    });

    test('version string is defined', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
      });

      // The version should be defined and be a CloudFormation reference
      expect(promptVersion.version).toBeDefined();
      expect(typeof promptVersion.version).toBe('string');
    });
  });

  describe('edge cases', () => {
    test('handles undefined description', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: undefined,
      });

      expect(promptVersion.prompt).toBe(prompt);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        Description: Match.absent(),
      });
    });

    test('handles empty description', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: '',
      });

      expect(promptVersion.prompt).toBe(prompt);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        Description: '',
      });
    });

    test('throws error for description longer than 200 characters', () => {
      const longDescription = 'A'.repeat(201);
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      expect(() => {
        new bedrock.PromptVersion(stack, 'TestPromptVersion', {
          prompt,
          description: longDescription,
        });
      }).toThrow('Description must be 200 characters or less, got 201 characters.');
    });

    test('accepts description with exactly 200 characters', () => {
      const maxDescription = 'A'.repeat(200);
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: maxDescription,
      });

      expect(promptVersion.prompt).toBe(prompt);
      expect(promptVersion.description).toBe(maxDescription);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        Description: maxDescription,
      });
    });

    test('handles special characters in description', () => {
      const specialDescription = 'Version with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: specialDescription,
      });

      expect(promptVersion.prompt).toBe(prompt);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        Description: specialDescription,
      });
    });

    test('handles multiline description', () => {
      const multilineDescription = `This is a multiline description.
It spans multiple lines.
And includes various details about the version.`;

      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const promptVersion = new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: multilineDescription,
      });

      expect(promptVersion.prompt).toBe(prompt);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        Description: multilineDescription,
      });
    });
  });

  describe('CloudFormation properties', () => {
    test('generates correct CloudFormation template', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
        description: 'Test version',
      });

      const template = Template.fromStack(stack);

      // Should have one prompt and one prompt version
      template.resourceCountIs('AWS::Bedrock::Prompt', 1);
      template.resourceCountIs('AWS::Bedrock::PromptVersion', 1);

      // Check the prompt version properties
      template.hasResourceProperties('AWS::Bedrock::PromptVersion', {
        PromptArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
        },
        Description: 'Test version',
      });
    });

    test('references prompt ARN correctly', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      new bedrock.PromptVersion(stack, 'TestPromptVersion', {
        prompt,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        PromptArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
        },
      });
    });
  });
});
