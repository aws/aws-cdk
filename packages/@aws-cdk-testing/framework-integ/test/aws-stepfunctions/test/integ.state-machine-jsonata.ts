import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-state-machine-jsonata-integ');

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(
    sfn.Pass.jsonPath(stack, 'JsonPathPass').next(
      sfn.Pass.jsonata(stack, 'JsonataPass', {
        outputs: {
          result: '{% $states.input.init + 1 %}',
        },
      }),
    ),
  ),
});

const testCase = new IntegTest(app, 'StateMachineJsonata', { testCases: [stack] });
const result = executionSync(stateMachine, {
  init: 1,
});

// assert the results
result.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: JSON.stringify({
    result: 2,
  }),
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(2),
});

/**
 * Syntax sugar for `StartExecution` and `DescribeExecution`.
 * @param executeStateMachine execetion state machine
 * @param input input value before JSON.stringify()
 * @returns describe result
 */
function executionSync(executeStateMachine: sfn.IStateMachine, input: any) {
  // Start an execution
  const start = testCase.assertions.awsApiCall('@aws-sdk/client-sfn', 'StartExecution', {
    stateMachineArn: executeStateMachine.stateMachineArn,
    input: JSON.stringify(input),
  });

  // describe the results of the execution
  const describe = testCase.assertions.awsApiCall('@aws-sdk/client-sfn', 'DescribeExecution', {
    executionArn: start.getAttString('executionArn'),
  });

  start.next(describe);
  return describe;
}
