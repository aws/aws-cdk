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

import { App, Duration, Lazy, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  Evaluator,
  EvaluatorConfig,
  EvaluatorRatingScale,
  EvaluatorReference,
  EvaluationLevel,
  BuiltinEvaluator,
  DataSourceConfig,
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

  describe('EvaluatorReference.custom()', () => {
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

      const ref = EvaluatorReference.custom(evaluator);
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
          EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS),
          EvaluatorReference.custom(evaluator),
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

  describe('EvaluatorReference.custom() with imported evaluator', () => {
    test('imported evaluator resolves correctly in OnlineEvaluationConfig', () => {
      const imported = Evaluator.fromEvaluatorId(stack, 'ImportedEvaluator', 'eval-abc123');

      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        onlineEvaluationConfigName: 'test_evaluation',
        evaluators: [
          EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS),
          EvaluatorReference.custom(imported),
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
          { EvaluatorId: 'eval-abc123' },
        ],
      });
    });
  });

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
});
