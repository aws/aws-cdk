import { CodePipelineClient, StartPipelineExecutionCommand } from '@aws-sdk/client-codepipeline';
const codepipeline = new CodePipelineClient({});

export const handler = async () => {
  const command = new StartPipelineExecutionCommand({
    name: 'IntegCustomEventPipeline',
  });
  await codepipeline.send(command);
};