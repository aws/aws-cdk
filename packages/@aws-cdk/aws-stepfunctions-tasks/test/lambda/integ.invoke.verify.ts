import { CloudFormation, StepFunctions } from 'aws-sdk';
import { waitForExecution } from '../utils';
import { STACK_NAME } from './integ.invoke';

const cloudFormation = new CloudFormation();
const stepFunctions = new StepFunctions();

test('invoke', async () => {
  const describeStacks = await cloudFormation.describeStacks({
    StackName: STACK_NAME,
  }).promise();

  const stateMachineArn = describeStacks.Stacks![0].Outputs![0].OutputValue!;

  const startExecution = await stepFunctions.startExecution({ stateMachineArn }).promise();

  const execution = await waitForExecution(startExecution.executionArn);

  expect(execution.status).toBe('SUCCEEDED');
  expect(execution.output).toBe('{\"status\":\"SUCCEEDED\"}');
});
