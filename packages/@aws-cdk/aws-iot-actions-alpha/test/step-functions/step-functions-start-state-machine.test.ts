import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

test('Default state machine action action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stateMachine = new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Wait(stack, 'Hello', { time: sfn.WaitTime.duration(cdk.Duration.seconds(10)) })),
  });

  // WHEN
  topicRule.addAction(
    new actions.StepFunctionsStateMachineAction(stateMachine),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          StepFunctions: {
            StateMachineName: {
              'Fn::Select': [6,
                {
                  'Fn::Split': [
                    ':',
                    { Ref: 'SM934E715A' },
                  ],
                }],
            },
            RoleArn: {
              'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'],
            },
          },
        },
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'iot.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'states:StartExecution',
          Effect: 'Allow',
          Resource: {
            Ref: 'SM934E715A',
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyTopicRuleTopicRuleActionRoleDefaultPolicy54A701F7',
    Roles: [
      { Ref: 'MyTopicRuleTopicRuleActionRoleCE2D05DA' },
    ],
  });
});

test('can use imported state machine', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stateMachine = sfn.StateMachine.fromStateMachineArn(stack, 'SM', 'arn:aws:states:us-east-1:111122223333:stateMachine:existing-state-machine');

  // WHEN
  topicRule.addAction(
    new actions.StepFunctionsStateMachineAction(stateMachine),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ StepFunctions: { StateMachineName: 'existing-state-machine' } }),
      ],
    },
  });
});

test('can set executionNamePrefix', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const stateMachine = new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Wait(stack, 'Hello', { time: sfn.WaitTime.duration(cdk.Duration.seconds(10)) })),
  });

  // WHEN
  topicRule.addAction(
    new actions.StepFunctionsStateMachineAction(stateMachine, {
      executionNamePrefix: 'my-prefix',
    }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ StepFunctions: { ExecutionNamePrefix: 'my-prefix' } }),
      ],
    },
  });
});

test('can set role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');
  const stateMachine = new sfn.StateMachine(stack, 'SM', {
    definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Wait(stack, 'Hello', { time: sfn.WaitTime.duration(cdk.Duration.seconds(10)) })),
  });

  // WHEN
  topicRule.addAction(
    new actions.StepFunctionsStateMachineAction(stateMachine, { role }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ StepFunctions: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});
