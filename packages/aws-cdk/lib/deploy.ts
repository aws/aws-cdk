/* eslint-disable no-console */
import * as cxapi from '@aws-cdk/cx-api';
import { WorkGraph } from './util/work-graph';
import { AssetBuildNode, AssetPublishNode, StackNode, WorkNode, WorkType } from './util/work-graph-types';

interface CallbackActions {
  deployStack: (stackNode: StackNode) => Promise<void>;
  buildAsset: (assetNode: AssetBuildNode) => Promise<void>;
  publishAsset: (assetNode: AssetPublishNode) => Promise<void>;
}

type Options = {
  concurrency: number;
  callbacks: CallbackActions;
  prebuildAssets?: boolean;
};

export const deployArtifacts = async (artifacts: cxapi.CloudArtifact[], {
  concurrency,
  callbacks,
  prebuildAssets = true,
}: Options): Promise<void> => {
  const graph = WorkGraph.fromCloudArtifacts(artifacts, prebuildAssets);
  console.log(graph.toString());

  await forAllArtifacts(concurrency, async (x: WorkNode) => {
    console.log('fn called');
    // Execute this function with as much parallelism as possible
    switch (x.type) {
      case WorkType.STACK_DEPLOY:
        await callbacks.deployStack(x as StackNode);
        break;
      case WorkType.ASSET_BUILD:
        await callbacks.buildAsset(x as AssetBuildNode);
        break;
      case WorkType.ASSET_PUBLISH:
        await callbacks.publishAsset(x as AssetPublishNode);
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
};
