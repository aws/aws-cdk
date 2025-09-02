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

  describe('Topic validation', () => {
    test('validates inputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          deniedTopics: [
            {
              name: 'TestTopic',
              definition: 'A test topic definition',
              examples: ['Example 1'],
              inputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid Topic at index 0: inputAction must be a valid GuardrailAction value/);
    });

    test('validates outputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          deniedTopics: [
            {
              name: 'TestTopic',
              definition: 'A test topic definition',
              examples: ['Example 1'],
              outputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid Topic at index 0: outputAction must be a valid GuardrailAction value/);
    });

    test('validates inputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          deniedTopics: [
            {
              name: 'TestTopic',
              definition: 'A test topic definition',
              examples: ['Example 1'],
              inputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid Topic at index 0: inputEnabled must be a boolean value/);
    });

    test('validates outputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          deniedTopics: [
            {
              name: 'TestTopic',
              definition: 'A test topic definition',
              examples: ['Example 1'],
              outputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid Topic at index 0: outputEnabled must be a boolean value/);
    });

    test('accepts Topic with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          deniedTopics: [
            {
              name: 'TestTopic',
              definition: 'A test topic definition',
              examples: ['Example 1'],
              inputAction: bedrock.GuardrailAction.BLOCK,
              inputEnabled: true,
              outputAction: bedrock.GuardrailAction.NONE,
              outputEnabled: false,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional Topic properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        deniedTopics: [
          {
            name: 'TestTopic',
            definition: 'A test topic definition',
            examples: ['Example 1'],
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        TopicPolicyConfig: {
          TopicsConfig: [
            {
              Name: 'TestTopic',
              Definition: 'A test topic definition',
              Examples: ['Example 1'],
              Type: 'DENY',
              InputAction: 'BLOCK',
              InputEnabled: true,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional Topic properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        deniedTopics: [
          {
            name: 'TestTopic',
            definition: 'A test topic definition',
            examples: ['Example 1'],
            inputAction: bedrock.GuardrailAction.NONE,
            inputEnabled: false,
            outputAction: bedrock.GuardrailAction.BLOCK,
            outputEnabled: true,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        TopicPolicyConfig: {
          TopicsConfig: [
            {
              Name: 'TestTopic',
              Definition: 'A test topic definition',
              Examples: ['Example 1'],
              Type: 'DENY',
              InputAction: 'NONE',
              InputEnabled: false,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
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

  describe('ContentFilter validation', () => {
    test('validates inputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFilters: [
            {
              type: bedrock.ContentFilterType.MISCONDUCT,
              inputStrength: bedrock.ContentFilterStrength.LOW,
              outputStrength: bedrock.ContentFilterStrength.LOW,
              inputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid ContentFilter at index 0: inputAction must be a valid GuardrailAction value/);
    });

    test('validates outputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFilters: [
            {
              type: bedrock.ContentFilterType.MISCONDUCT,
              inputStrength: bedrock.ContentFilterStrength.LOW,
              outputStrength: bedrock.ContentFilterStrength.LOW,
              outputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid ContentFilter at index 0: outputAction must be a valid GuardrailAction value/);
    });

    test('validates inputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFilters: [
            {
              type: bedrock.ContentFilterType.MISCONDUCT,
              inputStrength: bedrock.ContentFilterStrength.LOW,
              outputStrength: bedrock.ContentFilterStrength.LOW,
              inputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid ContentFilter at index 0: inputEnabled must be a boolean value/);
    });

    test('validates outputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFilters: [
            {
              type: bedrock.ContentFilterType.MISCONDUCT,
              inputStrength: bedrock.ContentFilterStrength.LOW,
              outputStrength: bedrock.ContentFilterStrength.LOW,
              outputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid ContentFilter at index 0: outputEnabled must be a boolean value/);
    });

    test('accepts ContentFilter with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFilters: [
            {
              type: bedrock.ContentFilterType.MISCONDUCT,
              inputStrength: bedrock.ContentFilterStrength.LOW,
              outputStrength: bedrock.ContentFilterStrength.LOW,
              inputAction: bedrock.GuardrailAction.BLOCK,
              inputEnabled: true,
              outputAction: bedrock.GuardrailAction.NONE,
              outputEnabled: false,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional ContentFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        contentFilters: [
          {
            type: bedrock.ContentFilterType.MISCONDUCT,
            inputStrength: bedrock.ContentFilterStrength.LOW,
            outputStrength: bedrock.ContentFilterStrength.LOW,
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        ContentPolicyConfig: {
          FiltersConfig: [
            {
              InputStrength: 'LOW',
              OutputStrength: 'LOW',
              Type: 'MISCONDUCT',
              InputAction: 'BLOCK',
              InputEnabled: true,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional ContentFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        contentFilters: [
          {
            type: bedrock.ContentFilterType.MISCONDUCT,
            inputStrength: bedrock.ContentFilterStrength.LOW,
            outputStrength: bedrock.ContentFilterStrength.LOW,
            inputAction: bedrock.GuardrailAction.NONE,
            inputEnabled: false,
            outputAction: bedrock.GuardrailAction.BLOCK,
            outputEnabled: true,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        ContentPolicyConfig: {
          FiltersConfig: [
            {
              InputStrength: 'LOW',
              OutputStrength: 'LOW',
              Type: 'MISCONDUCT',
              InputAction: 'NONE',
              InputEnabled: false,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('validates addContentFilter with clear error message', () => {
      const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
      });

      expect(() => {
        guardrail.addContentFilter({
          type: bedrock.ContentFilterType.MISCONDUCT,
          inputStrength: bedrock.ContentFilterStrength.LOW,
          outputStrength: bedrock.ContentFilterStrength.LOW,
          inputAction: 'INVALID_ACTION' as any,
        });
      }).toThrow(/Invalid ContentFilter: inputAction must be a valid GuardrailAction value/);
    });

    test('validates all add filter methods with clear error messages', () => {
      const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
      });

      // Test addPIIFilter
      expect(() => {
        guardrail.addPIIFilter({
          type: bedrock.GeneralPIIType.ADDRESS,
          action: bedrock.GuardrailAction.BLOCK,
          inputAction: 'INVALID_ACTION' as any,
        });
      }).toThrow(/Invalid PIIFilter: inputAction must be a valid GuardrailAction value/);

      // Test addRegexFilter
      expect(() => {
        guardrail.addRegexFilter({
          name: 'test',
          pattern: 'test',
          action: bedrock.GuardrailAction.BLOCK,
          inputAction: 'INVALID_ACTION' as any,
        });
      }).toThrow(/Invalid RegexFilter: inputAction must be a valid GuardrailAction value/);

      // Test addWordFilter
      expect(() => {
        guardrail.addWordFilter({
          text: 'test',
          inputAction: 'INVALID_ACTION' as any,
        });
      }).toThrow(/Invalid WordFilter: inputAction must be a valid GuardrailAction value/);

      // Test addManagedWordListFilter
      expect(() => {
        guardrail.addManagedWordListFilter({
          inputAction: 'INVALID_ACTION' as any,
        });
      }).toThrow(/Invalid ManagedWordFilter: inputAction must be a valid GuardrailAction value/);
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

  describe('ContextualGroundingFilter validation', () => {
    test('validates action is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contextualGroundingFilters: [
            {
              type: bedrock.ContextualGroundingFilterType.GROUNDING,
              threshold: 0.99,
              action: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid ContextualGroundingFilter at index 0: action must be a valid GuardrailAction value/);
    });

    test('validates enabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contextualGroundingFilters: [
            {
              type: bedrock.ContextualGroundingFilterType.GROUNDING,
              threshold: 0.99,
              enabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid ContextualGroundingFilter at index 0: enabled must be a boolean value/);
    });

    test('accepts ContextualGroundingFilter with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contextualGroundingFilters: [
            {
              type: bedrock.ContextualGroundingFilterType.GROUNDING,
              threshold: 0.99,
              action: bedrock.GuardrailAction.BLOCK,
              enabled: true,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional ContextualGroundingFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        contextualGroundingFilters: [
          {
            type: bedrock.ContextualGroundingFilterType.GROUNDING,
            threshold: 0.99,
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        ContextualGroundingPolicyConfig: {
          FiltersConfig: [
            {
              Threshold: 0.99,
              Type: 'GROUNDING',
              Action: 'BLOCK',
              Enabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional ContextualGroundingFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        contextualGroundingFilters: [
          {
            type: bedrock.ContextualGroundingFilterType.GROUNDING,
            threshold: 0.99,
            action: bedrock.GuardrailAction.NONE,
            enabled: false,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        ContextualGroundingPolicyConfig: {
          FiltersConfig: [
            {
              Threshold: 0.99,
              Type: 'GROUNDING',
              Action: 'NONE',
              Enabled: false,
            },
          ],
        },
      });
    });
  });

  test('PII Filter - Props', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail',
      piiFilters: [
        {
          type: bedrock.GeneralPIIType.ADDRESS,
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
      type: bedrock.GeneralPIIType.ADDRESS,
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

  describe('PIIFilter validation', () => {
    test('validates action is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          piiFilters: [
            {
              type: bedrock.GeneralPIIType.ADDRESS,
              action: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid PIIFilter at index 0: action must be a valid GuardrailAction value/);
    });

    test('validates inputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          piiFilters: [
            {
              type: bedrock.GeneralPIIType.ADDRESS,
              action: bedrock.GuardrailAction.ANONYMIZE,
              inputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid PIIFilter at index 0: inputAction must be a valid GuardrailAction value/);
    });

    test('validates outputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          piiFilters: [
            {
              type: bedrock.GeneralPIIType.ADDRESS,
              action: bedrock.GuardrailAction.ANONYMIZE,
              outputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid PIIFilter at index 0: outputAction must be a valid GuardrailAction value/);
    });

    test('validates inputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          piiFilters: [
            {
              type: bedrock.GeneralPIIType.ADDRESS,
              action: bedrock.GuardrailAction.ANONYMIZE,
              inputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid PIIFilter at index 0: inputEnabled must be a boolean value/);
    });

    test('validates outputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          piiFilters: [
            {
              type: bedrock.GeneralPIIType.ADDRESS,
              action: bedrock.GuardrailAction.ANONYMIZE,
              outputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid PIIFilter at index 0: outputEnabled must be a boolean value/);
    });

    test('accepts PIIFilter with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          piiFilters: [
            {
              type: bedrock.GeneralPIIType.ADDRESS,
              action: bedrock.GuardrailAction.ANONYMIZE,
              inputAction: bedrock.GuardrailAction.BLOCK,
              inputEnabled: true,
              outputAction: bedrock.GuardrailAction.NONE,
              outputEnabled: false,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional PIIFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        piiFilters: [
          {
            type: bedrock.GeneralPIIType.ADDRESS,
            action: bedrock.GuardrailAction.ANONYMIZE,
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        SensitiveInformationPolicyConfig: {
          PiiEntitiesConfig: [
            {
              Action: 'ANONYMIZE',
              Type: 'ADDRESS',
              InputAction: 'BLOCK',
              InputEnabled: true,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional PIIFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        piiFilters: [
          {
            type: bedrock.GeneralPIIType.ADDRESS,
            action: bedrock.GuardrailAction.ANONYMIZE,
            inputAction: bedrock.GuardrailAction.NONE,
            inputEnabled: false,
            outputAction: bedrock.GuardrailAction.BLOCK,
            outputEnabled: true,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        SensitiveInformationPolicyConfig: {
          PiiEntitiesConfig: [
            {
              Action: 'ANONYMIZE',
              Type: 'ADDRESS',
              InputAction: 'NONE',
              InputEnabled: false,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
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

    test('validates action is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: action must be a valid GuardrailAction value/);
    });

    test('validates inputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
              inputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: inputAction must be a valid GuardrailAction value/);
    });

    test('validates outputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
              outputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: outputAction must be a valid GuardrailAction value/);
    });

    test('validates inputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
              inputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: inputEnabled must be a boolean value/);
    });

    test('validates outputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
              outputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid RegexFilter at index 0: outputEnabled must be a boolean value/);
    });

    test('accepts RegexFilter with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          regexFilters: [
            {
              name: 'TestRegexFilter',
              description: 'A valid description',
              pattern: '/^[A-Z]{2}d{6}$/',
              action: bedrock.GuardrailAction.ANONYMIZE,
              inputAction: bedrock.GuardrailAction.BLOCK,
              inputEnabled: true,
              outputAction: bedrock.GuardrailAction.NONE,
              outputEnabled: false,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional RegexFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        regexFilters: [
          {
            name: 'TestRegexFilter',
            pattern: '/^[A-Z]{2}d{6}$/',
            action: bedrock.GuardrailAction.ANONYMIZE,
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        SensitiveInformationPolicyConfig: {
          RegexesConfig: [
            {
              Action: 'ANONYMIZE',
              Name: 'TestRegexFilter',
              Pattern: '/^[A-Z]{2}d{6}$/',
              InputAction: 'BLOCK',
              InputEnabled: true,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional RegexFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        regexFilters: [
          {
            name: 'TestRegexFilter',
            pattern: '/^[A-Z]{2}d{6}$/',
            action: bedrock.GuardrailAction.ANONYMIZE,
            inputAction: bedrock.GuardrailAction.NONE,
            inputEnabled: false,
            outputAction: bedrock.GuardrailAction.BLOCK,
            outputEnabled: true,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        SensitiveInformationPolicyConfig: {
          RegexesConfig: [
            {
              Action: 'ANONYMIZE',
              Name: 'TestRegexFilter',
              Pattern: '/^[A-Z]{2}d{6}$/',
              InputAction: 'NONE',
              InputEnabled: false,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
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

  describe('WordFilter validation', () => {
    test('validates inputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          wordFilters: [
            {
              text: 'test',
              inputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid WordFilter at index 0: inputAction must be a valid GuardrailAction value/);
    });

    test('validates outputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          wordFilters: [
            {
              text: 'test',
              outputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid WordFilter at index 0: outputAction must be a valid GuardrailAction value/);
    });

    test('validates inputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          wordFilters: [
            {
              text: 'test',
              inputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid WordFilter at index 0: inputEnabled must be a boolean value/);
    });

    test('validates outputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          wordFilters: [
            {
              text: 'test',
              outputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid WordFilter at index 0: outputEnabled must be a boolean value/);
    });

    test('accepts WordFilter with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          wordFilters: [
            {
              text: 'test',
              inputAction: bedrock.GuardrailAction.BLOCK,
              inputEnabled: true,
              outputAction: bedrock.GuardrailAction.NONE,
              outputEnabled: false,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional WordFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        wordFilters: [
          {
            text: 'test',
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        WordPolicyConfig: {
          WordsConfig: [
            {
              Text: 'test',
              InputAction: 'BLOCK',
              InputEnabled: true,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional WordFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        wordFilters: [
          {
            text: 'test',
            inputAction: bedrock.GuardrailAction.NONE,
            inputEnabled: false,
            outputAction: bedrock.GuardrailAction.BLOCK,
            outputEnabled: true,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        WordPolicyConfig: {
          WordsConfig: [
            {
              Text: 'test',
              InputAction: 'NONE',
              InputEnabled: false,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
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

  describe('ManagedWordFilter validation', () => {
    test('validates type is a valid ManagedWordFilterType value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          managedWordListFilters: [
            {
              type: 'INVALID_TYPE' as any,
            },
          ],
        });
      }).toThrow(/Invalid ManagedWordFilter at index 0: type must be a valid ManagedWordFilterType value/);
    });

    test('validates inputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          managedWordListFilters: [
            {
              inputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid ManagedWordFilter at index 0: inputAction must be a valid GuardrailAction value/);
    });

    test('validates outputAction is a valid GuardrailAction value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          managedWordListFilters: [
            {
              outputAction: 'INVALID_ACTION' as any,
            },
          ],
        });
      }).toThrow(/Invalid ManagedWordFilter at index 0: outputAction must be a valid GuardrailAction value/);
    });

    test('validates inputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          managedWordListFilters: [
            {
              inputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid ManagedWordFilter at index 0: inputEnabled must be a boolean value/);
    });

    test('validates outputEnabled is a boolean value', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          managedWordListFilters: [
            {
              outputEnabled: 'not a boolean' as any,
            },
          ],
        });
      }).toThrow(/Invalid ManagedWordFilter at index 0: outputEnabled must be a boolean value/);
    });

    test('accepts ManagedWordFilter with all optional properties', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          managedWordListFilters: [
            {
              type: bedrock.ManagedWordFilterType.PROFANITY,
              inputAction: bedrock.GuardrailAction.BLOCK,
              inputEnabled: true,
              outputAction: bedrock.GuardrailAction.NONE,
              outputEnabled: false,
            },
          ],
        });
      }).not.toThrow();
    });

    test('applies default values for optional ManagedWordFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        managedWordListFilters: [
          {
            // Note: Not providing optional properties to test defaults
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        WordPolicyConfig: {
          ManagedWordListsConfig: [
            {
              Type: 'PROFANITY',
              InputAction: 'BLOCK',
              InputEnabled: true,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
    });

    test('applies custom values for optional ManagedWordFilter properties in CloudFormation', () => {
      new bedrock.Guardrail(stack, 'TestGuardrail', {
        guardrailName: 'TestGuardrail',
        managedWordListFilters: [
          {
            type: bedrock.ManagedWordFilterType.PROFANITY,
            inputAction: bedrock.GuardrailAction.NONE,
            inputEnabled: false,
            outputAction: bedrock.GuardrailAction.BLOCK,
            outputEnabled: true,
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
        Name: 'TestGuardrail',
        WordPolicyConfig: {
          ManagedWordListsConfig: [
            {
              Type: 'PROFANITY',
              InputAction: 'NONE',
              InputEnabled: false,
              OutputAction: 'BLOCK',
              OutputEnabled: true,
            },
          ],
        },
      });
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
          type: bedrock.GeneralPIIType.ADDRESS,
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
      type: bedrock.GeneralPIIType.ADDRESS,
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
      crossRegionConfig: {
        guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/test-profile',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      CrossRegionConfig: {
        GuardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/test-profile',
      },
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
      crossRegionConfig: {
        guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/test-profile',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      CrossRegionConfig: {
        GuardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/test-profile',
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
      crossRegionConfig: {
        guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/test-profile',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail',
      CrossRegionConfig: {
        GuardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/test-profile',
      },
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

  test('Cross Region Config - With Configuration', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail with cross-region config',
      crossRegionConfig: {
        guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/my-profile',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail with cross-region config',
      CrossRegionConfig: {
        GuardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/my-profile',
      },
      // ensure others are undefined
      TopicPolicyConfig: Match.absent(),
      ContextualGroundingPolicyConfig: Match.absent(),
      ContentPolicyConfig: Match.absent(),
      WordPolicyConfig: Match.absent(),
      SensitiveInformationPolicyConfig: Match.absent(),
    });
  });

  test('Cross Region Config - Without Configuration', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail without cross-region config',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Guardrail', {
      Name: 'TestGuardrail',
      Description: 'This is a test guardrail without cross-region config',
      // ensure CrossRegionConfig is absent when not provided
      CrossRegionConfig: Match.absent(),
      // ensure others are undefined
      TopicPolicyConfig: Match.absent(),
      ContextualGroundingPolicyConfig: Match.absent(),
      ContentPolicyConfig: Match.absent(),
      WordPolicyConfig: Match.absent(),
      SensitiveInformationPolicyConfig: Match.absent(),
    });
  });

  test('Cross Region Config - With Other Filters', () => {
    new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail with cross-region config and other filters',
      crossRegionConfig: {
        guardrailProfileArn: 'arn:aws:bedrock:us-west-2:123456789012:guardrail-profile/another-profile',
      },
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
      Description: 'This is a test guardrail with cross-region config and other filters',
      CrossRegionConfig: {
        GuardrailProfileArn: 'arn:aws:bedrock:us-west-2:123456789012:guardrail-profile/another-profile',
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

  test('Cross Region Config - Property Access', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail with cross-region config',
      crossRegionConfig: {
        guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/my-profile',
      },
    });

    // Test that the crossRegionConfig property is accessible
    expect(guardrail.crossRegionConfig).toBeDefined();
    expect(guardrail.crossRegionConfig!.guardrailProfileArn).toBe('arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/my-profile');
  });

  test('Cross Region Config - Property Access Without Config', () => {
    const guardrail = new bedrock.Guardrail(stack, 'TestGuardrail', {
      guardrailName: 'TestGuardrail',
      description: 'This is a test guardrail without cross-region config',
    });

    // Test that the crossRegionConfig property is undefined when not provided
    expect(guardrail.crossRegionConfig).toBeUndefined();
  });

  describe('Tier Configuration Validation', () => {
    test('throws error when STANDARD content tier is used without cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFiltersTierConfig: bedrock.TierConfig.STANDARD,
        });
      }).toThrow(/Cross-region configuration is required when using STANDARD tier for content filters/);
    });

    test('throws error when STANDARD topic tier is used without cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          topicsTierConfig: bedrock.TierConfig.STANDARD,
        });
      }).toThrow(/Cross-region configuration is required when using STANDARD tier for topic filters/);
    });

    test('throws error when both STANDARD tiers are used without cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFiltersTierConfig: bedrock.TierConfig.STANDARD,
          topicsTierConfig: bedrock.TierConfig.STANDARD,
        });
      }).toThrow(/Cross-region configuration is required when using STANDARD tier for content filters/);
    });

    test('allows STANDARD content tier with cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFiltersTierConfig: bedrock.TierConfig.STANDARD,
          crossRegionConfig: {
            guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/my-profile',
          },
        });
      }).not.toThrow();
    });

    test('allows STANDARD topic tier with cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          topicsTierConfig: bedrock.TierConfig.STANDARD,
          crossRegionConfig: {
            guardrailProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:guardrail-profile/my-profile',
          },
        });
      }).not.toThrow();
    });

    test('allows CLASSIC tiers without cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          contentFiltersTierConfig: bedrock.TierConfig.CLASSIC,
          topicsTierConfig: bedrock.TierConfig.CLASSIC,
        });
      }).not.toThrow();
    });

    test('allows default tiers without cross-region config', () => {
      expect(() => {
        new bedrock.Guardrail(stack, 'TestGuardrail', {
          guardrailName: 'TestGuardrail',
          // No tier config specified - defaults to CLASSIC
        });
      }).not.toThrow();
    });
  });

  describe('Validation Tests', () => {
    describe('Content Filters Validation', () => {
      test('validates content filter with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contentFilters: [{
              type: bedrock.ContentFilterType.SEXUAL,
              inputStrength: bedrock.ContentFilterStrength.MEDIUM,
              outputStrength: bedrock.ContentFilterStrength.HIGH,
            }],
          });
        }).not.toThrow();
      });

      test('throws error for invalid content filter strength', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contentFilters: [{
              type: bedrock.ContentFilterType.SEXUAL,
              inputStrength: 'INVALID' as any,
              outputStrength: bedrock.ContentFilterStrength.HIGH,
            }],
          });
        }).toThrow(/inputStrength must be a valid ContentFilterStrength value/);
      });

      test('throws error for invalid modality type', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contentFilters: [{
              type: bedrock.ContentFilterType.SEXUAL,
              inputStrength: bedrock.ContentFilterStrength.MEDIUM,
              outputStrength: bedrock.ContentFilterStrength.HIGH,
              inputModalities: ['INVALID' as any],
            }],
          });
        }).toThrow(/inputModalities\[0\] must be a valid ModalityType value/);
      });
    });

    describe('PII Filters Validation', () => {
      test('validates PII filter with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            piiFilters: [{
              type: bedrock.GeneralPIIType.EMAIL,
              action: bedrock.GuardrailAction.BLOCK,
            }],
          });
        }).not.toThrow();
      });

      test('throws error for missing required PII filter properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            piiFilters: [{
              type: bedrock.GeneralPIIType.EMAIL,
              // Missing action
            } as any],
          });
        }).toThrow(/action is required/);
      });

      test('throws error for invalid PII filter action', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            piiFilters: [{
              type: bedrock.GeneralPIIType.EMAIL,
              action: 'INVALID' as any,
            }],
          });
        }).toThrow(/action must be a valid GuardrailAction value/);
      });
    });

    describe('Regex Filters Validation', () => {
      test('validates regex filter with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            regexFilters: [{
              name: 'test-regex',
              pattern: 'test-pattern',
              action: bedrock.GuardrailAction.BLOCK,
            }],
          });
        }).not.toThrow();
      });

      test('throws error for regex filter with empty name', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            regexFilters: [{
              name: '',
              pattern: 'test-pattern',
              action: bedrock.GuardrailAction.BLOCK,
            }],
          });
        }).toThrow(/name is 0 characters long but must be at least 1 characters/);
      });

      test('throws error for regex filter with name too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            regexFilters: [{
              name: 'a'.repeat(101),
              pattern: 'test-pattern',
              action: bedrock.GuardrailAction.BLOCK,
            }],
          });
        }).toThrow(/name is 101 characters long but must be less than or equal to 100 characters/);
      });
    });

    describe('Denied Topics Validation', () => {
      test('validates denied topics with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
          });
        }).not.toThrow();
      });

      test('validates custom topic with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            deniedTopics: [bedrock.Topic.custom({
              name: 'test-topic',
              definition: 'test definition',
              examples: ['example 1', 'example 2'],
            })],
          });
        }).not.toThrow();
      });

      test('throws error for custom topic with name too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            deniedTopics: [bedrock.Topic.custom({
              name: 'a'.repeat(101),
              definition: 'test definition',
              examples: ['example 1'],
            })],
          });
        }).toThrow(/name must be 100 characters or less/);
      });

      test('throws error for custom topic with definition too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            deniedTopics: [bedrock.Topic.custom({
              name: 'test-topic',
              definition: 'a'.repeat(1001),
              examples: ['example 1'],
            })],
          });
        }).toThrow(/definition must be 1000 characters or less/);
      });

      test('throws error for custom topic with too many examples', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            deniedTopics: [bedrock.Topic.custom({
              name: 'test-topic',
              definition: 'test definition',
              examples: Array(101).fill('example'),
            })],
          });
        }).toThrow(/examples field cannot contain more than 100 examples/);
      });

      test('throws error for custom topic with example too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            deniedTopics: [bedrock.Topic.custom({
              name: 'test-topic',
              definition: 'test definition',
              examples: ['a'.repeat(101)],
            })],
          });
        }).toThrow(/examples\[0\] must be 100 characters or less/);
      });
    });

    describe('Contextual Grounding Filters Validation', () => {
      test('validates contextual grounding filter with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contextualGroundingFilters: [{
              type: bedrock.ContextualGroundingFilterType.GROUNDING,
              threshold: 0.5,
            }],
          });
        }).not.toThrow();
      });

      test('throws error for contextual grounding filter with threshold too low', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contextualGroundingFilters: [{
              type: bedrock.ContextualGroundingFilterType.GROUNDING,
              threshold: -0.1,
            }],
          });
        }).toThrow(/threshold must be between 0 and 0.99/);
      });

      test('throws error for contextual grounding filter with threshold too high', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contextualGroundingFilters: [{
              type: bedrock.ContextualGroundingFilterType.GROUNDING,
              threshold: 1.0,
            }],
          });
        }).toThrow(/threshold must be between 0 and 0.99/);
      });

      test('throws error for invalid contextual grounding filter type', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            contextualGroundingFilters: [{
              type: 'INVALID' as any,
              threshold: 0.5,
            }],
          });
        }).toThrow(/type must be a valid ContextualGroundingFilterType value/);
      });
    });

    describe('Word Filters Validation', () => {
      test('validates word filter with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            wordFilters: [{
              text: 'test-word',
            }],
          });
        }).not.toThrow();
      });

      test('throws error for word filter with text too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            wordFilters: [{
              text: 'a'.repeat(101),
            }],
          });
        }).toThrow(/text must be 100 characters or less/);
      });

      test('throws error for word filter with invalid action', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            wordFilters: [{
              text: 'test-word',
              inputAction: 'INVALID' as any,
            }],
          });
        }).toThrow(/inputAction must be a valid GuardrailAction value/);
      });
    });

    describe('Managed Word List Filters Validation', () => {
      test('validates managed word list filter with valid properties', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            managedWordListFilters: [{
              type: bedrock.ManagedWordFilterType.PROFANITY,
            }],
          });
        }).not.toThrow();
      });

      test('throws error for managed word list filter with invalid type', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            managedWordListFilters: [{
              type: 'INVALID' as any,
            }],
          });
        }).toThrow(/type must be a valid ManagedWordFilterType value/);
      });

      test('throws error for managed word list filter with invalid action', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            managedWordListFilters: [{
              type: bedrock.ManagedWordFilterType.PROFANITY,
              inputAction: 'INVALID' as any,
            }],
          });
        }).toThrow(/inputAction must be a valid GuardrailAction value/);
      });
    });

    describe('Messaging Validation', () => {
      test('throws error for blocked input messaging too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            blockedInputMessaging: 'a'.repeat(501),
          });
        }).toThrow(/blockedInputMessaging is 501 characters long but must be less than or equal to 500 characters/);
      });

      test('throws error for blocked outputs messaging too long', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            blockedOutputsMessaging: 'a'.repeat(501),
          });
        }).toThrow(/blockedOutputsMessaging is 501 characters long but must be less than or equal to 500 characters/);
      });

      test('throws error for empty blocked input messaging', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            blockedInputMessaging: '',
          });
        }).toThrow(/blockedInputMessaging is 0 characters long but must be at least 1 characters/);
      });

      test('throws error for empty blocked outputs messaging', () => {
        expect(() => {
          new bedrock.Guardrail(stack, 'TestGuardrail', {
            guardrailName: 'TestGuardrail',
            blockedOutputsMessaging: '',
          });
        }).toThrow(/blockedOutputsMessaging is 0 characters long but must be at least 1 characters/);
      });
    });
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
