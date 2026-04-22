import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as agentcore from '../../../lib';

describe('Evaluator', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('creates LLM-as-a-Judge evaluator with correct CfnEvaluator properties', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'myEvaluator',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response for helpfulness',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Response is helpful' },
          { label: 'Bad', definition: 'Response is not helpful' },
        ]),
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorName: 'myEvaluator',
      Level: 'SESSION',
      EvaluatorConfig: {
        LlmAsAJudge: {
          Instructions: 'Evaluate the response for helpfulness',
          ModelConfig: {
            BedrockEvaluatorModelConfig: {
              ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
            },
          },
          RatingScale: Match.anyValue(),
        },
      },
    });
  });

  test('LLM-as-a-Judge config includes inference parameters when provided', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'inferenceEvaluator',
      level: agentcore.EvaluationLevel.TRACE,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
        maxTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorConfig: {
        LlmAsAJudge: {
          ModelConfig: {
            BedrockEvaluatorModelConfig: {
              InferenceConfig: {
                MaxTokens: 1024,
                Temperature: 0.7,
                TopP: 0.9,
              },
            },
          },
        },
      },
    });
  });

  test('LLM-as-a-Judge config includes additionalModelRequestFields when provided', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'additionalFieldsEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
        additionalModelRequestFields: { customField: 'customValue' },
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorConfig: {
        LlmAsAJudge: {
          ModelConfig: {
            BedrockEvaluatorModelConfig: {
              AdditionalModelRequestFields: { customField: 'customValue' },
            },
          },
        },
      },
    });
  });

  test('categorical rating scale renders correctly', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'categoricalEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Response is helpful' },
          { label: 'Bad', definition: 'Response is not helpful' },
        ]),
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorConfig: {
        LlmAsAJudge: {
          RatingScale: {
            Categorical: [
              { Label: 'Good', Definition: 'Response is helpful' },
              { Label: 'Bad', Definition: 'Response is not helpful' },
            ],
          },
        },
      },
    });
  });

  test('numerical rating scale renders correctly', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'numericalEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.numerical([
          { label: 'Excellent', definition: 'Very helpful', value: 5 },
          { label: 'Poor', definition: 'Not helpful', value: 1 },
        ]),
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorConfig: {
        LlmAsAJudge: {
          RatingScale: {
            Numerical: [
              { Label: 'Excellent', Definition: 'Very helpful', Value: 5 },
              { Label: 'Poor', Definition: 'Not helpful', Value: 1 },
            ],
          },
        },
      },
    });
  });

  test('creates code-based evaluator with Lambda function and timeout', () => {
    const fn = new lambda.Function(stack, 'EvalFn', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromInline('def handler(event, context): pass'),
    });

    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'codeBasedEval',
      level: agentcore.EvaluationLevel.TOOL_CALL,
      evaluatorConfig: agentcore.EvaluatorConfig.codeBased({
        lambdaFunction: fn,
        lambdaTimeoutInSeconds: 120,
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorName: 'codeBasedEval',
      Level: 'TOOL_CALL',
      EvaluatorConfig: {
        CodeBased: {
          LambdaConfig: {
            LambdaArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
            LambdaTimeoutInSeconds: 120,
          },
        },
      },
    });
  });

  test('code-based evaluator omits timeout when not specified', () => {
    const fn = new lambda.Function(stack, 'EvalFn', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromInline('def handler(event, context): pass'),
    });

    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'noTimeoutEval',
      level: agentcore.EvaluationLevel.TRACE,
      evaluatorConfig: agentcore.EvaluatorConfig.codeBased({
        lambdaFunction: fn,
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorConfig: {
        CodeBased: {
          LambdaConfig: {
            LambdaArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
            LambdaTimeoutInSeconds: Match.absent(),
          },
        },
      },
    });
  });

  test('evaluator exposes evaluatorArn, evaluatorId, status attributes', () => {
    const evaluator = new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'attrEvaluator',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    expect(evaluator.evaluatorArn).toBeDefined();
    expect(evaluator.evaluatorId).toBeDefined();
    expect(evaluator.status).toBeDefined();
  });

  test('EvaluationLevel enum values are SESSION, TRACE, TOOL_CALL', () => {
    expect(agentcore.EvaluationLevel.SESSION).toBe('SESSION');
    expect(agentcore.EvaluationLevel.TRACE).toBe('TRACE');
    expect(agentcore.EvaluationLevel.TOOL_CALL).toBe('TOOL_CALL');
  });

  test('evaluator accepts optional description', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'descEvaluator',
      level: agentcore.EvaluationLevel.SESSION,
      description: 'My evaluator description',
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      Description: 'My evaluator description',
    });
  });

  test('evaluator accepts optional tags', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'taggedEvaluator',
      level: agentcore.EvaluationLevel.SESSION,
      tags: { Environment: 'test', Team: 'ml' },
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      Tags: Match.arrayWith([
        { Key: 'Environment', Value: 'test' },
        { Key: 'Team', Value: 'ml' },
      ]),
    });
  });

  test('auto-generates evaluator name when not provided', () => {
    new agentcore.Evaluator(stack, 'MyEvaluator', {
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Evaluator', {
      EvaluatorName: Match.anyValue(),
    });
  });

  test('fails for evaluator name exceeding 48 characters', () => {
    const longName = 'a' + 'b'.repeat(48);
    expect(() => {
      new agentcore.Evaluator(stack, 'MyEvaluator', {
        evaluatorName: longName,
        level: agentcore.EvaluationLevel.SESSION,
        evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
          evaluationInstructions: 'Evaluate the response',
          modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
          ratingScale: agentcore.RatingScale.categorical([
            { label: 'Good', definition: 'Helpful' },
          ]),
        }),
      });
    }).toThrow(/evaluatorName.*49.*less than or equal to 48/);
  });

  test('fails for evaluator name with invalid pattern', () => {
    expect(() => {
      new agentcore.Evaluator(stack, 'MyEvaluator', {
        evaluatorName: '1invalidName',
        level: agentcore.EvaluationLevel.SESSION,
        evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
          evaluationInstructions: 'Evaluate the response',
          modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
          ratingScale: agentcore.RatingScale.categorical([
            { label: 'Good', definition: 'Helpful' },
          ]),
        }),
      });
    }).toThrow(/evaluator name must match pattern/);
  });

  test('grant() adds specified actions to principal', () => {
    const evaluator = new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'grantEvaluator',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const grant = evaluator.grant(role, 'bedrock-agentcore:InvokeEvaluator');

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('grantRead() adds GetEvaluator and ListEvaluators', () => {
    const evaluator = new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'grantReadEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    evaluator.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetEvaluator',
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListEvaluators',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('grantManage() adds Update, Delete, and read perms', () => {
    const evaluator = new agentcore.Evaluator(stack, 'MyEvaluator', {
      evaluatorName: 'grantManageEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    evaluator.grantManage(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: [
              'bedrock-agentcore:UpdateEvaluator',
              'bedrock-agentcore:DeleteEvaluator',
            ],
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:GetEvaluator',
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListEvaluators',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('fromEvaluatorAttributes() imports evaluator by ARN', () => {
    const evaluatorArn = 'arn:aws:bedrock-agentcore:us-east-1:123456789012:evaluator/myEvalId';
    const imported = agentcore.Evaluator.fromEvaluatorAttributes(stack, 'ImportedEval', {
      evaluatorArn,
    });

    expect(imported.evaluatorArn).toBe(evaluatorArn);
    expect(imported.evaluatorId).toBe('myEvalId');
  });

  test('grant methods work with imported evaluator', () => {
    const evaluatorArn = 'arn:aws:bedrock-agentcore:us-east-1:123456789012:evaluator/myEvalId';
    const imported = agentcore.Evaluator.fromEvaluatorAttributes(stack, 'ImportedEval', {
      evaluatorArn,
    });

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    imported.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetEvaluator',
            Effect: 'Allow',
            Resource: evaluatorArn,
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListEvaluators',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });
});
