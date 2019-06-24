import '@aws-cdk/assert/jest';
import events = require('@aws-cdk/aws-events');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import targets = require('../../lib');

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
