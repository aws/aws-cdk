import * as cxapi from '@aws-cdk/cx-api';
import PQueue from 'p-queue';

type Options = {
  concurrency: number;
  deployStack: (stack: cxapi.CloudFormationStackArtifact) => Promise<void>;
};

type DeploymentState = 'pending' | 'queued' | 'deploying' | 'completed' | 'failed' | 'skipped';

export const deployStacks = async (stacks: cxapi.CloudFormationStackArtifact[], { concurrency, deployStack }: Options): Promise<void> => {
  const queue = new PQueue({ concurrency });
  const deploymentStates = stacks.reduce((acc, stack) => ({ ...acc, [stack.id]: 'pending' as const }), {} as Record<string, DeploymentState>);

  const isStackUnblocked = (stack: cxapi.CloudFormationStackArtifact) =>
    stack.dependencies
      .map(({ id }) => id)
      .filter((id) => !id.endsWith('.assets'))
      .every((id) => deploymentStates[id] === 'completed');

  const hasAnyStackFailed = (states: Record<string, DeploymentState>) => Object.values(states).includes('failed');

  const deploymentErrors: Error[] = [];

  const enqueueStackDeploys = () => {
    stacks.forEach(async (stack) => {
      if (deploymentStates[stack.id] === 'pending' && isStackUnblocked(stack)) {
        deploymentStates[stack.id] = 'queued';

        await queue.add(async () => {
          // Do not start new deployments if any has already failed
          if (hasAnyStackFailed(deploymentStates)) {
            deploymentStates[stack.id] = 'skipped';
            return;
          }

          deploymentStates[stack.id] = 'deploying';

          await deployStack(stack).catch((err) => {
            deploymentStates[stack.id] = 'failed';
            throw err;
          });

          deploymentStates[stack.id] = 'completed';
          enqueueStackDeploys();
        }).catch((err) => {
          deploymentErrors.push(err);
        });
      }
    });
  };

  enqueueStackDeploys();

  await queue.onIdle();

  if (deploymentErrors.length) {
    throw Error(`Stack Deployments Failed: ${deploymentErrors}`);
  }
};