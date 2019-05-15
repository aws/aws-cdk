import '@aws-cdk/assert/jest';
import events = require('@aws-cdk/aws-events');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

test('State machine can be used as Event Rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const rule = new events.EventRule(stack, 'Rule', {
    scheduleExpression: 'rate(1 minute)'
  });
  const stateMachine = new sfn.StateMachine(stack, 'SM', {
    definition: new sfn.Wait(stack, 'Hello', { duration: sfn.WaitDuration.seconds(10) })
  });

  // WHEN
  rule.addTarget(new targets.SfnStateMachine(stateMachine, {
    input: events.EventTargetInput.fromObject({ SomeParam: 'SomeValue' }),
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        InputTransformer: {
          InputTemplate: "{\"SomeParam\":\"SomeValue\"}"
        },
      }
    ]
  });
});
