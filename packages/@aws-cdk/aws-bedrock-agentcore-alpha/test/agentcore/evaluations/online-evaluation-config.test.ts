import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as agentcore from '../../../lib';

function minimalProps(): agentcore.OnlineEvaluationConfigProps {
  return {
    dataSourceConfig: agentcore.DataSourceConfig.fromCloudWatchLogs({
      logGroupNames: ['/aws/agentcore/test-agent'],
      serviceNames: ['test-agent.DEFAULT'],
    }),
    evaluators: [agentcore.EvaluatorReference.fromBuiltIn('Builtin.Helpfulness')],
    samplingPercentage: 10,
  };
}

describe('OnlineEvaluationConfig', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('creates OnlineEvaluationConfig with all required props', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      DataSourceConfig: {
        CloudWatchLogs: {
          LogGroupNames: ['/aws/agentcore/test-agent'],
          ServiceNames: ['test-agent.DEFAULT'],
        },
      },
      Evaluators: [{ EvaluatorId: 'Builtin.Helpfulness' }],
      Rule: {
        SamplingConfig: {
          SamplingPercentage: 10,
        },
      },
    });
  });

  test('accepts mixed built-in and custom evaluator references', () => {
    const evaluator = new agentcore.Evaluator(stack, 'CustomEval', {
      evaluatorName: 'customEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      evaluators: [
        agentcore.EvaluatorReference.fromBuiltIn('Builtin.Helpfulness'),
        agentcore.EvaluatorReference.fromEvaluator(evaluator),
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      Evaluators: Match.arrayWith([
        { EvaluatorId: 'Builtin.Helpfulness' },
        { EvaluatorId: { 'Fn::GetAtt': [Match.anyValue(), 'EvaluatorId'] } },
      ]),
    });
  });

  test('fails when more than 10 evaluators provided', () => {
    const evaluators = Array.from({ length: 11 }, (_, i) =>
      agentcore.EvaluatorReference.fromBuiltIn(`Builtin.Eval${i}`),
    );

    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
        ...minimalProps(),
        evaluators,
      });
    }).toThrow(/10/);
  });

  test('accepts optional description', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      description: 'My online evaluation config',
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      Description: 'My online evaluation config',
    });
  });

  test('accepts optional tags', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      tags: { Environment: 'test', Team: 'ml' },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      Tags: Match.arrayWith([
        { Key: 'Environment', Value: 'test' },
        { Key: 'Team', Value: 'ml' },
      ]),
    });
  });

  test('exposes onlineEvaluationConfigArn, onlineEvaluationConfigId, status', () => {
    const config = new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    expect(config.onlineEvaluationConfigArn).toBeDefined();
    expect(config.onlineEvaluationConfigId).toBeDefined();
    expect(config.status).toBeDefined();
  });

  test('DataSourceConfig.fromCloudWatchLogs renders correctly', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      dataSourceConfig: agentcore.DataSourceConfig.fromCloudWatchLogs({
        logGroupNames: ['/aws/agentcore/agent1', '/aws/agentcore/agent2'],
        serviceNames: ['agent1.DEFAULT', 'agent2.DEFAULT'],
      }),
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      DataSourceConfig: {
        CloudWatchLogs: {
          LogGroupNames: ['/aws/agentcore/agent1', '/aws/agentcore/agent2'],
          ServiceNames: ['agent1.DEFAULT', 'agent2.DEFAULT'],
        },
      },
    });
  });

  test('auto-creates execution role with bedrock-agentcore trust policy', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock-agentcore.amazonaws.com',
            },
          }),
        ]),
      },
    });
  });

  test('auto-created role has CloudWatch Logs read permissions', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['logs:GetLogEvents', 'logs:FilterLogEvents', 'logs:StartQuery', 'logs:GetQueryResults'],
            Effect: 'Allow',
            Resource: Match.arrayWith([
              {
                'Fn::Join': ['', Match.arrayWith([
                  Match.stringLikeRegexp('.*log-group:/aws/agentcore/test-agent:\\*'),
                ])],
              },
              {
                'Fn::Join': ['', Match.arrayWith([
                  Match.stringLikeRegexp('.*log-group:aws/spans:\\*'),
                ])],
              },
            ]),
          }),
          Match.objectLike({
            Action: 'logs:DescribeLogGroups',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('auto-created role has CloudWatch Logs write permissions for evaluation results', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      onlineEvaluationConfigName: 'my_eval_config',
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', Match.arrayWith([
                Match.stringLikeRegexp('.*log-group:/aws/bedrock-agentcore/evaluations/results/my_eval_config:\\*'),
              ])],
            },
          }),
        ]),
      },
    });
  });

  test('auto-created role has InvokeEvaluator for custom evaluator ARNs', () => {
    const evaluator = new agentcore.Evaluator(stack, 'CustomEval', {
      evaluatorName: 'customEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      evaluators: [
        agentcore.EvaluatorReference.fromBuiltIn('Builtin.Helpfulness'),
        agentcore.EvaluatorReference.fromEvaluator(evaluator),
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:InvokeEvaluator',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('auto-created role has bedrock:InvokeModel for LLM-as-a-Judge evaluators', () => {
    const evaluator = new agentcore.Evaluator(stack, 'LlmEval', {
      evaluatorName: 'llmEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      evaluators: [
        agentcore.EvaluatorReference.fromEvaluator(evaluator),
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock:InvokeModel',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', Match.arrayWith([
                Match.stringLikeRegexp('.*foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0'),
              ])],
            },
          }),
        ]),
      },
    });
  });

  test('auto-created role uses inference-profile ARN for region-prefixed model IDs', () => {
    const evaluator = new agentcore.Evaluator(stack, 'InferenceEval', {
      evaluatorName: 'inferenceEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'us.anthropic.claude-sonnet-4-6',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      evaluators: [
        agentcore.EvaluatorReference.fromEvaluator(evaluator),
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock:InvokeModel',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', Match.arrayWith([
                Match.stringLikeRegexp('.*inference-profile/us.anthropic.claude-sonnet-4-6'),
              ])],
            },
          }),
        ]),
      },
    });
  });

  test('uses user-provided execution role without modification', () => {
    const userRole = new iam.Role(stack, 'UserRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      executionRole: userRole,
    });

    const template = Template.fromStack(stack);
    // Should use the user-provided role, not create a ServiceRole
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      EvaluationExecutionRoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('UserRole.*'), 'Arn'] },
    });
    // No ServiceRole should be created for the OnlineEvaluationConfig
    const roles = template.findResources('AWS::IAM::Role');
    const serviceRoleKeys = Object.keys(roles).filter((k) => k.includes('MyConfigServiceRole'));
    expect(serviceRoleKeys.length).toBe(0);
  });

  test('sets evaluationExecutionRoleArn on CfnOnlineEvaluationConfig', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      EvaluationExecutionRoleArn: Match.anyValue(),
    });
  });

  test('validates sampling percentage boundaries (0.01, 100)', () => {
    // 0.01 should succeed
    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MinConfig', {
        ...minimalProps(),
        samplingPercentage: 0.01,
      });
    }).not.toThrow();

    // 100 should succeed
    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MaxConfig', {
        ...minimalProps(),
        samplingPercentage: 100,
      });
    }).not.toThrow();
  });

  test('fails for sampling percentage below 0.01', () => {
    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
        ...minimalProps(),
        samplingPercentage: 0.001,
      });
    }).toThrow(/sampling percentage/i);
  });

  test('fails for sampling percentage above 100', () => {
    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
        ...minimalProps(),
        samplingPercentage: 101,
      });
    }).toThrow(/sampling percentage/i);
  });

  test('renders filter conditions in rule.filters', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      filters: [
        {
          key: 'agentId',
          operator: 'EQUALS',
          value: agentcore.FilterValue.fromString('my-agent'),
        },
      ],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      Rule: {
        Filters: [
          {
            Key: 'agentId',
            Operator: 'EQUALS',
            Value: { StringValue: 'my-agent' },
          },
        ],
      },
    });
  });

  test('renders session timeout in rule.sessionConfig', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      sessionTimeoutMinutes: 30,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      Rule: {
        SessionConfig: {
          SessionTimeoutMinutes: 30,
        },
      },
    });
  });

  test('defaults executionStatus to DISABLED', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      ExecutionStatus: 'DISABLED',
    });
  });

  test('sets executionStatus to ENABLED when specified', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      executionStatus: agentcore.ExecutionStatus.ENABLED,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      ExecutionStatus: 'ENABLED',
    });
  });

  test('grant() adds specified actions to principal', () => {
    const config = new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const grant = config.grant(role, 'bedrock-agentcore:GetOnlineEvaluationConfig');

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('grantRead() adds GetOnlineEvaluationConfig and ListOnlineEvaluationConfigs', () => {
    const config = new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    config.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetOnlineEvaluationConfig',
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListOnlineEvaluationConfigs',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('grantManage() adds Update, Delete, and read perms', () => {
    const config = new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    config.grantManage(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: [
              'bedrock-agentcore:UpdateOnlineEvaluationConfig',
              'bedrock-agentcore:DeleteOnlineEvaluationConfig',
            ],
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:GetOnlineEvaluationConfig',
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'bedrock-agentcore:ListOnlineEvaluationConfigs',
            Effect: 'Allow',
            Resource: '*',
          }),
        ]),
      },
    });
  });

  test('accepts Evaluator construct instances in evaluators list', () => {
    const evaluator = new agentcore.Evaluator(stack, 'CustomEval', {
      evaluatorName: 'customEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
        ...minimalProps(),
        evaluators: [agentcore.EvaluatorReference.fromEvaluator(evaluator)],
      });
    }).not.toThrow();
  });

  test('resolves Evaluator ID in synthesized evaluators list', () => {
    const evaluator = new agentcore.Evaluator(stack, 'CustomEval', {
      evaluatorName: 'customEval',
      level: agentcore.EvaluationLevel.SESSION,
      evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
        evaluationInstructions: 'Evaluate the response',
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        ratingScale: agentcore.RatingScale.categorical([
          { label: 'Good', definition: 'Helpful' },
        ]),
      }),
    });

    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
      ...minimalProps(),
      evaluators: [agentcore.EvaluatorReference.fromEvaluator(evaluator)],
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      Evaluators: [
        { EvaluatorId: { 'Fn::GetAtt': [Match.anyValue(), 'EvaluatorId'] } },
      ],
    });
  });

  test('fails for online evaluation config name exceeding 48 characters', () => {
    const longName = 'a' + 'b'.repeat(48);
    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
        ...minimalProps(),
        onlineEvaluationConfigName: longName,
      });
    }).toThrow(/onlineEvaluationConfigName.*49.*less than or equal to 48/);
  });

  test('fails for online evaluation config name with invalid pattern', () => {
    expect(() => {
      new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', {
        ...minimalProps(),
        onlineEvaluationConfigName: '1invalidName',
      });
    }).toThrow(/online evaluation config name must match pattern/);
  });

  test('fromOnlineEvaluationConfigAttributes() imports by ARN', () => {
    const configArn = 'arn:aws:bedrock-agentcore:us-east-1:123456789012:online-evaluation-config/myConfigId';
    const imported = agentcore.OnlineEvaluationConfig.fromOnlineEvaluationConfigAttributes(stack, 'ImportedConfig', {
      onlineEvaluationConfigArn: configArn,
    });

    expect(imported.onlineEvaluationConfigArn).toBe(configArn);
    expect(imported.onlineEvaluationConfigId).toBe('myConfigId');
  });

  test('auto-generates name when not provided', () => {
    new agentcore.OnlineEvaluationConfig(stack, 'MyConfig', minimalProps());

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
      OnlineEvaluationConfigName: Match.anyValue(),
    });
  });
});
