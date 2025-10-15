import { App, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../bedrock';

describe('Prompt', () => {
  let stack: Stack;
  let foundationModel: bedrock.IBedrockInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'test-stack');
    foundationModel = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V2_0;
  });

  describe('basic functionality', () => {
    test('creates prompt with minimal properties', () => {
      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Prompt', {
        Name: 'test-prompt',
        Description: Match.absent(),
        CustomerEncryptionKeyArn: Match.absent(),
        DefaultVariant: Match.absent(),
        Variants: [],
        Tags: Match.absent(),
      });
    });

    test('creates prompt with all properties', () => {
      const key = new kms.Key(stack, 'TestKey');
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'test-variant',
        model: foundationModel,
        promptText: 'Hello {{name}}!',
        promptVariables: ['name'],
      });

      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        description: 'Test prompt description',
        kmsKey: key,
        defaultVariant: textVariant,
        variants: [textVariant],
        tags: {
          Environment: 'test',
          Project: 'bedrock-prompts',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Prompt', {
        Name: 'test-prompt',
        Description: 'Test prompt description',
        CustomerEncryptionKeyArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestKey[A-Z0-9]+'), 'Arn'],
        },
        DefaultVariant: 'test-variant',
        Variants: [
          {
            Name: 'test-variant',
            TemplateType: 'TEXT',
            ModelId: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':bedrock:',
                  { Ref: 'AWS::Region' },
                  '::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
                ],
              ],
            },
            TemplateConfiguration: {
              Text: {
                InputVariables: [{ Name: 'name' }],
                Text: 'Hello {{name}}!',
              },
            },
          },
        ],
        Tags: {
          Environment: 'test',
          Project: 'bedrock-prompts',
        },
      });
    });

    test('creates prompt with single variant', () => {
      const textVariant = bedrock.PromptVariant.text({
        variantName: 'variant-1',
        model: foundationModel,
        promptText: 'Hello {{name}}!',
        promptVariables: ['name'],
      });

      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [textVariant],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Prompt', {
        Variants: Match.arrayWith([
          Match.objectLike({ Name: 'variant-1' }),
        ]),
      });
    });

    test('throws error when creating prompt with multiple variants', () => {
      const textVariant1 = bedrock.PromptVariant.text({
        variantName: 'variant-1',
        model: foundationModel,
        promptText: 'Hello {{name}}!',
        promptVariables: ['name'],
      });

      const textVariant2 = bedrock.PromptVariant.text({
        variantName: 'variant-2',
        model: foundationModel,
        promptText: 'Hi {{name}}, how are you?',
        promptVariables: ['name'],
      });

      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [textVariant1, textVariant2],
      });

      // The error should occur during synthesis, not construction
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/Too many variants specified. The maximum allowed is 1, but you have provided 2 variants/);
    });
  });

  describe('validation', () => {
    test('validates prompt name pattern - valid names', () => {
      const validNames = [
        'test-prompt',
        'test_prompt',
        'TestPrompt123',
        'a',
        'a'.repeat(100),
      ];

      validNames.forEach((name, index) => {
        expect(() => {
          new bedrock.Prompt(stack, `TestPrompt${index}`, {
            promptName: name,
          });
        }).not.toThrow();
      });
    });

    test.each([
      ['-invalid', 'starts with hyphen'],
      ['a'.repeat(101), 'too long'],
      ['', 'empty'],
      ['invalid name', 'contains space'],
      ['invalid@name', 'contains special character'],
    ])('validates prompt name pattern - %s (%s)', (invalidName, _description) => {
      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: invalidName,
      });

      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/Valid characters are a-z, A-Z, 0-9, _ \(underscore\) and - \(hyphen\). Must not begin with a hyphen and must be 1-100 characters long/);
    });

    test('validates description length', () => {
      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        description: 'a'.repeat(251), // too long
      });

      // Validation happens at synthesis time, not construction time
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/Description must be 200 characters or less/);
    });

    test('validates maximum number of variants', () => {
      const variants = Array.from({ length: 4 }, (_, i) =>
        bedrock.PromptVariant.text({
          variantName: `variant-${i}`,
          model: foundationModel,
          promptText: `Text ${i}`,
        }),
      );

      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants,
      });

      // Validation happens at synthesis time, not construction time
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/Too many variants specified/);
    });

    test('validates unique variant names', () => {
      const variant1 = bedrock.PromptVariant.text({
        variantName: 'duplicate-name',
        model: foundationModel,
        promptText: 'Text 1',
      });

      const variant2 = bedrock.PromptVariant.text({
        variantName: 'duplicate-name',
        model: foundationModel,
        promptText: 'Text 2',
      });

      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [variant1, variant2],
      });

      // Validation happens at synthesis time, not construction time
      expect(() => {
        Template.fromStack(stack);
      }).toThrow(/Duplicate variant names found/);
    });

    test('validates default variant is added to variants array', () => {
      const defaultVariant = bedrock.PromptVariant.text({
        variantName: 'default-variant',
        model: foundationModel,
        promptText: 'Text',
      });

      expect(() => {
        new bedrock.Prompt(stack, 'TestPrompt', {
          promptName: 'my-test-prompt',
          defaultVariant: defaultVariant,
        });
      }).toThrow('The \'defaultVariant\' needs to be included in the \'variants\' array.');
    });
  });

  describe('methods', () => {
    test('addVariant adds a variant successfully', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const variant = bedrock.PromptVariant.text({
        variantName: 'new-variant',
        model: foundationModel,
        promptText: 'Hello world!',
      });

      prompt.addVariant(variant);

      expect(prompt.variants).toHaveLength(1);
      expect(prompt.variants[0].name).toBe('new-variant');
    });

    test('addVariant throws error when exceeding maximum variants', () => {
      const existingVariant = bedrock.PromptVariant.text({
        variantName: 'existing-variant',
        model: foundationModel,
        promptText: 'Existing text',
      });

      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [existingVariant], // Already at max capacity (1 variant)
      });

      const newVariant = bedrock.PromptVariant.text({
        variantName: 'new-variant',
        model: foundationModel,
        promptText: 'New text',
      });

      expect(() => {
        prompt.addVariant(newVariant);
      }).toThrow(/Cannot add variant to prompt 'test-prompt'/);
    });

    test('addVariant throws error for duplicate variant name', () => {
      const existingVariant = bedrock.PromptVariant.text({
        variantName: 'existing-variant',
        model: foundationModel,
        promptText: 'Existing text',
      });

      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [existingVariant],
      });

      const duplicateVariant = bedrock.PromptVariant.text({
        variantName: 'existing-variant',
        model: foundationModel,
        promptText: 'Duplicate text',
      });

      expect(() => {
        prompt.addVariant(duplicateVariant);
      }).toThrow(/Variant with name 'existing-variant' already exists/);
    });

    test('createVersion creates a prompt version', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const version = prompt.createVersion('Test version');

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::PromptVersion', {
        PromptArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
        },
        Description: 'Test version',
      });

      expect(version).toBeDefined();
      expect(version.version).toBeDefined();
      expect(version.versionArn).toBeDefined();
      expect(version.prompt).toBe(prompt);
    });

    test('grantGet grants correct permissions', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
      });

      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      prompt.grantGet(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'bedrock:GetPrompt',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [Match.stringLikeRegexp('TestPrompt[A-Z0-9]+'), 'Arn'],
              },
            }),
          ]),
        },
      });
    });
  });

  describe('static methods', () => {
    test('fromPromptAttributes creates prompt from attributes', () => {
      const importedPrompt = bedrock.Prompt.fromPromptAttributes(stack, 'ImportedPrompt', {
        promptArn: 'arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345',
        promptVersion: '1',
      });

      expect(importedPrompt.promptArn).toBe('arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345');
      expect(importedPrompt.promptId).toBe('PROMPT12345');
      expect(importedPrompt.promptVersion).toBe('1');
      expect(importedPrompt.kmsKey).toBeUndefined();
    });

    test('fromPromptAttributes uses default version when not provided', () => {
      const importedPrompt = bedrock.Prompt.fromPromptAttributes(stack, 'ImportedPrompt', {
        promptArn: 'arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345',
      });

      expect(importedPrompt.promptVersion).toBe('DRAFT');
    });

    test('fromPromptAttributes includes KMS key when provided', () => {
      const key = new kms.Key(stack, 'ImportedKey');
      const importedPrompt = bedrock.Prompt.fromPromptAttributes(stack, 'ImportedPrompt', {
        promptArn: 'arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345',
        kmsKey: key,
      });

      expect(importedPrompt.kmsKey).toBe(key);
    });
  });

  describe('attributes', () => {
    test('exposes correct attributes', () => {
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        description: 'Test description',
      });

      expect(prompt.promptName).toBe('test-prompt');
      expect(prompt.description).toBe('Test description');
      expect(prompt.promptArn).toBeDefined();
      expect(prompt.promptId).toBeDefined();
      expect(prompt.promptVersion).toBeDefined();
      expect(prompt.variants).toEqual([]);
    });

    test('exposes KMS key when provided', () => {
      const key = new kms.Key(stack, 'TestKey');
      const prompt = new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        kmsKey: key,
      });

      expect(prompt.kmsKey).toBe(key);
    });
  });

  describe('edge cases', () => {
    test('handles empty variants array', () => {
      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        variants: [],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Prompt', {
        Variants: [],
      });
    });

    test('handles undefined optional properties', () => {
      new bedrock.Prompt(stack, 'TestPrompt', {
        promptName: 'test-prompt',
        description: undefined,
        kmsKey: undefined,
        defaultVariant: undefined,
        variants: undefined,
        tags: undefined,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Prompt', {
        Name: 'test-prompt',
        Description: Match.absent(),
        CustomerEncryptionKeyArn: Match.absent(),
        DefaultVariant: Match.absent(),
        Variants: [],
        Tags: Match.absent(),
      });
    });
  });
});
