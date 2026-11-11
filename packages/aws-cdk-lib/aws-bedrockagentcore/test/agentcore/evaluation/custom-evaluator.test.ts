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

import { Match, Template } from '../../../../assertions';
import * as iam from '../../../../aws-iam';
import * as lambda from '../../../../aws-lambda';
import { App, Duration, Lazy, Stack } from '../../../../core';
import {
  BuiltinEvaluator,
  DataSourceConfig,
  EvaluationLevel,
  Evaluator,
  EvaluatorConfig,
  EvaluatorRatingScale,
  EvaluatorSelector,
  OnlineEvaluationConfig,
} from '../../../lib';

describe('Evaluator', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  describe('LLM-as-a-Judge evaluator', () => {
    test('creates evaluator with categorical rating scale', () => {
      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'test_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate whether the agent response is helpful.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Good', definition: 'The response is helpful.' },
            { label: 'Bad', definition: 'The response is not helpful.' },
          ]),
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        EvaluatorName: 'test_evaluator',
        Level: 'SESSION',
        EvaluatorConfig: {
          LlmAsAJudge: {
            Instructions: 'Evaluate whether the agent response is helpful.',
            ModelConfig: {
              BedrockEvaluatorModelConfig: {
                ModelId: 'us.anthropic.claude-sonnet-4-6',
              },
            },
            RatingScale: {
              Categorical: [
                { Label: 'Good', Definition: 'The response is helpful.' },
                { Label: 'Bad', Definition: 'The response is not helpful.' },
              ],
            },
          },
        },
      });
    });

    test('creates evaluator with numerical rating scale', () => {
      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'numerical_evaluator',
        level: EvaluationLevel.TRACE,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Rate the response quality.',
          modelId: 'anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.numerical([
            { label: 'Poor', definition: 'Inadequate response.', value: 1 },
            { label: 'Good', definition: 'Adequate response.', value: 3 },
            { label: 'Excellent', definition: 'Outstanding response.', value: 5 },
          ]),
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        EvaluatorName: 'numerical_evaluator',
        Level: 'TRACE',
        EvaluatorConfig: {
          LlmAsAJudge: {
            RatingScale: {
              Numerical: [
                { Label: 'Poor', Definition: 'Inadequate response.', Value: 1 },
                { Label: 'Good', Definition: 'Adequate response.', Value: 3 },
                { Label: 'Excellent', Definition: 'Outstanding response.', Value: 5 },
              ],
            },
          },
        },
      });
    });

    test('creates evaluator with inference config', () => {
      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'inference_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate the response.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Acceptable.' },
            { label: 'Fail', definition: 'Not acceptable.' },
          ]),
          inferenceConfig: {
            maxTokens: 1024,
            temperature: 0.5,
            topP: 0.9,
          },
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        EvaluatorConfig: {
          LlmAsAJudge: {
            ModelConfig: {
              BedrockEvaluatorModelConfig: {
                ModelId: 'us.anthropic.claude-sonnet-4-6',
                InferenceConfig: {
                  MaxTokens: 1024,
                  Temperature: 0.5,
                  TopP: 0.9,
                },
              },
            },
          },
        },
      });
    });

    test('creates evaluator with additional model request fields', () => {
      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'additional_fields_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate the response.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Acceptable.' },
          ]),
          additionalModelRequestFields: { customField: 'value' },
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        EvaluatorConfig: {
          LlmAsAJudge: {
            ModelConfig: {
              BedrockEvaluatorModelConfig: {
                AdditionalModelRequestFields: { customField: 'value' },
              },
            },
          },
        },
      });
    });

    test('creates evaluator with description', () => {
      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'described_evaluator',
        level: EvaluationLevel.SESSION,
        description: 'A custom evaluator for testing',
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate the response.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Acceptable.' },
          ]),
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        Description: 'A custom evaluator for testing',
      });
    });
  });

  describe('code-based evaluator', () => {
    test('creates evaluator with Lambda function', () => {
      const fn = new lambda.Function(stack, 'EvalFunction', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.handler',
        code: lambda.Code.fromInline('def handler(event, context): pass'),
      });

      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'code_evaluator',
        level: EvaluationLevel.TOOL_CALL,
        evaluatorConfig: EvaluatorConfig.codeBased({
          lambdaFunction: fn,
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        EvaluatorName: 'code_evaluator',
        Level: 'TOOL_CALL',
        EvaluatorConfig: {
          CodeBased: {
            LambdaConfig: {
              LambdaArn: { 'Fn::GetAtt': ['EvalFunction3722E4B7', 'Arn'] },
            },
          },
        },
      });
    });

    test('creates evaluator with Lambda timeout', () => {
      const fn = new lambda.Function(stack, 'EvalFunction', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.handler',
        code: lambda.Code.fromInline('def handler(event, context): pass'),
      });

      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'timeout_evaluator',
        level: EvaluationLevel.TRACE,
        evaluatorConfig: EvaluatorConfig.codeBased({
          lambdaFunction: fn,
          timeout: Duration.seconds(30),
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        EvaluatorConfig: {
          CodeBased: {
            LambdaConfig: {
              LambdaTimeoutInSeconds: 30,
            },
          },
        },
      });
    });

    test('grants scoped Lambda invoke permission to bedrock-agentcore service', () => {
      const fn = new lambda.Function(stack, 'EvalFunction', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.handler',
        code: lambda.Code.fromInline('def handler(event, context): pass'),
      });

      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'perm_evaluator',
        level: EvaluationLevel.TOOL_CALL,
        evaluatorConfig: EvaluatorConfig.codeBased({
          lambdaFunction: fn,
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        FunctionName: { 'Fn::GetAtt': ['EvalFunction3722E4B7', 'Arn'] },
        Principal: 'bedrock-agentcore.amazonaws.com',
        SourceAccount: '123456789012',
        SourceArn: { 'Fn::GetAtt': ['TestEvaluatorE68F9F59', 'EvaluatorArn'] },
      });
    });
  });

  describe('evaluation levels', () => {
    test.each([
      [EvaluationLevel.TOOL_CALL, 'TOOL_CALL'],
      [EvaluationLevel.TRACE, 'TRACE'],
      [EvaluationLevel.SESSION, 'SESSION'],
    ])('creates evaluator with level %s', (level, expected) => {
      new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'level_evaluator',
        level,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Ok.' },
          ]),
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        Level: expected,
      });
    });
  });

  describe('EvaluatorSelector.custom()', () => {
    // Tests the bind() API contract directly. Template output is verified in 'custom evaluator can be used in OnlineEvaluationConfig'.
    test('produces correct evaluator ID binding', () => {
      const evaluator = new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'ref_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Ok.' },
          ]),
        }),
      });

      const ref = EvaluatorSelector.custom(evaluator);
      const result = ref.bind();
      expect(result.evaluatorId).toBeDefined();
    });

    test('custom evaluator can be used in OnlineEvaluationConfig', () => {
      const evaluator = new Evaluator(stack, 'CustomEvaluator', {
        evaluatorName: 'custom_eval',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate helpfulness.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Good', definition: 'Helpful.' },
            { label: 'Bad', definition: 'Not helpful.' },
          ]),
        }),
      });

      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        onlineEvaluationConfigName: 'test_evaluation',
        evaluators: [
          EvaluatorSelector.builtin(BuiltinEvaluator.HELPFULNESS),
          EvaluatorSelector.custom(evaluator),
        ],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/bedrock-agentcore/my-agent'],
          serviceNames: ['my-agent.default'],
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
        Evaluators: Match.arrayWith([
          { EvaluatorId: 'Builtin.Helpfulness' },
          { EvaluatorId: { 'Fn::GetAtt': ['CustomEvaluator9FEA397A', 'EvaluatorId'] } },
        ]),
      });
    });
  });

  describe('EvaluatorSelector.custom() with imported evaluator', () => {
    test('imported evaluator resolves correctly in OnlineEvaluationConfig', () => {
      const imported = Evaluator.fromEvaluatorId(stack, 'ImportedEvaluator', 'Builtin.abc123');

      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        onlineEvaluationConfigName: 'test_evaluation',
        evaluators: [
          EvaluatorSelector.builtin(BuiltinEvaluator.HELPFULNESS),
          EvaluatorSelector.custom(imported),
        ],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/bedrock-agentcore/my-agent'],
          serviceNames: ['my-agent.default'],
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
        Evaluators: [
          { EvaluatorId: 'Builtin.Helpfulness' },
          { EvaluatorId: 'Builtin.abc123' },
        ],
      });
    });
  });

  // These tests verify the contract of each import factory method (computed properties, ARN parsing, defaults).
  // Template-based assertions for imported evaluators rendering in CFN are covered in 'EvaluatorSelector.custom() with imported evaluator'.
  describe('import methods', () => {
    test('imports by evaluator ID', () => {
      const imported = Evaluator.fromEvaluatorId(stack, 'Imported', 'eval-12345');

      expect(imported.evaluatorId).toBe('eval-12345');
      expect(imported.evaluatorArn).toContain('evaluator/eval-12345');
    });

    test('imports by evaluator ARN', () => {
      const arn = 'arn:aws:bedrock-agentcore:us-east-1:123456789012:evaluator/eval-12345';
      const imported = Evaluator.fromEvaluatorArn(stack, 'Imported', arn);

      expect(imported.evaluatorArn).toBe(arn);
      expect(imported.evaluatorId).toBe('eval-12345');
    });

    test('imports from attributes', () => {
      const imported = Evaluator.fromEvaluatorAttributes(stack, 'Imported', {
        evaluatorArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:evaluator/eval-12345',
        evaluatorId: 'eval-12345',
        evaluatorName: 'my_evaluator',
      });

      expect(imported.evaluatorArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:evaluator/eval-12345');
      expect(imported.evaluatorId).toBe('eval-12345');
      expect(imported.evaluatorName).toBe('my_evaluator');
    });

    test('imports from attributes defaults name to ID when not provided', () => {
      const imported = Evaluator.fromEvaluatorAttributes(stack, 'Imported', {
        evaluatorArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:evaluator/eval-12345',
        evaluatorId: 'eval-12345',
      });

      expect(imported.evaluatorName).toBe('eval-12345');
    });
  });

  describe('grant methods', () => {
    test('grant grants specified permissions', () => {
      const evaluator = new Evaluator(stack, 'TestEvaluator', {
        evaluatorName: 'grant_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Ok.' },
          ]),
        }),
      });

      const role = new iam.Role(stack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
      evaluator.grant(role, 'bedrock-agentcore:GetEvaluator');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'bedrock-agentcore:GetEvaluator',
              Effect: 'Allow',
              Resource: { 'Fn::GetAtt': ['TestEvaluatorE68F9F59', 'EvaluatorArn'] },
            }),
          ]),
        },
      });
    });
  });

  describe('validation', () => {
    test('fails for invalid evaluator name starting with number', () => {
      expect(() => {
        new Evaluator(stack, 'TestEvaluator', {
          evaluatorName: '1invalid',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Pass', definition: 'Ok.' },
            ]),
          }),
        });
      }).toThrow(/does not match required pattern/);
    });

    test('fails for evaluator name too long', () => {
      expect(() => {
        new Evaluator(stack, 'TestEvaluator', {
          evaluatorName: 'a'.repeat(49),
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Pass', definition: 'Ok.' },
            ]),
          }),
        });
      }).toThrow(/at most 48 characters/);
    });

    test('fails for empty evaluator name', () => {
      expect(() => {
        new Evaluator(stack, 'TestEvaluator', {
          evaluatorName: '',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Pass', definition: 'Ok.' },
            ]),
          }),
        });
      }).toThrow(/at least 1 character/);
    });

    test('fails for description too long', () => {
      expect(() => {
        new Evaluator(stack, 'TestEvaluator', {
          evaluatorName: 'valid_name',
          level: EvaluationLevel.SESSION,
          description: 'a'.repeat(201),
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Pass', definition: 'Ok.' },
            ]),
          }),
        });
      }).toThrow(/at most 200 characters/);
    });

    test('fails for empty instructions', () => {
      expect(() => {
        EvaluatorConfig.llmAsAJudge({
          instructions: '',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Ok.' },
          ]),
        });
      }).toThrow(/must not be empty/);
    });

    test('fails for whitespace-only instructions', () => {
      expect(() => {
        EvaluatorConfig.llmAsAJudge({
          instructions: '   ',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Ok.' },
          ]),
        });
      }).toThrow(/must not be empty/);
    });

    test('fails for empty categorical rating scale', () => {
      expect(() => {
        EvaluatorRatingScale.categorical([]);
      }).toThrow(/At least 1 categorical rating option/);
    });

    test('fails for empty numerical rating scale', () => {
      expect(() => {
        EvaluatorRatingScale.numerical([]);
      }).toThrow(/At least 1 numerical rating option/);
    });

    test('fails for categorical option with empty label', () => {
      expect(() => {
        EvaluatorRatingScale.categorical([
          { label: '', definition: 'Some definition.' },
        ]);
      }).toThrow(/non-empty label/);
    });

    test('fails for categorical option with empty definition', () => {
      expect(() => {
        EvaluatorRatingScale.categorical([
          { label: 'Good', definition: '' },
        ]);
      }).toThrow(/non-empty definition/);
    });
  });

  describe('token handling', () => {
    test('accepts Lazy.string for evaluator name', () => {
      expect(() => {
        new Evaluator(stack, 'TestEvaluator', {
          evaluatorName: Lazy.string({ produce: () => 'lazy_name' }),
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Pass', definition: 'Ok.' },
            ]),
          }),
        });
      }).not.toThrow();
    });

    test('accepts Lazy.string for description', () => {
      expect(() => {
        new Evaluator(stack, 'TestEvaluator', {
          evaluatorName: 'valid_name',
          level: EvaluationLevel.SESSION,
          description: Lazy.string({ produce: () => 'lazy description' }),
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Pass', definition: 'Ok.' },
            ]),
          }),
        });
      }).not.toThrow();
    });

    test('accepts Lazy.string for instructions', () => {
      expect(() => {
        EvaluatorConfig.llmAsAJudge({
          instructions: Lazy.string({ produce: () => 'lazy instructions' }),
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Pass', definition: 'Ok.' },
          ]),
        });
      }).not.toThrow();
    });

    test('accepts Lazy.string for categorical rating scale label and definition', () => {
      expect(() => {
        EvaluatorRatingScale.categorical([
          {
            label: Lazy.string({ produce: () => 'lazy label' }),
            definition: Lazy.string({ produce: () => 'lazy definition' }),
          },
        ]);
      }).not.toThrow();
    });

    test('accepts Lazy.string for numerical rating scale label and definition', () => {
      expect(() => {
        EvaluatorRatingScale.numerical([
          {
            label: Lazy.string({ produce: () => 'lazy label' }),
            definition: Lazy.string({ produce: () => 'lazy definition' }),
            value: 1,
          },
        ]);
      }).not.toThrow();
    });
  });

  describe('tags', () => {
    test('passes tags to the L1 resource', () => {
      new Evaluator(stack, 'TaggedEvaluator', {
        evaluatorName: 'tagged_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate helpfulness.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Good', definition: 'Helpful.' },
            { label: 'Bad', definition: 'Not helpful.' },
          ]),
        }),
        tags: {
          Environment: 'Production',
          Team: 'AgentCore',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        Tags: Match.arrayWith([
          { Key: 'Environment', Value: 'Production' },
          { Key: 'Team', Value: 'AgentCore' },
        ]),
      });
    });

    test('does not include tags when not specified', () => {
      new Evaluator(stack, 'NoTagsEvaluator', {
        evaluatorName: 'no_tags_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate helpfulness.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Good', definition: 'Helpful.' },
            { label: 'Bad', definition: 'Not helpful.' },
          ]),
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        Tags: Match.absent(),
      });
    });

    test('does not include tags when empty object is passed', () => {
      new Evaluator(stack, 'EmptyTagsEvaluator', {
        evaluatorName: 'empty_tags_evaluator',
        level: EvaluationLevel.SESSION,
        evaluatorConfig: EvaluatorConfig.llmAsAJudge({
          instructions: 'Evaluate helpfulness.',
          modelId: 'us.anthropic.claude-sonnet-4-6',
          ratingScale: EvaluatorRatingScale.categorical([
            { label: 'Good', definition: 'Helpful.' },
            { label: 'Bad', definition: 'Not helpful.' },
          ]),
        }),
        tags: {},
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
        Tags: Match.absent(),
      });
    });

    test('throws on invalid tag key characters', () => {
      expect(() => {
        new Evaluator(stack, 'InvalidTagEvaluator', {
          evaluatorName: 'invalid_tag_evaluator',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate helpfulness.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Good', definition: 'Helpful.' },
              { label: 'Bad', definition: 'Not helpful.' },
            ]),
          }),
          tags: { 'invalid!key': 'value' },
        });
      }).toThrow(/invalid characters/);
    });

    test('throws on aws: reserved prefix in tag key', () => {
      expect(() => {
        new Evaluator(stack, 'AwsPrefixTagEvaluator', {
          evaluatorName: 'aws_prefix_tag',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate helpfulness.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Good', definition: 'Helpful.' },
              { label: 'Bad', definition: 'Not helpful.' },
            ]),
          }),
          tags: { 'aws:reserved': 'value' },
        });
      }).toThrow(/cannot start with "aws:"/);
    });

    test('throws on whitespace-only tag key', () => {
      expect(() => {
        new Evaluator(stack, 'WhitespaceTagEvaluator', {
          evaluatorName: 'whitespace_tag',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate helpfulness.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Good', definition: 'Helpful.' },
              { label: 'Bad', definition: 'Not helpful.' },
            ]),
          }),
          tags: { '   ': 'value' },
        });
      }).toThrow(/cannot be empty or consist only of whitespace/);
    });

    test('accepts Unicode characters in tag values', () => {
      expect(() => {
        new Evaluator(stack, 'UnicodeTagEvaluator', {
          evaluatorName: 'unicode_tag',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate helpfulness.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Good', definition: 'Helpful.' },
              { label: 'Bad', definition: 'Not helpful.' },
            ]),
          }),
          tags: { Environment: '日本語テスト' },
        });
      }).not.toThrow();
    });

    test('throws when more than 50 tags are provided', () => {
      const tooManyTags: { [key: string]: string } = {};
      for (let i = 0; i < 51; i++) {
        tooManyTags[`key${i}`] = `value${i}`;
      }
      expect(() => {
        new Evaluator(stack, 'TooManyTagsEvaluator', {
          evaluatorName: 'too_many_tags',
          level: EvaluationLevel.SESSION,
          evaluatorConfig: EvaluatorConfig.llmAsAJudge({
            instructions: 'Evaluate helpfulness.',
            modelId: 'us.anthropic.claude-sonnet-4-6',
            ratingScale: EvaluatorRatingScale.categorical([
              { label: 'Good', definition: 'Helpful.' },
              { label: 'Bad', definition: 'Not helpful.' },
            ]),
          }),
          tags: tooManyTags,
        });
      }).toThrow(/Cannot have more than 50 tags/);
    });
  });
});
