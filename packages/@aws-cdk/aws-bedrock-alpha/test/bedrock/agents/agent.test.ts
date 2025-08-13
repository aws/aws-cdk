import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../bedrock';

describe('Agent', () => {
  let stack: core.Stack;
  let foundationModel: bedrock.IBedrockInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'test-stack');
    foundationModel = {
      invokableArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2',
      grantInvoke: (grantee) => {
        return iam.Grant.addToPrincipal({
          grantee,
          actions: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
          resourceArns: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2'],
        });
      },
    };
  });

  test('creates agent with default name when agentName is not provided', () => {
    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      AgentName: Match.stringLikeRegexp('agent-teststack-testagent-8d92f3fe-bedrockagent'),
    });
  });

  test('creates agent with basic properties', () => {
    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      Instruction: Match.stringLikeRegexp('.*at least 40 characters.*'),
      FoundationModel: foundationModel.invokableArn,
      IdleSessionTTLInSeconds: 600,
      AutoPrepare: false,
      Description: Match.absent(),
      CustomerEncryptionKeyArn: Match.absent(),
    });
  });

  test('creates agent with all properties', () => {
    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
      agentName: 'MyTestAgent',
      description: 'Test agent description',
      shouldPrepareAgent: true,
      idleSessionTTL: core.Duration.minutes(30),
      userInputEnabled: true,
      codeInterpreterEnabled: true,
      forceDelete: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      AgentName: 'MyTestAgent',
      Description: 'Test agent description',
      Instruction: Match.stringLikeRegexp('.*at least 40 characters.*'),
      FoundationModel: foundationModel.invokableArn,
      IdleSessionTTLInSeconds: 1800,
      AutoPrepare: true,
      SkipResourceInUseCheckOnDelete: true,
    });
  });

  test('creates an IAM role with correct trust policy', () => {
    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock.amazonaws.com',
            },
            Condition: {
              StringEquals: {
                'aws:SourceAccount': Match.objectLike({ Ref: 'AWS::AccountId' }),
              },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':bedrock:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':agent/*',
                  ]],
                },
              },
            },
          },
        ],
      },
    });
  });

  test('correctly adds bedrock:InvokeAgent permissions when grantInvoke() is called', () => {
    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });

    agent.grantInvoke(role);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock:InvokeAgent',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.stringLikeRegexp('TestAgent[A-Z0-9]+'), 'AgentArn'],
            },
          }),
        ]),
      },
    });
  });

  test('cannot be created with instruction less than 40 characters', () => {
    expect(() => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'Too short',
        foundationModel,
      });
    }).toThrow(/instruction must be at least 40 characters/);
  });

  test('does not fail validation if instruction is a late-bound value', () => {
    const parameter = new core.CfnParameter(stack, 'Parameter');

    new bedrock.Agent(stack, 'TestAgent', {
      instruction: parameter.valueAsString,
      foundationModel,
    });
  });

  describe('custom orchestration', () => {
    test('sets custom orchestration and grants necessary permissions', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {};'),
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        customOrchestrationExecutor: bedrock.CustomOrchestrationExecutor.fromLambda(fn),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        OrchestrationType: 'CUSTOM_ORCHESTRATION',
        CustomOrchestration: {
          Executor: {
            Lambda: {
              'Fn::GetAtt': [Match.stringLikeRegexp('TestFunction[A-Z0-9]+'), 'Arn'],
            },
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        FunctionName: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestFunction[A-Z0-9]+'), 'Arn'],
        },
        Principal: 'bedrock.amazonaws.com',
        SourceArn: {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestAgent[A-Z0-9]+'), 'AgentArn'],
        },
        SourceAccount: {
          Ref: 'AWS::AccountId',
        },
      });
    });
  });

  test('sets KMS key correctly', () => {
    const key = new kms.Key(stack, 'TestKey');

    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
      kmsKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      CustomerEncryptionKeyArn: {
        'Fn::GetAtt': [Match.stringLikeRegexp('TestKey[A-Z0-9]+'), 'Arn'],
      },
    });
  });

  test('uses existing role correctly', () => {
    const role = new iam.Role(stack, 'ExistingRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
    });

    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
      existingRole: role,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      AgentResourceRoleArn: {
        'Fn::GetAtt': [Match.stringLikeRegexp('ExistingRole[A-Z0-9]+'), 'Arn'],
      },
    });
  });

  describe('static methods', () => {
    test('fromAgentAttributes creates agent from attributes', () => {
      const importedAgent = bedrock.Agent.fromAgentAttributes(stack, 'ImportedAgent', {
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
        roleArn: 'arn:aws:iam::123456789012:role/test-role',
        kmsKeyArn: 'arn:aws:kms:us-east-1:123456789012:key/test-key-id',
        lastUpdated: '2023-01-01T00:00:00Z',
        agentVersion: '1',
      });

      expect(importedAgent.agentArn).toBe('arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id');
      expect(importedAgent.agentId).toBe('test-agent-id');
      expect(importedAgent.lastUpdated).toBe('2023-01-01T00:00:00Z');
      // Note: agentVersion is not available on IAgent interface, only on concrete Agent class
      expect((importedAgent as any).agentVersion).toBe('1');
      expect(importedAgent.kmsKey).toBeDefined();
    });

    test('fromAgentAttributes uses default version when not provided', () => {
      const importedAgent = bedrock.Agent.fromAgentAttributes(stack, 'ImportedAgent', {
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
        roleArn: 'arn:aws:iam::123456789012:role/test-role',
      });

      expect((importedAgent as any).agentVersion).toBe('DRAFT');
      expect(importedAgent.kmsKey).toBeUndefined();
      expect(importedAgent.lastUpdated).toBeUndefined();
    });
  });

  describe('event and metrics methods', () => {
    test('onEvent creates EventBridge rule with default configuration', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const rule = agent.onEvent('TestRule');

      expect(rule).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        EventPattern: {
          source: ['aws.bedrock'],
          detail: {
            'agent-id': [{ 'Fn::GetAtt': [Match.stringLikeRegexp('TestAgent[A-Z0-9]+'), 'AgentId'] }],
          },
        },
      });
    });

    test('onEvent creates EventBridge rule with custom options', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const rule = agent.onEvent('TestRule', {
        description: 'Custom rule description',
      });

      expect(rule).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        Description: 'Custom rule description',
        EventPattern: {
          source: ['aws.bedrock'],
          detail: {
            'agent-id': [{ 'Fn::GetAtt': [Match.stringLikeRegexp('TestAgent[A-Z0-9]+'), 'AgentId'] }],
          },
        },
      });
    });

    test('metricCount creates CloudWatch metric with default configuration', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const metric = agent.metricCount();

      expect(metric.namespace).toBe('AWS/Bedrock');
      expect(metric.metricName).toBe('Invocations');
      expect(metric.dimensions).toEqual({
        AgentId: agent.agentId,
      });
    });

    test('metricCount creates CloudWatch metric with custom options', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const metric = agent.metricCount({
        statistic: 'Sum',
        period: core.Duration.minutes(5),
      });

      expect(metric.namespace).toBe('AWS/Bedrock');
      expect(metric.metricName).toBe('Invocations');
      expect(metric.statistic).toBe('Sum');
      expect(metric.period?.toSeconds()).toBe(300);
    });
  });

  describe('validation', () => {
    test('validates idleSessionTTL range - too low', () => {
      expect(() => {
        new bedrock.Agent(stack, 'TestAgent', {
          instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
          foundationModel,
          idleSessionTTL: core.Duration.seconds(30),
        });
      }).toThrow(/cannot be converted into a whole number of minutes/);
    });

    test('validates idleSessionTTL range - too high', () => {
      expect(() => {
        new bedrock.Agent(stack, 'TestAgent', {
          instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
          foundationModel,
          idleSessionTTL: core.Duration.minutes(65),
        });
      }).toThrow(/idleSessionTTL must be between 1 and 60 minutes/);
    });

    test('accepts valid idleSessionTTL values', () => {
      expect(() => {
        new bedrock.Agent(stack, 'TestAgent', {
          instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
          foundationModel,
          idleSessionTTL: core.Duration.minutes(30),
        });
      }).not.toThrow();
    });
  });

  describe('action groups', () => {
    test('addActionGroups method adds multiple action groups', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const fn1 = new lambda.Function(stack, 'TestFunction1', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {};'),
      });

      const fn2 = new lambda.Function(stack, 'TestFunction2', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {};'),
      });

      const actionGroup1 = new bedrock.AgentActionGroup({
        name: 'TestActionGroup1',
        description: 'Test action group 1',
        executor: bedrock.ActionGroupExecutor.fromLambda(fn1),
        enabled: true,
      });

      const actionGroup2 = new bedrock.AgentActionGroup({
        name: 'TestActionGroup2',
        description: 'Test action group 2',
        executor: bedrock.ActionGroupExecutor.fromLambda(fn2),
        enabled: true,
      });

      agent.addActionGroups(actionGroup1, actionGroup2);

      expect(agent.actionGroups).toHaveLength(4); // 2 default + 2 added
    });

    test('throws error when adding duplicate action group names', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {};'),
      });

      const actionGroup1 = new bedrock.AgentActionGroup({
        name: 'DuplicateName',
        description: 'Test action group 1',
        executor: bedrock.ActionGroupExecutor.fromLambda(fn),
        enabled: true,
      });

      const actionGroup2 = new bedrock.AgentActionGroup({
        name: 'DuplicateName',
        description: 'Test action group 2',
        executor: bedrock.ActionGroupExecutor.fromLambda(fn),
        enabled: true,
      });

      agent.addActionGroup(actionGroup1);

      expect(() => {
        agent.addActionGroup(actionGroup2);
      }).toThrow(/Action group already exists/);
    });
  });

  describe('memory configuration', () => {
    test('creates agent with memory configuration', () => {
      const memory = bedrock.Memory.sessionSummary({
        memoryDuration: core.Duration.days(30),
        maxRecentSessions: 20,
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        memory,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        MemoryConfiguration: {
          EnabledMemoryTypes: ['SESSION_SUMMARY'],
          StorageDays: 30,
          SessionSummaryConfiguration: {
            MaxRecentSessions: 20,
          },
        },
      });
    });

    test('creates agent with default memory configuration', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        memory: bedrock.Memory.SESSION_SUMMARY,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        MemoryConfiguration: {
          EnabledMemoryTypes: ['SESSION_SUMMARY'],
          StorageDays: 30,
          SessionSummaryConfiguration: {
            MaxRecentSessions: 20,
          },
        },
      });
    });
  });

  describe('agent collaborators', () => {
    test('agent with collaborators via AgentCollaboration constructor renders correctly in CFN template', () => {
      const collaboratorAlias = bedrock.AgentAlias.fromAttributes(stack, 'CollaboratorAlias', {
        aliasId: 'test-alias-id',
        aliasName: 'TestAlias',
        agentVersion: '1',
        agent: bedrock.Agent.fromAgentAttributes(stack, 'CollaboratorAgent', {
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/collaborator-agent-id',
          roleArn: 'arn:aws:iam::123456789012:role/collaborator-role',
        }),
      });

      const collaborator = new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias,
        collaborationInstruction: 'Help with data analysis tasks',
        collaboratorName: 'DataAnalyst',
        relayConversationHistory: true,
      });

      const agentCollaboration = new bedrock.AgentCollaboration({
        type: bedrock.AgentCollaboratorType.SUPERVISOR,
        collaborators: [collaborator],
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration,
      });

      // Verify that the agent has the correct collaboration configuration in the CFN template
      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentCollaboration: 'SUPERVISOR',
        AgentCollaborators: [
          {
            AgentDescriptor: {
              AliasArn: Match.objectLike({
                'Fn::Join': Match.anyValue(),
              }),
            },
            CollaborationInstruction: 'Help with data analysis tasks',
            CollaboratorName: 'DataAnalyst',
            RelayConversationHistory: 'TO_COLLABORATOR',
          },
        ],
      });
    });

    test('agent with multiple collaborators via AgentCollaboration constructor', () => {
      const collaboratorAlias1 = bedrock.AgentAlias.fromAttributes(stack, 'CollaboratorAlias1', {
        aliasId: 'test-alias-id-1',
        aliasName: 'TestAlias1',
        agentVersion: '1',
        agent: bedrock.Agent.fromAgentAttributes(stack, 'CollaboratorAgent1', {
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/collaborator-agent-id-1',
          roleArn: 'arn:aws:iam::123456789012:role/collaborator-role-1',
        }),
      });

      const collaboratorAlias2 = bedrock.AgentAlias.fromAttributes(stack, 'CollaboratorAlias2', {
        aliasId: 'test-alias-id-2',
        aliasName: 'TestAlias2',
        agentVersion: '2',
        agent: bedrock.Agent.fromAgentAttributes(stack, 'CollaboratorAgent2', {
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/collaborator-agent-id-2',
          roleArn: 'arn:aws:iam::123456789012:role/collaborator-role-2',
        }),
      });

      const collaborator1 = new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias1,
        collaborationInstruction: 'Help with data analysis tasks',
        collaboratorName: 'DataAnalyst',
        relayConversationHistory: true,
      });

      const collaborator2 = new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias2,
        collaborationInstruction: 'Help with code generation tasks',
        collaboratorName: 'CodeGenerator',
        relayConversationHistory: false,
      });

      const agentCollaboration = new bedrock.AgentCollaboration({
        type: bedrock.AgentCollaboratorType.SUPERVISOR,
        collaborators: [collaborator1, collaborator2],
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration,
      });

      // Verify that the agent has multiple collaborators in the CFN template
      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentCollaboration: 'SUPERVISOR',
        AgentCollaborators: [
          {
            AgentDescriptor: {
              AliasArn: Match.objectLike({
                'Fn::Join': Match.anyValue(),
              }),
            },
            CollaborationInstruction: 'Help with data analysis tasks',
            CollaboratorName: 'DataAnalyst',
            RelayConversationHistory: 'TO_COLLABORATOR',
          },
          {
            AgentDescriptor: {
              AliasArn: Match.objectLike({
                'Fn::Join': Match.anyValue(),
              }),
            },
            CollaborationInstruction: 'Help with code generation tasks',
            CollaboratorName: 'CodeGenerator',
            RelayConversationHistory: 'DISABLED',
          },
        ],
      });
    });

    test('collaborators from AgentCollaboration props are rendered correctly', () => {
      const collaboratorAlias = bedrock.AgentAlias.fromAttributes(stack, 'CollaboratorAlias', {
        aliasId: 'test-alias-id',
        aliasName: 'TestAlias',
        agentVersion: '1',
        agent: bedrock.Agent.fromAgentAttributes(stack, 'CollaboratorAgent', {
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/collaborator-agent-id',
          roleArn: 'arn:aws:iam::123456789012:role/collaborator-role',
        }),
      });

      const collaborator = new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias,
        collaborationInstruction: 'Help with data analysis tasks',
        collaboratorName: 'DataAnalyst',
        relayConversationHistory: true,
      });

      const agentCollaboration = new bedrock.AgentCollaboration({
        type: bedrock.AgentCollaboratorType.SUPERVISOR,
        collaborators: [collaborator],
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentCollaboration: 'SUPERVISOR',
        AgentCollaborators: [
          {
            AgentDescriptor: {
              AliasArn: Match.objectLike({
                'Fn::Join': Match.anyValue(),
              }),
            },
            CollaborationInstruction: 'Help with data analysis tasks',
            CollaboratorName: 'DataAnalyst',
            RelayConversationHistory: 'TO_COLLABORATOR',
          },
        ],
      });
    });
  });

  describe('edge cases', () => {
    test('handles undefined agentCollaborators', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration: new bedrock.AgentCollaboration({
          type: bedrock.AgentCollaboratorType.SUPERVISOR,
          collaborators: [],
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentCollaboration: 'SUPERVISOR',
        AgentCollaborators: Match.absent(),
      });
    });

    test('handles disabled default action groups', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        userInputEnabled: false,
        codeInterpreterEnabled: false,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        ActionGroups: [
          {
            ActionGroupName: 'UserInputAction',
            ActionGroupState: 'DISABLED',
            ParentActionGroupSignature: 'AMAZON.UserInput',
            SkipResourceInUseCheckOnDelete: false,
          },
          {
            ActionGroupName: 'CodeInterpreterAction',
            ActionGroupState: 'DISABLED',
            ParentActionGroupSignature: 'AMAZON.CodeInterpreter',
            SkipResourceInUseCheckOnDelete: false,
          },
        ],
      });
    });

    test('creates agent with description', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        description: 'This is a test agent with a custom description',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        Description: 'This is a test agent with a custom description',
      });
    });

    test('creates agent with custom agent name', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentName: 'MyCustomAgentName',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentName: 'MyCustomAgentName',
      });
    });

    test('creates agent with agent collaboration', () => {
      const collaboratorAlias = bedrock.AgentAlias.fromAttributes(stack, 'CollaboratorAlias', {
        aliasId: 'test-alias-id',
        aliasName: 'TestAlias',
        agentVersion: '1',
        agent: bedrock.Agent.fromAgentAttributes(stack, 'CollaboratorAgent', {
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/collaborator-agent-id',
          roleArn: 'arn:aws:iam::123456789012:role/collaborator-role',
        }),
      });

      const collaborator = new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias,
        collaborationInstruction: 'Help with data analysis tasks',
        collaboratorName: 'DataAnalyst',
        relayConversationHistory: true,
      });

      const agentCollaboration = new bedrock.AgentCollaboration({
        type: bedrock.AgentCollaboratorType.SUPERVISOR,
        collaborators: [collaborator],
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentCollaboration: 'SUPERVISOR',
        AgentCollaborators: [
          {
            AgentDescriptor: {
              AliasArn: Match.objectLike({
                'Fn::Join': Match.anyValue(),
              }),
            },
            CollaborationInstruction: 'Help with data analysis tasks',
            CollaboratorName: 'DataAnalyst',
            RelayConversationHistory: 'TO_COLLABORATOR',
          },
        ],
      });
    });
  });
});
