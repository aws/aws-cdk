import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IStateMachine } from 'aws-cdk-lib/aws-stepfunctions';

/**
 * Syntax sugar for `StartExecution` and `DescribeExecution`.
 * @param stateMachine execetion state machine
 * @param input input value before JSON.stringify()
 * @returns describe result
 */
export function executionSync(test: IntegTest, stateMachine: IStateMachine, input: any) {
  // Start an execution
  const start = test.assertions.awsApiCall('@aws-sdk/client-sfn', 'StartExecution', {
    stateMachineArn: stateMachine.stateMachineArn,
    input: JSON.stringify(input),
  });

  // describe the results of the execution
  const describe = test.assertions.awsApiCall('@aws-sdk/client-sfn', 'DescribeExecution', {
    executionArn: start.getAttString('executionArn'),
  });

  start.next(describe);
  return describe;
}
