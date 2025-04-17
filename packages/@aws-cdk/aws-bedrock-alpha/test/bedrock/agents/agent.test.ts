import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../lib';

describe('Agent', () => {
  let stack: core.Stack;
  let foundationModel: bedrock.IInvokable;

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

  test('creates agent with basic properties', () => {
    new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      Instruction: Match.stringLikeRegexp('.*at least 40 characters.*'),
      FoundationModel: foundationModel.invokableArn,
      IdleSessionTTLInSeconds: 3600,
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
        orchestrationType: bedrock.OrchestrationType.CUSTOM_ORCHESTRATION,
        customOrchestration: {
          executor: bedrock.OrchestrationExecutor.fromlambdaFunction(fn),
        },
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

    test('throws error when CUSTOM_ORCHESTRATION type is set without customOrchestration', () => {
      expect(() => {
        new bedrock.Agent(stack, 'TestAgent', {
          instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
          foundationModel,
          orchestrationType: bedrock.OrchestrationType.CUSTOM_ORCHESTRATION,
        });
      }).toThrow(/customOrchestration must be provided when orchestrationType is CUSTOM_ORCHESTRATION/);
    });

    test('throws error when customOrchestration is provided without CUSTOM_ORCHESTRATION type', () => {
      const fn = new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async () => {};'),
      });

      expect(() => {
        new bedrock.Agent(stack, 'TestAgent', {
          instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
          foundationModel,
          orchestrationType: bedrock.OrchestrationType.DEFAULT,
          customOrchestration: {
            executor: bedrock.OrchestrationExecutor.fromlambdaFunction(fn),
          },
        });
      }).toThrow(/customOrchestration can only be provided when orchestrationType is CUSTOM_ORCHESTRATION/);
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

  describe('edge cases', () => {
    test('handles undefined agentCollaborators', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        agentCollaboration: bedrock.AgentCollaboratorType.SUPERVISOR,
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
  });
});
