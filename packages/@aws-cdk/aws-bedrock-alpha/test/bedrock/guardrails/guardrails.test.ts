import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../bedrock';
import * as kms from 'aws-cdk-lib/aws-kms';

describe('CDK-Created-Guardrail', () => {
  let stack: core.Stack;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'test-stack');
  });

  test('Basic Creation', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      // test defaults
      BlockedInputMessaging: 'Sorry, your query violates our usage policy.',
      BlockedOutputsMessaging: 'Sorry, I am unable to answer your question because of our usage policy.',
      // ensure others are undefined
      TopicPolicyConfig: Match.absent(),
      ContextualGroundingPolicyConfig: Match.absent(),
      ContentPolicyConfig: Match.absent(),
      WordPolicyConfig: Match.absent(),
      SensitiveInformationPolicyConfig: Match.absent(),
    });

    guardrail.name;
  });

  test('Custom Messaging Creation', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail with custom messaging',
      blockedInputMessaging: 'Custom input blocked message',
      blockedOutputsMessaging: 'Custom output blocked message',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail with custom messaging',
      BlockedInputMessaging: 'Custom input blocked message',
      BlockedOutputsMessaging: 'Custom output blocked message',
      // ensure others are undefined
      TopicPolicyConfig: Match.absent(),
      ContextualGroundingPolicyConfig: Match.absent(),
      ContentPolicyConfig: Match.absent(),
      WordPolicyConfig: Match.absent(),
      SensitiveInformationPolicyConfig: Match.absent(),
    });
  });

  test('Basic Creation + KMS Key', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      // test defaults"
      kmsKey: kms.Key.fromKeyArn(
        stack,
        'importedKey',
        'arn:aws:kms:eu-central-1:123456789012:key/06484191-7d55-49fb-9be7-0baaf7fe8418',
      ),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      KmsKeyArn: 'arn:aws:kms:eu-central-1:123456789012:key/06484191-7d55-49fb-9be7-0baaf7fe8418',
    });
  });

  test('Topic Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
      },
    });
  });

  test('Topic Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addDeniedTopicFilter(bedrock.Topic.FINANCIAL_ADVICE);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
      },
    });
  });

  test('Content Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      contentFilters: [
        {
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
      },
    });
  });

  test('Content Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addContentFilter({
      type: bedrock.ContentFilterType.MISCONDUCT,
      inputStrength: bedrock.ContentFilterStrength.LOW,
      outputStrength: bedrock.ContentFilterStrength.LOW,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
      },
    });
  });

  test('Contextual Grounding Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      contextualGroundingFilters: [
        {
          type: bedrock.ContextualGroundingFilterType.GROUNDING,
          threshold: 0.99,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContextualGroundingPolicyConfig: {
        FiltersConfig: [
          {
            Threshold: 0.99,
            Type: 'GROUNDING',
          },
        ],
      },
    });
  });

  test('Contextual Grounding Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addContextualGroundingFilter({
      type: bedrock.ContextualGroundingFilterType.GROUNDING,
      threshold: 0.99,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContextualGroundingPolicyConfig: {
        FiltersConfig: [
          {
            Threshold: 0.99,
            Type: 'GROUNDING',
          },
        ],
      },
    });
  });

  test('PII Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      piiFilters: [
        {
          type: bedrock.PIIType.General.ADDRESS,
          action: bedrock.GuardrailAction.ANONYMIZE,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      SensitiveInformationPolicyConfig: {
        PiiEntitiesConfig: [
          {
            Action: 'ANONYMIZE',
            Type: 'ADDRESS',
          },
        ],
      },
    });
  });

  test('PII Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addPIIFilter({
      type: bedrock.PIIType.General.ADDRESS,
      action: bedrock.GuardrailAction.ANONYMIZE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      SensitiveInformationPolicyConfig: {
        PiiEntitiesConfig: [
          {
            Action: 'ANONYMIZE',
            Type: 'ADDRESS',
          },
        ],
      },
    });
  });

  test('Regex Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      regexFilters: [
        {
          name: 'TestRegexFilter',
          description: 'This is a test regex filter',
          pattern: '/^[A-Z]{2}d{6}$/',
          action: bedrock.GuardrailAction.ANONYMIZE,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      SensitiveInformationPolicyConfig: {
        RegexesConfig: [
          {
            Action: 'ANONYMIZE',
            Name: 'TestRegexFilter',
            Pattern: '/^[A-Z]{2}d{6}$/',
            Description: 'This is a test regex filter',
          },
        ],
      },
    });
  });

  test('Regex Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addRegexFilter({
      name: 'TestRegexFilter',
      description: 'This is a test regex filter',
      pattern: '/^[A-Z]{2}d{6}$/',
      action: bedrock.GuardrailAction.ANONYMIZE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      SensitiveInformationPolicyConfig: {
        RegexesConfig: [
          {
            Action: 'ANONYMIZE',
            Name: 'TestRegexFilter',
            Pattern: '/^[A-Z]{2}d{6}$/',
            Description: 'This is a test regex filter',
          },
        ],
      },
    });
  });

  describe('RegexFilter validation', () => {
    test('validates name length - too short', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: '', // Empty name
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: The field name is 0 characters long but must be at least 1 characters/);
    });

    test('validates name length - too long', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'a'.repeat(101), // 101 characters
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: The field name is 101 characters long but must be less than or equal to 100 characters/);
    });

    test('validates description length - too short', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              description: '', // Empty description
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: The field description is 0 characters long but must be at least 1 characters/);
    });

    test('validates description length - too long', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              description: 'a'.repeat(1001), // 1001 characters
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: The field description is 1001 characters long but must be less than or equal to 1000 characters/);
    });

    test('validates pattern length - too short', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              pattern: '', // Empty pattern
              action: bedrock.GuardrailAction.ANONYMIZE,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: The field pattern is 0 characters long but must be at least 1 characters/);
    });

    test('validates addRegexFilter method', () => {
      const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
      });

      expect(() => {
        guardrail.addRegexFilter({
          name: '', // Empty name
          pattern: '/^[A-Z]{2}d{6}$/',
          action: bedrock.GuardrailAction.ANONYMIZE,
        });
      }).toThrow(/Invalid RegexFilter: The field name is 0 characters long but must be at least 1 characters/);
    });

    test('accepts valid RegexFilter', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              description: 'A valid description',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
            },
          ],
        });
      }).not.toThrow();
    });
  });

  test('Word Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      wordFilters: [
        {
          text: 'reggaeton',
        },
        {
          text: 'alcohol',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      WordPolicyConfig: {
        WordsConfig: [
          {
            Text: 'reggaeton',
          },
          {
            Text: 'alcohol',
          },
        ],
      },
    });
  });

  test('Word Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addWordFilter({
      text: 'reggaeton',
    });
    guardrail.addWordFilter({
      text: 'alcohol',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      WordPolicyConfig: {
        WordsConfig: [
          {
            Text: 'reggaeton',
          },
          {
            Text: 'alcohol',
          },
        ],
      },
    });
  });

  test('Managed Word Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      managedWordListFilters: [
        {
          type: bedrock.ManagedWordFilterType.PROFANITY,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      WordPolicyConfig: {
        ManagedWordListsConfig: [
          {
            Type: 'PROFANITY',
          },
        ],
      },
    });
  });

  test('Managed Word Filter - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addManagedWordListFilter({
      type: bedrock.ManagedWordFilterType.PROFANITY,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      WordPolicyConfig: {
        ManagedWordListsConfig: [
          {
            Type: 'PROFANITY',
          },
        ],
      },
    });
  });

  test('All filters - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
      contentFilters: [
        {
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
        },
      ],
      contextualGroundingFilters: [
        {
          type: bedrock.ContextualGroundingFilterType.GROUNDING,
          threshold: 0.99,
        },
      ],
      piiFilters: [
        {
          type: bedrock.PIIType.General.ADDRESS,
          action: bedrock.GuardrailAction.ANONYMIZE,
        },
      ],
      regexFilters: [
        {
          name: 'TestRegexFilter',
          description: 'This is a test regex filter',
          pattern: '/^[A-Z]{2}d{6}$/',
          action: bedrock.GuardrailAction.ANONYMIZE,
        },
      ],
      wordFilters: [
        {
          text: 'reggaeton',
        },
        {
          text: 'alcohol',
        },
      ],
      managedWordListFilters: [
        {
          type: bedrock.ManagedWordFilterType.PROFANITY,
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
      },
      ContextualGroundingPolicyConfig: {
        FiltersConfig: [
          {
            Threshold: 0.99,
            Type: 'GROUNDING',
          },
        ],
      },
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
      },
      WordPolicyConfig: {
        WordsConfig: [
          {
            Text: 'reggaeton',
          },
          {
            Text: 'alcohol',
          },
        ],
        ManagedWordListsConfig: [
          {
            Type: 'PROFANITY',
          },
        ],
      },
      SensitiveInformationPolicyConfig: {
        RegexesConfig: [
          {
            Action: 'ANONYMIZE',
            Name: 'TestRegexFilter',
            Pattern: '/^[A-Z]{2}d{6}$/',
            Description: 'This is a test regex filter',
          },
        ],
        PiiEntitiesConfig: [
          {
            Action: 'ANONYMIZE',
            Type: 'ADDRESS',
          },
        ],
      },
    });
  });

  test('All filters - Method', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addDeniedTopicFilter(bedrock.Topic.FINANCIAL_ADVICE);

    guardrail.addContentFilter({
      type: bedrock.ContentFilterType.MISCONDUCT,
      inputStrength: bedrock.ContentFilterStrength.LOW,
      outputStrength: bedrock.ContentFilterStrength.LOW,
    });

    guardrail.addContextualGroundingFilter({
      type: bedrock.ContextualGroundingFilterType.GROUNDING,
      threshold: 0.99,
    });

    guardrail.addWordFilter({
      text: 'reggaeton',
    });
    guardrail.addWordFilter({
      text: 'alcohol',
    });

    guardrail.addManagedWordListFilter({
      type: bedrock.ManagedWordFilterType.PROFANITY,
    });

    guardrail.addPIIFilter({
      type: bedrock.PIIType.General.ADDRESS,
      action: bedrock.GuardrailAction.ANONYMIZE,
    });
    guardrail.addRegexFilter({
      name: 'TestRegexFilter',
      description: 'This is a test regex filter',
      pattern: '/^[A-Z]{2}d{6}$/',
      action: bedrock.GuardrailAction.ANONYMIZE,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
      },
      ContextualGroundingPolicyConfig: {
        FiltersConfig: [
          {
            Threshold: 0.99,
            Type: 'GROUNDING',
          },
        ],
      },
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
      },
      WordPolicyConfig: {
        WordsConfig: [
          {
            Text: 'reggaeton',
          },
          {
            Text: 'alcohol',
          },
        ],
        ManagedWordListsConfig: [
          {
            Type: 'PROFANITY',
          },
        ],
      },
      SensitiveInformationPolicyConfig: {
        RegexesConfig: [
          {
            Action: 'ANONYMIZE',
            Name: 'TestRegexFilter',
            Pattern: '/^[A-Z]{2}d{6}$/',
            Description: 'This is a test regex filter',
          },
        ],
        PiiEntitiesConfig: [
          {
            Action: 'ANONYMIZE',
            Type: 'ADDRESS',
          },
        ],
      },
    });
  });

  test('Versioning', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
    });

    guardrail.addDeniedTopicFilter(bedrock.Topic.FINANCIAL_ADVICE);

    guardrail.createVersion();

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::GuardrailVersion', {
      GuardrailIdentifier: {
        'Fn::GetAtt': [Match.anyValue(), 'GuardrailId'],
      },
    });
  });

  test('Content Filter with Tier Configuration - CLASSIC', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      contentFilters: [
        {
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
        },
      ],
      contentFiltersTierConfig: bedrock.TierConfig.CLASSIC,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
        ContentFiltersTierConfig: {
          TierName: 'CLASSIC',
        },
      },
    });
  });

  test('Content Filter with Tier Configuration - STANDARD', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      contentFilters: [
        {
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
        },
      ],
      contentFiltersTierConfig: bedrock.TierConfig.STANDARD,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
        ContentFiltersTierConfig: {
          TierName: 'STANDARD',
        },
      },
    });
  });

  test('Topic Filter with Tier Configuration - CLASSIC', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
      topicsTierConfig: bedrock.TierConfig.CLASSIC,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
        TopicsTierConfig: {
          TierName: 'CLASSIC',
        },
      },
    });
  });

  test('Topic Filter with Tier Configuration - STANDARD', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
      topicsTierConfig: bedrock.TierConfig.STANDARD,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
        TopicsTierConfig: {
          TierName: 'STANDARD',
        },
      },
    });
  });

  test('Both Content and Topic Filters with Tier Configuration', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      contentFilters: [
        {
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
        },
      ],
      contentFiltersTierConfig: bedrock.TierConfig.STANDARD,
      deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
      topicsTierConfig: bedrock.TierConfig.CLASSIC,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
        ContentFiltersTierConfig: {
          TierName: 'STANDARD',
        },
      },
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
        TopicsTierConfig: {
          TierName: 'CLASSIC',
        },
      },
    });
  });

  test('Default Tier Configuration - CLASSIC', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      contentFilters: [
        {
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
        },
      ],
      deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      ContentPolicyConfig: {
        FiltersConfig: [
          {
            InputStrength: 'LOW',
            OutputStrength: 'LOW',
            Type: 'MISCONDUCT',
          },
        ],
        ContentFiltersTierConfig: {
          TierName: 'CLASSIC',
        },
      },
      TopicPolicyConfig: {
        TopicsConfig: [
          {
            Definition:
                "'Discussions that involve providing guidance, recommendations, or suggestions related to managing, investing, or handling finances, investments, or assets.",
            Examples: [
              'Can you suggest some good stocks to invest in right now?',
              "What's the best way to save for retirement?",
              'Should I put my money in a high-risk investment?',
              'How can I maximize my returns on investments?',
              'Is it a good time to buy real estate?',
            ],
            Name: 'Financial_Advice',
            Type: 'DENY',
          },
        ],
        TopicsTierConfig: {
          TierName: 'CLASSIC',
        },
      },
    });
  });

  describe('Messaging validation', () => {
    test('validates blockedInputMessaging length - too short', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedInputMessaging: '', // Empty message
        });
      }).toThrow(/Invalid blockedInputMessaging: The field blockedInputMessaging is 0 characters long but must be at least 1 characters/);
    });

    test('validates blockedInputMessaging length - too long', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedInputMessaging: 'a'.repeat(501), // 501 characters
        });
      }).toThrow(/Invalid blockedInputMessaging: The field blockedInputMessaging is 501 characters long but must be less than or equal to 500 characters/);
    });

    test('validates blockedOutputsMessaging length - too short', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedOutputsMessaging: '', // Empty message
        });
      }).toThrow(/Invalid blockedOutputsMessaging: The field blockedOutputsMessaging is 0 characters long but must be at least 1 characters/);
    });

    test('validates blockedOutputsMessaging length - too long', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedOutputsMessaging: 'a'.repeat(501), // 501 characters
        });
      }).toThrow(/Invalid blockedOutputsMessaging: The field blockedOutputsMessaging is 501 characters long but must be less than or equal to 500 characters/);
    });

    test('accepts valid blockedInputMessaging', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedInputMessaging: 'This is a valid custom message for blocked input.',
        });
      }).not.toThrow();
    });

    test('accepts valid blockedOutputsMessaging', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedOutputsMessaging: 'This is a valid custom message for blocked output.',
        });
      }).not.toThrow();
    });

    test('accepts minimum length messaging', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedInputMessaging: 'A', // 1 character
          blockedOutputsMessaging: 'B', // 1 character
        });
      }).not.toThrow();
    });

    test('accepts maximum length messaging', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          blockedInputMessaging: 'a'.repeat(500), // Exactly 500 characters
          blockedOutputsMessaging: 'b'.repeat(500), // Exactly 500 characters
        });
      }).not.toThrow();
    });

    test('accepts undefined messaging (uses defaults)', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          // No messaging properties - should use defaults
        });
      }).not.toThrow();
    });
  });

  test('Custom Topic Validation - Examples Field Constraints', () => {
    // Test that creating a custom topic with no examples throws an error
    expect(() => {
      bedrock.Topic.custom({
        name: 'TestTopic',
        definition: 'A test topic definition',
        examples: [],
      });
    }).toThrow('examples field must contain at least 1 example');

    // Test that creating a custom topic with more than 100 examples throws an error
    expect(() => {
      const tooManyExamples = Array.from({ length: 101 }, (_, i) => `Example ${i + 1}`);
      bedrock.Topic.custom({
        name: 'TestTopic',
        definition: 'A test topic definition',
        examples: tooManyExamples,
      });
    }).toThrow('examples field cannot contain more than 100 examples');

    // Test that creating a custom topic with valid examples (1-100) works
    expect(() => {
      bedrock.Topic.custom({
        name: 'TestTopic',
        definition: 'A test topic definition',
        examples: ['Valid example'],
      });
    }).not.toThrow();

    // Test that creating a custom topic with exactly 100 examples works
    expect(() => {
      const exactly100Examples = Array.from({ length: 100 }, (_, i) => `Example ${i + 1}`);
      bedrock.Topic.custom({
        name: 'TestTopic',
        definition: 'A test topic definition',
        examples: exactly100Examples,
      });
    }).not.toThrow();
  });
});

