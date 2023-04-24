import * as cxapi from '@aws-cdk/cx-api';
import { WorkGraph, WorkNode, WorkType } from './util/work-graph';

interface CallbackActions {
  deployStack: (assetNode: WorkNode) => Promise<void>;
  buildAsset: (assetNode: WorkNode) => Promise<void>;
  publishAsset: (assetNode: WorkNode) => Promise<void>;
}

type Options = {
  concurrency: number;
  callbacks: CallbackActions;
};

export const deployArtifacts = async (artifacts: cxapi.CloudArtifact[], {
  concurrency,
  callbacks,
}: Options): Promise<void> => {
  const graph = WorkGraph.fromCloudArtifacts(artifacts);
  console.log(graph.toString());

  await forAllArtifacts(concurrency, async (x: WorkNode) => {
    console.log('fn called');
    // Execute this function with as much parallelism as possible
    switch (x.type) {
      case WorkType.STACK_DEPLOY:
        await callbacks.deployStack(x);
        break;
      case WorkType.ASSET_BUILD:
        await callbacks.buildAsset(x);
        break;
      case WorkType.ASSET_PUBLISH:
        await callbacks.publishAsset(x);
        break;
    }
  });

  function forAllArtifacts(n: number, fn: (x: WorkNode) => Promise<void>): Promise<void> {
    console.log('forallartiacts');
    return new Promise((ok, fail) => {
      let active = 0;

      start();

      function start() {
        console.log('start');
        while (graph.hasNext() && active < n) {
          console.log('startingone');
          startOne(graph.next()!);
        }

        if (graph.done() && active === 0) {
          ok();
        }

        // wait for other active deploys to finish before failing
        if (graph.hasFailed() && active === 0) {
          fail(graph.error);
        }
      }

      function startOne(x: WorkNode) {
        console.log('startOne');
        active++;
        void fn(x).then(() => {
          console.log('fn finised');
          active--;
          graph.deployed(x);
          start();
        }).catch((err) => {
          active--;
          // By recording the failure immediately as the queued task exits, we prevent the next
          // queued task from starting.
          graph.failed(x, err);
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
