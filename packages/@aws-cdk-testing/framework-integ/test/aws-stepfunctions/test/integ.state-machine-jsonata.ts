import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { executionSync } from './util';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-state-machine-jsonata-integ');

const jsonPathPass = sfn.Pass.jsonPath(stack, 'JSONPathPass', {
  parameters: {
    count: sfn.JsonPath.mathAdd(
      sfn.JsonPath.numberAt('$.init'),
      1,
    ),
  },
});
const increment = {
  outputs: {
    count: '{% $states.input.count + 1 %}',
  },
};
const jsonataPass = sfn.Pass.jsonata(stack, 'JSONataPass', {
  ...increment,
});
const choice = sfn.Choice.jsonata(stack, 'Choice', {
  ...increment,
});
const wait = sfn.Wait.jsonata(stack, 'Wait', {
  time: sfn.WaitTime.seconds('{% $states.input.count %}'),
  ...increment,
});
const succeed = sfn.Succeed.jsonata(stack, 'Succeed', {
  ...increment,
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(
    // By default, JSONata and JSONPath must work even when mixed in a single state machine.
    jsonPathPass // 1 -> 2
      .next(jsonataPass) // 2 -> 3
      .next(choice
        .when(sfn.Condition.jsonata('{% $states.input.count % 2 = 1 %}'),
          wait // 3 -> 4
            .next(succeed),
          increment, // 4 -> 5
        )
        .otherwise(succeed), // 5 -> 6
      ),
  ),
});

const testCase = new IntegTest(app, 'StateMachineJsonata', { testCases: [stack] });
const result = executionSync(testCase, stateMachine, {
  init: 1,
});

// assert the results
result.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: JSON.stringify({
    count: 6,
  }),
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(2),
});
