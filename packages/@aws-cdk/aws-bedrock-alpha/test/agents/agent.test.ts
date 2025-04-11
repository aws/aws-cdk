import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, CfnParameter, Duration, Fn, Token } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as kms from 'aws-cdk-lib/aws-kms';

// Import the module qualified
import * as bedrock from '../../lib';
import { Memory } from '../../bedrock/agents/memory';

/* eslint-disable quote-props */

describe('Bedrock Agent', () => {
  let stack: core.Stack;
  let foundationModel: bedrock.IInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'agent', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ,
      },
    });
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

  describe('created with default properties', () => {
    let agent: bedrock.IAgent;

    beforeEach(() => {
      // Log stack region value for debugging
      console.log('Stack region:', stack.region);
      console.log('Is region token unresolved:', Token.isUnresolved(stack.region));
      console.log('Environment:', stack.environment);
      
      agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });
    });

    test('creates a CFN Agent resource', () => {
      Template.fromStack(stack).resourceCountIs('AWS::Bedrock::Agent', 1);
    });

    describe('creates a CFN Agent resource', () => {
      test('with default properties', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
          'Instruction': Match.stringLikeRegexp('.*at least 40 characters.*'),
          'FoundationModel': foundationModel.invokableArn,
          'IdleSessionTTLInSeconds': 3600,
          'AutoPrepare': false,
          'Description': Match.absent(),
          'CustomerEncryptionKeyArn': Match.absent(),
        });
      });

      test('with default action groups', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
          'ActionGroups': Match.arrayWith([
            Match.objectLike({
              'ActionGroupName': 'UserInputAction',
              'ActionGroupExecutor': Match.absent(),
              'ActionGroupState': 'DISABLED',
              'ParentActionGroupSignature': 'AMAZON.UserInput',
            }),
            Match.objectLike({
              'ActionGroupName': 'CodeInterpreterAction',
              'ActionGroupExecutor': Match.absent(),
              'ActionGroupState': 'DISABLED',
              'ParentActionGroupSignature': 'AMAZON.CodeInterpreter',
            }),
          ]),
        });
      });
    });

    test('creates an IAM role with correct trust policy', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        'AssumeRolePolicyDocument': {
          'Statement': [
            {
              'Action': 'sts:AssumeRole',
              'Effect': 'Allow',
              'Principal': {
                'Service': 'bedrock.amazonaws.com',
              },
              'Condition': {
                'StringEquals': {
                  'aws:SourceAccount': Match.objectLike({ 'Ref': 'AWS::AccountId' })
                },
                'ArnLike': {
                  'aws:SourceArn': {
                    'Fn::Join': ['', [
                      'arn:',
                      { 'Ref': 'AWS::Partition' },
                      ':bedrock:',
                      { 'Ref': 'AWS::Region' },
                      ':',
                      { 'Ref': 'AWS::AccountId' },
                      ':agent/*'
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
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AnyPrincipal(),
      });

      agent.grantInvoke(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': Match.arrayWith([
            Match.objectLike({
              'Action': 'bedrock:InvokeAgent',
              'Effect': 'Allow',
              'Resource': {
                'Fn::GetAtt': [Match.stringLikeRegexp('TestAgentAgentResource[A-Z0-9]+'), 'AgentArn'],
              },
            }),
          ]),
        },
      });
    });

    test('onEvent adds an Event Rule', () => {
      agent.onEvent('MyEvent');

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': ['aws.bedrock'],
          'detail': {
            'agent-id': [{
              'Fn::GetAtt': [Match.stringLikeRegexp('TestAgentAgentResource[A-Z0-9]+'), 'AgentId'],
            }],
          },
        },
      });
    });

    test('metricCount returns a metric with correct dimensions', () => {
      const countMetric = agent.metricCount();

      new cloudwatch.Alarm(stack, 'Alarm', {
        metric: countMetric,
        threshold: 10,
        evaluationPeriods: 2,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        'EvaluationPeriods': 2,
        'Dimensions': [
          {
            'Name': 'AgentId',
            'Value': {
              'Fn::GetAtt': [Match.stringLikeRegexp('TestAgentAgentResource[A-Z0-9]+'), 'AgentId'],
            },
          },
        ],
        'MetricName': 'Invocations',
        'Namespace': 'AWS/Bedrock',
      });
    });
  });

  describe('created with all properties', () => {
    test('sets all properties correctly', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        name: 'MyTestAgent',
        description: 'Test agent description',
        shouldPrepareAgent: true,
        idleSessionTTL: Duration.minutes(30),
        userInputEnabled: true,
        codeInterpreterEnabled: true,
        forceDelete: true,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        'AgentName': 'MyTestAgent',
        'Description': 'Test agent description',
        'Instruction': Match.stringLikeRegexp('.*at least 40 characters.*'),
        'FoundationModel': foundationModel.invokableArn,
        'IdleSessionTTLInSeconds': 1800,
        'AutoPrepare': true,
        'SkipResourceInUseCheckOnDelete': true,
        'ActionGroups': Match.arrayWith([
          Match.objectLike({
            'ActionGroupName': 'UserInputAction',
            'ActionGroupExecutor': Match.absent(),
            'ActionGroupState': 'ENABLED',
            'ParentActionGroupSignature': 'AMAZON.UserInput',
          }),
          Match.objectLike({
            'ActionGroupName': 'CodeInterpreterAction',
            'ActionGroupExecutor': Match.absent(),
            'ActionGroupState': 'ENABLED',
            'ParentActionGroupSignature': 'AMAZON.CodeInterpreter',
          }),
        ]),
      });
    });
  });

  describe('imported by attributes', () => {
    let agent: bedrock.IAgent;

    beforeEach(() => {
      agent = bedrock.Agent.fromAgentAttrs(stack, 'ImportedAgent', {
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/OKDSJOGKMO',
        roleArn: Fn.join('', [
          'arn:',
          Fn.ref('AWS::Partition'),
          ':iam::',
          stack.account,
          ':role/TestRole'
        ])
      });
    });

    test('has the correct agentId parsed from ARN', () => {
      expect(agent.agentId).toEqual('OKDSJOGKMO');
    });

    test('has the correct role ARN', () => {
      expect(stack.resolve(agent.role.roleArn)).toEqual({
        'Fn::Join': ['', [
          'arn:',
          { 'Ref': 'AWS::Partition' },
          ':iam::',
          { 'Ref': 'AWS::AccountId' },
          ':role/TestRole'
        ]]
      });
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
    const parameter = new CfnParameter(stack, 'Parameter');

    new bedrock.Agent(stack, 'TestAgent', {
      instruction: parameter.valueAsString,
      foundationModel,
    });
  });

  describe('created with memory configuration', () => {
    test('sets memory configuration correctly', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        memory: Memory.sessionSummary({
          memoryDurationDays: 30,
          maxRecentSessions: 20,
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        'MemoryConfiguration': {
          'EnabledMemoryTypes': ['SESSION_SUMMARY'],
          'StorageDays': 30,
          'SessionSummaryConfiguration': {
            'MaxRecentSessions': 20,
          },
        },
      });
    });
  });

  describe('created with agent collaborators', () => {
    test('sets agent collaborators correctly', () => {
      const collaboratorAgent = new bedrock.Agent(stack, 'CollaboratorAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      const collaboratorAlias = new bedrock.AgentAlias(stack, 'CollaboratorAlias', {
        agent: collaboratorAgent,
        aliasName: 'TestAlias',
      });

      const collaborator = new bedrock.AgentCollaborator({
        agentAlias: collaboratorAlias,
        collaborationInstruction: 'Collaborate with this agent for testing',
        collaboratorName: 'TestCollaborator',
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration: bedrock.AgentCollaboratorType.SUPERVISOR,
        agentCollaborators: [collaborator],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        'AgentCollaboration': 'SUPERVISOR',
        'AgentCollaborators': Match.arrayWith([
          Match.objectLike({
            'AgentDescriptor': {
              'AliasArn': {
                'Fn::GetAtt': [Match.stringLikeRegexp('CollaboratorAlias.*'), 'AgentAliasArn'],
              },
            },
            'CollaborationInstruction': 'Collaborate with this agent for testing',
            'CollaboratorName': 'TestCollaborator',
          }),
        ]),
      });
    });
  });

  describe('name generation and validation', () => {
    test('generates valid role name within length limits', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        RoleName: Match.stringLikeRegexp('^[a-z0-9-]{1,50}-bedrockagent$'),
      });
    });
  });

  describe('action group management', () => {
    test('can add multiple action groups at once', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      // Create custom action groups with unique names
      const actionGroup1 = new bedrock.AgentActionGroup({
        name: 'CustomAction1',
        enabled: true,
        parentActionGroupSignature: bedrock.ParentActionGroupSignature.USER_INPUT,
      });
      const actionGroup2 = new bedrock.AgentActionGroup({
        name: 'CustomAction2', 
        enabled: true,
        parentActionGroupSignature: bedrock.ParentActionGroupSignature.CODE_INTERPRETER,
      });
      
      agent.addActionGroups(actionGroup1, actionGroup2);

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        ActionGroups: Match.arrayWith([
          Match.objectLike({
            ActionGroupName: 'CustomAction1',
            ActionGroupState: 'ENABLED',
          }),
          Match.objectLike({
            ActionGroupName: 'CustomAction2',
            ActionGroupState: 'ENABLED',
          }),
        ]),
      });
    });

    test('throws error when adding duplicate action group names', () => {
      const agent = new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      // Create two action groups with the same name
      const actionGroup1 = new bedrock.AgentActionGroup({
        name: 'DuplicateAction',
        enabled: true,
        parentActionGroupSignature: bedrock.ParentActionGroupSignature.USER_INPUT,
      });
      const actionGroup2 = new bedrock.AgentActionGroup({
        name: 'DuplicateAction',
        enabled: true,
        parentActionGroupSignature: bedrock.ParentActionGroupSignature.USER_INPUT,
      });

      agent.addActionGroup(actionGroup1);
      expect(() => {
        agent.addActionGroup(actionGroup2);
      }).toThrow(/An action group with name: DuplicateAction has already been defined/);
    });
  });

  describe('agent collaborators rendering', () => {
    test('returns undefined when no collaborators are present', () => {
     new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        AgentCollaborators: Match.absent(),
      });
    });
  });

  describe('created with custom orchestration', () => {
    test('sets custom orchestration correctly', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {};'),
      });

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        orchestrationType: bedrock.OrchestrationType.CUSTOM_ORCHESTRATION,
        customOrchestration: {
          executor: bedrock.OrchestrationExecutor.fromlambdaFunction(fn),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        'OrchestrationType': 'CUSTOM_ORCHESTRATION',
        'CustomOrchestration': {
          'Executor': {
            'Lambda': {
              'Fn::GetAtt': [Match.stringLikeRegexp('TestFunction[A-Z0-9]+'), 'Arn'],
            },
          },
        },
      });
    });
  });

  describe('created with KMS key', () => {
    test('sets KMS key correctly', () => {
      const key = new kms.Key(stack, 'TestKey');

      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        kmsKey: key,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        'CustomerEncryptionKeyArn': {
          'Fn::GetAtt': [Match.stringLikeRegexp('TestKey[A-Z0-9]+'), 'Arn'],
        },
      });
    });
  });

  describe('created with existing role', () => {
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
        'AgentResourceRoleArn': {
          'Fn::GetAtt': [Match.stringLikeRegexp('ExistingRole[A-Z0-9]+'), 'Arn'],
        },
      });
    });
  });
});
