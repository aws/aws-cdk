import { StepFunctions } from 'aws-sdk';

const stepFunctions = new StepFunctions();

export async function waitForExecution(executionArn: string, delay = 1000, maxAttempts = 30): Promise<AWS.StepFunctions.DescribeExecutionOutput> {
  let attempts = 0;
  return new Promise((res, rej) => {
    const interval = setInterval(async () => {
      try {
        attempts += 1;
        if (attempts > maxAttempts) {
          clearInterval(interval);
          throw new Error(`Timeout while waiting for execution ${executionArn}`);
        }

        const execution = await stepFunctions.describeExecution({
          executionArn,
        }).promise();

        if (execution.status !== 'RUNNING') {
          clearInterval(interval);
          res(execution);
        }
      } catch (err) {
        rej(err);
      }
    }, delay);
  });
}
