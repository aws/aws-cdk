import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const TOPIC_RULE_ROLE_ID = 'MyTopicRuleTopicRuleActionRoleCE2D05DA';

let stack: cdk.Stack;
let topicRule: iot.TopicRule;
let stateMachine: sfn.StateMachine;
beforeEach(() => {
  stack = new cdk.Stack();
  topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323(
      "SELECT * as device_id FROM 'device/+/data'",
    ),
  });
  stateMachine = new sfn.StateMachine(stack, 'TestStateMachine', {
    definition: new sfn.Pass(stack, 'TestPass'),
  });
});

test('Default Step Functions action', () => {
  topicRule.addAction(new actions.StepFunctionsAction(stateMachine));

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          StepFunctions: {
            RoleArn: {
              'Fn::GetAtt': [TOPIC_RULE_ROLE_ID, 'Arn'],
            },
            StateMachineName: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('TestStateMachine'),
                'Name',
              ],
            },
          },
        },
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'states:StartExecution',
          Effect: 'Allow',
          // Resource: Match.objectLike({ Ref: stateMachine.stateMachineName }),
        },
      ],
    },
    Roles: [{ Ref: TOPIC_RULE_ROLE_ID }],
  });
});

test('Can set role', () => {
  const ROLE_ARN = 'arn:aws:iam::123456789012:role/testrole';
  const role = iam.Role.fromRoleArn(stack, 'TestRole', ROLE_ARN);

  topicRule.addAction(
    new actions.StepFunctionsAction(stateMachine, {
      role,
    }),
  );

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [Match.objectLike({ StepFunctions: { RoleArn: ROLE_ARN } })],
    },
  });
});

test('Can set execution name prefix', () => {
  const PREFIX = 'test';

  topicRule.addAction(
    new actions.StepFunctionsAction(stateMachine, {
      executionNamePrefix: PREFIX,
    }),
  );

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ StepFunctions: { ExecutionNamePrefix: PREFIX } }),
      ],
    },
  });
});
