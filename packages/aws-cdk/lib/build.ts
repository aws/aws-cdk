import * as cxapi from '@aws-cdk/cx-api';
import PQueue from 'p-queue';

type Options = {
  concurrency: number;
  buildStackAssets: (stack: cxapi.CloudFormationStackArtifact) => Promise<void>;
};

export async function buildAllStackAssets(stacks: cxapi.CloudFormationStackArtifact[], options: Options): Promise<void> {
  const { concurrency, buildStackAssets } = options;

  const queue = new PQueue({ concurrency });
  const buildingErrors: Error[] = [];

  for (const stack of stacks) {
    queue.add(async () => {
      await buildStackAssets(stack);
    }).catch((err) => {
      buildingErrors.push(err);
    });
  }

  await queue.onIdle();

  if (buildingErrors.length) {
    throw Error(`Building Assets Failed: ${buildingErrors.join(', ')}`);
  }
}