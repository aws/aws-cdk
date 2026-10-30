// eslint-disable-next-line import/no-extraneous-dependencies
import { CodePipeline } from '@aws-sdk/client-codepipeline';

const client = new CodePipeline();
const TIMEOUT_IN_MINUTES = 5;

/**
 * Sleeps for given amount of seconds using builtin setTimeout function.
 * @param seconds Number of seconds to sleep.
 * @returns A Promise which sleeps when resolved.
 */
const sleep = (seconds: number): Promise<void> => {
  return new Promise<void>(resolve => setTimeout(resolve, seconds * 1000));
};

interface HandlerEventProp {
  PipelineName: string;
  StageName: string;
  ActionName: string;
  [key: string]: any; // In case other properties are given.
}

interface ActionStateInterface {
  actionName: string;
  [key: string]: any;
}

export async function handler(event: HandlerEventProp, _context: any): Promise<void> {
  const {
    PipelineName: pipelineName,
    StageName: stageName,
    ActionName: actionName,
  } = event;

  function parseState(response: any): string | undefined {
    const stages = response.stageStates;
    const validStages = stages?.filter((s: any) => s.stageName === stageName);

    const manualApproval =
      validStages.length &&
      validStages[0].actionStates.filter((state: ActionStateInterface) => state.actionName === actionName);

    const latest =
      manualApproval &&
      manualApproval.length &&
      manualApproval[0].latestExecution;

    return latest?.token;
  }
  // Calculate the absolute timestamp when the operation should time out.
  const deadline = Date.now() + TIMEOUT_IN_MINUTES * 60000;
  while (Date.now() < deadline) {
    const response = await client.getPipelineState({ name: pipelineName });
    const token: string | undefined = parseState(response);
    if (token) {
      await client.putApprovalResult({
        pipelineName,
        actionName,
        stageName,
        result: {
          summary: 'No security changes detected. Automatically approved by Lambda.',
          status: 'Approved',
        },
        token,
      });
      return;
    }
    await sleep(5);
  }
}
