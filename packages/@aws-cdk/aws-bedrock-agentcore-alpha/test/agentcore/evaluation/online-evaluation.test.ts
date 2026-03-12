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

import { App, Lazy, Stack, Tags } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import {
  OnlineEvaluationConfig,
  EvaluatorReference,
  DataSourceConfig,
  BuiltinEvaluator,
  FilterOperator,
  Runtime,
  AgentRuntimeArtifact,
} from '../../../lib';

describe('OnlineEvaluationConfig', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  describe('creation with minimal props', () => {
    test('creates OnlineEvaluationConfig with CloudWatch Logs data source', () => {
      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'test_evaluation',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/bedrock-agentcore/my-agent'],
          serviceNames: ['my-agent.default'],
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
        OnlineEvaluationConfigName: 'test_evaluation',
        Evaluators: [{ EvaluatorId: 'Builtin.Helpfulness' }],
        DataSourceConfig: {
          CloudWatchLogs: {
            LogGroupNames: ['/aws/bedrock-agentcore/my-agent'],
            ServiceNames: ['my-agent.default'],
          },
        },
        EvaluationExecutionRoleArn: Match.anyValue(),
        Rule: {
          SamplingConfig: { SamplingPercentage: 10 },
          SessionConfig: { SessionTimeoutMinutes: 15 },
        },
      });
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'bedrock-agentcore.amazonaws.com',
              },
            },
          ],
        },
      });
    });

    test('creates OnlineEvaluationConfig with AgentCore Runtime endpoint data source', () => {
      const runtime = new Runtime(stack, 'TestRuntime', {
        runtimeName: 'test_runtime',
        agentRuntimeArtifact: AgentRuntimeArtifact.fromImageUri('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest'),
      });
      const endpoint = runtime.addEndpoint('DEFAULT');

      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'test_evaluation',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.CORRECTNESS)],
        dataSource: DataSourceConfig.fromAgentRuntimeEndpoint(runtime, endpoint),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {});
    });
  });

  describe('creation with all props', () => {
    test('creates OnlineEvaluationConfig with all options', () => {
      const executionRole = new iam.Role(stack, 'ExecutionRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      });

      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'full_evaluation',
        evaluators: [
          EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS),
          EvaluatorReference.builtin(BuiltinEvaluator.CORRECTNESS),
          EvaluatorReference.builtin(BuiltinEvaluator.FAITHFULNESS),
        ],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/bedrock-agentcore/my-agent'],
          serviceNames: ['my-agent.default'],
        }),
        executionRole,
        description: 'Test evaluation configuration',
        samplingPercentage: 25,
        filters: [
          {
            key: 'user.region',
            operator: FilterOperator.EQUALS,
            value: 'us-east-1',
          },
        ],
        sessionTimeoutMinutes: 30,
        tags: {
          Environment: 'test',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
        OnlineEvaluationConfigName: 'full_evaluation',
        Evaluators: [
          { EvaluatorId: 'Builtin.Helpfulness' },
          { EvaluatorId: 'Builtin.Correctness' },
          { EvaluatorId: 'Builtin.Faithfulness' },
        ],
        DataSourceConfig: {
          CloudWatchLogs: {
            LogGroupNames: ['/aws/bedrock-agentcore/my-agent'],
            ServiceNames: ['my-agent.default'],
          },
        },
        EvaluationExecutionRoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        Rule: {
          SamplingConfig: { SamplingPercentage: 25 },
          SessionConfig: { SessionTimeoutMinutes: 30 },
          Filters: [
            {
              Key: 'user.region',
              Operator: 'Equals',
              Value: { StringValue: 'us-east-1' },
            },
          ],
        },
        Description: 'Test evaluation configuration',
        Tags: [{ Key: 'Environment', Value: 'test' }],
      });
    });
  });

  describe('tag handling', () => {
    test('converts Record<string,string> tags to Array<CfnTag> format', () => {
      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'tag_test',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/log-group'],
          serviceNames: ['service'],
        }),
        tags: {
          Environment: 'test',
          Team: 'ml',
        },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
        Tags: Match.arrayWith([
          { Key: 'Environment', Value: 'test' },
          { Key: 'Team', Value: 'ml' },
        ]),
      });
    });

    test('Tags.of() API propagates tags via ITaggableV2', () => {
      const evaluation = new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'taggable_test',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/log-group'],
          serviceNames: ['service'],
        }),
      });

      Tags.of(evaluation).add('TagKey', 'TagValue');

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::OnlineEvaluationConfig', {
        Tags: Match.arrayWith([
          { Key: 'TagKey', Value: 'TagValue' },
        ]),
      });
    });
  });

  describe('evaluator references', () => {
    test('creates built-in evaluator reference', () => {
      const evaluator = EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS);

      expect(evaluator.evaluatorId).toBe('Builtin.Helpfulness');
      expect(evaluator._render()).toEqual({ evaluatorId: 'Builtin.Helpfulness' });
    });

    test('supports all built-in evaluators', () => {
      expect(EvaluatorReference.builtin(BuiltinEvaluator.GOAL_SUCCESS_RATE).evaluatorId).toBe('Builtin.GoalSuccessRate');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS).evaluatorId).toBe('Builtin.Helpfulness');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.CORRECTNESS).evaluatorId).toBe('Builtin.Correctness');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.FAITHFULNESS).evaluatorId).toBe('Builtin.Faithfulness');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.HARMFULNESS).evaluatorId).toBe('Builtin.Harmfulness');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.STEREOTYPING).evaluatorId).toBe('Builtin.Stereotyping');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.REFUSAL).evaluatorId).toBe('Builtin.Refusal');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.TOOL_SELECTION_ACCURACY).evaluatorId).toBe('Builtin.ToolSelectionAccuracy');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.TOOL_PARAMETER_ACCURACY).evaluatorId).toBe('Builtin.ToolParameterAccuracy');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.COHERENCE).evaluatorId).toBe('Builtin.Coherence');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.RESPONSE_RELEVANCE).evaluatorId).toBe('Builtin.ResponseRelevance');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.CONCISENESS).evaluatorId).toBe('Builtin.Conciseness');
      expect(EvaluatorReference.builtin(BuiltinEvaluator.INSTRUCTION_FOLLOWING).evaluatorId).toBe('Builtin.InstructionFollowing');
    });
  });

  describe('data source configurations', () => {
    test('creates CloudWatch Logs data source', () => {
      const dataSource = DataSourceConfig.fromCloudWatchLogs({
        logGroupNames: ['/aws/log-group-1', '/aws/log-group-2'],
        serviceNames: ['service-1', 'service-2'],
      });

      expect(dataSource._render()).toEqual({
        cloudWatchLogs: {
          logGroupNames: ['/aws/log-group-1', '/aws/log-group-2'],
          serviceNames: ['service-1', 'service-2'],
        },
      });
    });

    test('creates AgentCore Runtime endpoint data source', () => {
      const runtime = new Runtime(stack, 'TestRuntime', {
        runtimeName: 'my_runtime',
        agentRuntimeArtifact: AgentRuntimeArtifact.fromImageUri('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest'),
      });
      const endpoint = runtime.addEndpoint('PROD');

      const dataSource = DataSourceConfig.fromAgentRuntimeEndpoint(runtime, endpoint);

      const rendered = dataSource._render();
      expect(rendered.cloudWatchLogs).toBeDefined();
      expect(rendered.cloudWatchLogs.logGroupNames).toHaveLength(1);
      expect(rendered.cloudWatchLogs.logGroupNames[0]).toContain('/aws/bedrock-agentcore/runtimes/');
      expect(rendered.cloudWatchLogs.logGroupNames[0]).toContain('-PROD');
      expect(rendered.cloudWatchLogs.serviceNames).toEqual(['my_runtime.PROD']);
    });

    test('creates AgentCore Runtime endpoint data source with DEFAULT endpoint', () => {
      const runtime = new Runtime(stack, 'TestRuntime', {
        runtimeName: 'test_agent',
        agentRuntimeArtifact: AgentRuntimeArtifact.fromImageUri('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest'),
      });
      const endpoint = runtime.addEndpoint('DEFAULT');

      const dataSource = DataSourceConfig.fromAgentRuntimeEndpoint(runtime, endpoint);

      const rendered = dataSource._render();
      expect(rendered.cloudWatchLogs.serviceNames).toEqual(['test_agent.DEFAULT']);
    });

    test('creates AgentCore Runtime endpoint data source with default endpoint when not specified', () => {
      const runtime = new Runtime(stack, 'TestRuntime', {
        runtimeName: 'test_agent',
        agentRuntimeArtifact: AgentRuntimeArtifact.fromImageUri('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest'),
      });

      const dataSource = DataSourceConfig.fromAgentRuntimeEndpoint(runtime);

      const rendered = dataSource._render();
      expect(rendered.cloudWatchLogs.serviceNames).toEqual(['test_agent.DEFAULT']);
      expect(rendered.cloudWatchLogs.logGroupNames[0]).toContain('-DEFAULT');
    });

    test('creates AgentCore Runtime endpoint data source with endpoint name as string', () => {
      const runtime = new Runtime(stack, 'TestRuntime', {
        runtimeName: 'test_agent',
        agentRuntimeArtifact: AgentRuntimeArtifact.fromImageUri('123456789012.dkr.ecr.us-east-1.amazonaws.com/my-agent:latest'),
      });

      const dataSource = DataSourceConfig.fromAgentRuntimeEndpoint(runtime, 'PROD');

      const rendered = dataSource._render();
      expect(rendered.cloudWatchLogs.serviceNames).toEqual(['test_agent.PROD']);
      expect(rendered.cloudWatchLogs.logGroupNames[0]).toContain('-PROD');
    });
  });

  describe('validation', () => {
    test('throws error for invalid config name - starts with number', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: '123invalid',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
        });
      }).toThrow(/does not match required pattern/);
    });

    test('throws error for config name too long', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'a'.repeat(49),
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
        });
      }).toThrow(/at most 48 characters/);
    });

    test('throws error for empty evaluators array', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
        });
      }).toThrow(/At least 1 evaluator is required/);
    });

    test('throws error for too many evaluators', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: Array(11).fill(EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)),
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
        });
      }).toThrow(/At most 10 evaluators are allowed/);
    });

    test('throws error for invalid sampling percentage - too low', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          samplingPercentage: 0.001,
        });
      }).toThrow(/at least 0.01/);
    });

    test('throws error for invalid sampling percentage - too high', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          samplingPercentage: 101,
        });
      }).toThrow(/at most 100/);
    });

    test('throws error for too many filters', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          filters: Array(6).fill({
            key: 'test',
            operator: FilterOperator.EQUALS,
            value: 'value',
          }),
        });
      }).toThrow(/At most 5 filters are allowed/);
    });

    test('throws error for invalid session timeout - too low', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          sessionTimeoutMinutes: 0,
        });
      }).toThrow(/at least 1 minute/);
    });

    test('throws error for invalid session timeout - too high', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          sessionTimeoutMinutes: 1441,
        });
      }).toThrow(/at most 1440 minutes/);
    });

    test('throws error for description too long', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          description: 'a'.repeat(201),
        });
      }).toThrow(/at most 200 characters/);
    });

    test('throws error for empty config name', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: '',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
        });
      }).toThrow(/at least 1 character/);
    });

    test('accepts token config name without validation', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: Lazy.string({ produce: () => 'resolved_later' }),
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
        });
      }).not.toThrow();
    });

    test('accepts token description without validation', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          description: Lazy.string({ produce: () => 'a'.repeat(300) }),
        });
      }).not.toThrow();
    });

    test('accepts token sampling percentage without validation', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          samplingPercentage: Lazy.number({ produce: () => 999 }),
        });
      }).not.toThrow();
    });

    test('accepts token session timeout without validation', () => {
      expect(() => {
        new OnlineEvaluationConfig(stack, 'TestEvaluation', {
          configName: 'test_evaluation',
          evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
          dataSource: DataSourceConfig.fromCloudWatchLogs({
            logGroupNames: ['/aws/log-group'],
            serviceNames: ['service'],
          }),
          sessionTimeoutMinutes: Lazy.number({ produce: () => 9999 }),
        });
      }).not.toThrow();
    });

    test('throws error for empty log group names', () => {
      expect(() => {
        DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: [],
          serviceNames: ['service'],
        });
      }).toThrow(/At least 1 log group name is required/);
    });

    test('throws error for too many log group names', () => {
      expect(() => {
        DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: Array(6).fill('/aws/log-group'),
          serviceNames: ['service'],
        });
      }).toThrow(/At most 5 log group names are allowed/);
    });

    test('throws error for empty service names', () => {
      expect(() => {
        DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/log-group'],
          serviceNames: [],
        });
      }).toThrow(/At least 1 service name is required/);
    });
  });

  describe('IAM role', () => {
    test('auto-creates execution role with required permissions', () => {
      new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'test_evaluation',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/bedrock-agentcore/my-agent'],
          serviceNames: ['my-agent.default'],
        }),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith([
                'logs:DescribeLogGroups',
                'logs:GetQueryResults',
                'logs:StartQuery',
              ]),
              Sid: 'CloudWatchLogReadStatement',
            }),
          ]),
        },
      });
    });

    test('uses provided execution role', () => {
      const executionRole = new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
        roleName: 'CustomEvaluationRole',
      });

      const evaluation = new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'test_evaluation',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/log-group'],
          serviceNames: ['service'],
        }),
        executionRole,
      });

      expect(evaluation.executionRole).toBe(executionRole);
    });
  });

  describe('grant methods', () => {
    test('grantAdmin grants control plane permissions', () => {
      const evaluation = new OnlineEvaluationConfig(stack, 'TestEvaluation', {
        configName: 'test_evaluation',
        evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
        dataSource: DataSourceConfig.fromCloudWatchLogs({
          logGroupNames: ['/aws/log-group'],
          serviceNames: ['service'],
        }),
      });

      const grantee = new iam.Role(stack, 'Grantee', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      evaluation.grantAdmin(grantee);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: Match.arrayWith([
                'bedrock-agentcore:CreateOnlineEvaluationConfig',
                'bedrock-agentcore:GetOnlineEvaluationConfig',
                'bedrock-agentcore:UpdateOnlineEvaluationConfig',
                'bedrock-agentcore:DeleteOnlineEvaluationConfig',
                'bedrock-agentcore:ListOnlineEvaluationConfigs',
              ]),
            }),
          ]),
        },
      });
    });
  });

  describe('import methods', () => {
    test('fromConfigId imports by ID', () => {
      const imported = OnlineEvaluationConfig.fromOnlineEvaluationConfigId(stack, 'Imported', 'my-config-id');

      expect(imported.onlineEvaluationConfigId).toBe('my-config-id');
      expect(imported.onlineEvaluationConfigArn).toContain('my-config-id');
    });

    test('fromConfigArn imports by ARN', () => {
      const imported = OnlineEvaluationConfig.fromOnlineEvaluationConfigArn(
        stack,
        'Imported',
        'arn:aws:bedrock-agentcore:us-east-1:123456789012:online-evaluation-config/my-config-id',
      );

      expect(imported.onlineEvaluationConfigId).toBe('my-config-id');
      expect(imported.onlineEvaluationConfigArn).toBe(
        'arn:aws:bedrock-agentcore:us-east-1:123456789012:online-evaluation-config/my-config-id',
      );
    });

    test('fromAttributes imports with all attributes', () => {
      const imported = OnlineEvaluationConfig.fromOnlineEvaluationConfigAttributes(stack, 'Imported', {
        onlineEvaluationConfigArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:online-evaluation-config/my-config-id',
        onlineEvaluationConfigId: 'my-config-id',
        onlineEvaluationConfigName: 'my_config',
        executionRoleArn: 'arn:aws:iam::123456789012:role/MyRole',
      });

      expect(imported.onlineEvaluationConfigId).toBe('my-config-id');
      expect(imported.onlineEvaluationConfigName).toBe('my_config');
      expect(imported.executionRole).toBeDefined();
    });
  });
});
