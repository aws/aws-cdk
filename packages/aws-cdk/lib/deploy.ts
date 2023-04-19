import * as cxapi from '@aws-cdk/cx-api';
import { WorkGraph, WorkNode, WorkType } from './util/work-graph';

type Options = {
  concurrency: number;
  deployStack: (stack: cxapi.CloudFormationStackArtifact) => Promise<void>;
  buildAsset: (assetNode: WorkNode) => Promise<void>;
  publishAsset: (assetNode: WorkNode) => Promise<void>;
};

export const deployArtifacts = async (artifacts: cxapi.CloudArtifact[], {
  concurrency,
  deployStack,
  buildAsset,
  publishAsset,
}: Options): Promise<void> => {
  const graph = WorkGraph.fromCloudArtifacts(artifacts);

  await forAllArtifacts(concurrency, async (x: WorkNode) => {
    // Execute this function with as much parallelism as possible
    switch (x.type) {
      case WorkType.STACK_DEPLOY:
        await deployStack(x.artifact as cxapi.CloudFormationStackArtifact).catch((err) => {
          // By recording the failure immediately as the queued task exits, we prevent the next
          // queued task from starting (its 'hasAnyStackFailed' will return 'true').
          graph.failed(x);
          throw err;
        });
        break;
      case WorkType.ASSET_BUILD:
        await buildAsset(x).catch((err) => {
          graph.failed(x);
          throw err;
        });
        break;
      case WorkType.ASSET_PUBLISH:
        await publishAsset(x).catch((err) => {
          graph.failed(x);
          throw err;
        });
        break;
    }
  });

  function forAllArtifacts(n: number, fn: (x: WorkNode) => Promise<void>): Promise<void> {
    return new Promise((ok) => {
      let active = 0;

      start();

      function start() {
        while (graph.peek() && active < n) {
          startOne(graph.next()!);
        }

        if (!graph.peek() && active === 0) {
          ok();
        }
      }

      function startOne(x: WorkNode) {
        active++;
        void fn(x).then(() => {
          active--;
          graph.deployed(x);
          start();
        });
      }
    });
  }

  // const isStackUnblocked = (stack: cxapi.CloudFormationStackArtifact) =>
  //   stack.dependencies
  //     .map(({ id }) => id)
  //     .filter((id) => !id.endsWith('.assets'))
  //     .every((id) => !deploymentStates[id] || deploymentStates[id] === 'completed'); // Dependency not selected or already finished

  // const hasAnyStackFailed = (states: Record<string, DeploymentState>) => Object.values(states).includes('failed');

  // const deploymentErrors: Error[] = [];

  // const enqueueStackDeploys = () => {
  //   stacks.forEach(async (stack) => {
  //     if (deploymentStates[stack.id] === 'pending' && isStackUnblocked(stack)) {
  //       deploymentStates[stack.id] = 'queued';

  //       await queue.add(async () => {
  //         // Do not start new deployments if any has already failed
  //         if (hasAnyStackFailed(deploymentStates)) {
  //           deploymentStates[stack.id] = 'skipped';
  //           return;
  //         }

  //         deploymentStates[stack.id] = 'deploying';

  //         await deployStack(stack).catch((err) => {
  //           // By recording the failure immediately as the queued task exits, we prevent the next
  //           // queued task from starting (its 'hasAnyStackFailed' will return 'true').
  //           deploymentStates[stack.id] = 'failed';
  //           throw err;
  //         });

  //         deploymentStates[stack.id] = 'completed';
  //         enqueueStackDeploys();
  //       }).catch((err) => {
  //         deploymentStates[stack.id] = 'failed';
  //         deploymentErrors.push(err);
  //       });
  //     }
  //   });
  // };

  // enqueueStackDeploys();

  // await queue.onIdle();

  // if (deploymentErrors.length) {
  //   throw Error(`Stack Deployments Failed: ${deploymentErrors}`);
  // }

  // // We shouldn't be able to get here, but check it anyway
  // const neverUnblocked = Object.entries(deploymentStates).filter(([_, s]) => s === 'pending').map(([n, _]) => n);
  // if (neverUnblocked.length > 0) {
  //   throw new Error(`The following stacks never became unblocked: ${neverUnblocked.join(', ')}. Please report this at https://github.com/aws/aws-cdk/issues`);
  // }
};
