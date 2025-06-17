import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../lib';

describe('AgentActionGroup', () => {
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

  test('creates action group with USER_INPUT signature', () => {
    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: true,
      parentActionGroupSignature: bedrock.ParentActionGroupSignature.USER_INPUT,
    });

    agent.addActionGroup(actionGroup);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      ActionGroups: Match.arrayWith([
        Match.objectLike({
          ActionGroupName: 'CustomAction',
          ActionGroupState: 'ENABLED',
          ParentActionGroupSignature: 'AMAZON.UserInput',
        }),
      ]),
    });
  });

  test('creates action group with CODE_INTERPRETER signature', () => {
    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: true,
      parentActionGroupSignature: bedrock.ParentActionGroupSignature.CODE_INTERPRETER,
    });

    agent.addActionGroup(actionGroup);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      ActionGroups: Match.arrayWith([
        Match.objectLike({
          ActionGroupName: 'CustomAction',
          ActionGroupState: 'ENABLED',
          ParentActionGroupSignature: 'AMAZON.CodeInterpreter',
        }),
      ]),
    });
  });

  test('creates disabled action group', () => {
    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: false,
      parentActionGroupSignature: bedrock.ParentActionGroupSignature.USER_INPUT,
    });

    agent.addActionGroup(actionGroup);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      ActionGroups: Match.arrayWith([
        Match.objectLike({
          ActionGroupName: 'CustomAction',
          ActionGroupState: 'DISABLED',
          ParentActionGroupSignature: 'AMAZON.UserInput',
        }),
      ]),
    });
  });

  test('can add multiple action groups', () => {
    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    const actionGroup1 = new bedrock.AgentActionGroup({
      name: 'CustomAction1',
      enabled: true,
      parentActionGroupSignature: bedrock.ParentActionGroupSignature.USER_INPUT,
    });

    const actionGroup2 = new bedrock.AgentActionGroup({
      name: 'CustomAction2',
      enabled: false,
      parentActionGroupSignature: bedrock.ParentActionGroupSignature.CODE_INTERPRETER,
    });

    agent.addActionGroups(actionGroup1, actionGroup2);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      ActionGroups: Match.arrayWith([
        Match.objectLike({
          ActionGroupName: 'CustomAction1',
          ActionGroupState: 'ENABLED',
          ParentActionGroupSignature: 'AMAZON.UserInput',
        }),
        Match.objectLike({
          ActionGroupName: 'CustomAction2',
          ActionGroupState: 'DISABLED',
          ParentActionGroupSignature: 'AMAZON.CodeInterpreter',
        }),
      ]),
    });
  });

  test('throws error when adding duplicate action group names', () => {
    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

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
    }).toThrow(/Action group already exists/);
  });
});
