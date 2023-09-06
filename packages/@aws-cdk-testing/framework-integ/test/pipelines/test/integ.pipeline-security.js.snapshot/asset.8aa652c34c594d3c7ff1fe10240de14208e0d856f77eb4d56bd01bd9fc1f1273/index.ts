// eslint-disable-next-line import/no-extraneous-dependencies
import { CodePipeline } from '@aws-sdk/client-codepipeline';

const client = new CodePipeline();
const TIMEOUT_IN_MINUTES = 5;

const sleep = (seconds: number) => {
  return new Promise<void>(resolve => setTimeout(resolve, seconds * 1000));
};

export async function handler(event: any, _context: any) {
  const {
    PipelineName: pipelineName,
    StageName: stageName,
    ActionName: actionName,
  } = event;

  function parseState(response: any): string | undefined {
    const stages = response.stageStates;
    const validStages = stages?.filter((s: any) => s.stageName === stageName);
    const manualApproval = validStages.length &&
      validStages[0].actionStates.filter((state: any) => state.actionName === actionName);
    const latest = manualApproval && manualApproval.length &&
      manualApproval[0].latestExecution;

    return latest ? latest.token : undefined;
  }

  const deadline = Date.now() + TIMEOUT_IN_MINUTES * 60000;
  while (Date.now() < deadline) {
    const response = await client.getPipelineState({ name: pipelineName });
    const token = parseState(response);
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