describe('Imported-Guardrail', () => {
  let stack: core.Stack;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'TestStack2', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Basic Import - ARN', () => {
    const guardrail = bedrock.Guardrail.fromGuardrailAttributes(stack, 'TestGuardrail', {
      guardrailArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail/oygh3o8g7rtl',
    });

    expect(guardrail.guardrailArn).toBe('arn:aws:bedrock:us-east-1:123456789012:guardrail/oygh3o8g7rtl');
    expect(guardrail.guardrailId).toBe('oygh3o8g7rtl');
    expect(guardrail.guardrailVersion).toBe('DRAFT');
    expect(guardrail.kmsKey).toBeUndefined();
  });

  test('Basic Import - ARN + KMS + Version', () => {
    const kmsKey = kms.Key.fromKeyArn(
      stack,
      'importedKey',
      'arn:aws:kms:eu-central-1:123456789012:key/06484191-7d55-49fb-9be7-0baaf7fe8418',
    );
    const guardrail = bedrock.Guardrail.fromGuardrailAttributes(stack, 'TestGuardrail', {
      guardrailArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail/oygh3o8g7rtl',
      guardrailVersion: '1',
      kmsKey: kmsKey,
    });

    expect(guardrail.guardrailArn).toBe('arn:aws:bedrock:us-east-1:123456789012:guardrail/oygh3o8g7rtl');
    expect(guardrail.guardrailId).toBe('oygh3o8g7rtl');
    expect(guardrail.guardrailVersion).toBe('1');
    expect(guardrail.kmsKey!.keyArn).toBe(
      'arn:aws:kms:eu-central-1:123456789012:key/06484191-7d55-49fb-9be7-0baaf7fe8418',
    );
  });
});
