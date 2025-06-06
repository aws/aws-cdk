import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../lib';

describe('AgentActionGroupExecutor', () => {
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

  test('creates action group with lambda executor', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {};'),
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: true,
      executor: bedrock.ActionGroupExecutor.fromLambda(fn),
    });

    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    agent.addActionGroup(actionGroup);

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      ActionGroups: Match.arrayWith([
        Match.objectLike({
          ActionGroupName: 'CustomAction',
          ActionGroupState: 'ENABLED',
          ActionGroupExecutor: {
            Lambda: {
              'Fn::GetAtt': [Match.stringLikeRegexp('TestFunction[A-Z0-9]+'), 'Arn'],
            },
          },
        }),
      ]),
    });

    // Verify Lambda permissions
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

  test('grants necessary permissions to agent role', () => {
    const fn = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {};'),
    });

    const actionGroup = new bedrock.AgentActionGroup({
      name: 'CustomAction',
      enabled: true,
      executor: bedrock.ActionGroupExecutor.fromLambda(fn),
    });

    const agent = new bedrock.Agent(stack, 'TestAgent', {
      instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
      foundationModel,
    });

    agent.addActionGroup(actionGroup);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: Match.arrayWith([
              {
                'Fn::GetAtt': [Match.stringLikeRegexp('TestFunction[A-Z0-9]+'), 'Arn'],
              },
            ]),
          }),
        ]),
      },
    });
  });
});
