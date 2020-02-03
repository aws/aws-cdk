import '@aws-cdk/assert/jest';
import * as events from '@aws-cdk/aws-events';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as targets from '../../lib';

test('State machine can be used as Event Rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });
  const stateMachine = new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Wait(stack, 'Hello', { time: sfn.WaitTime.duration(cdk.Duration.seconds(10)) })
  });

  // WHEN
  rule.addTarget(new targets.SfnStateMachine(stateMachine, {
    input: events.RuleTargetInput.fromObject({ SomeParam: 'SomeValue' }),
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Input: "{\"SomeParam\":\"SomeValue\"}"
      }
    ]
  });
});
