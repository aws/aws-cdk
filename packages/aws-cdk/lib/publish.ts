import * as cxapi from '@aws-cdk/cx-api';
import PQueue from 'p-queue';

type Options = {
  concurrency: number;
  publishStackAssets: (stack: cxapi.CloudFormationStackArtifact) => Promise<void>;
};

export const publishAllStackAssets = async (stacks: cxapi.CloudFormationStackArtifact[], options: Options): Promise<void> => {
  const { concurrency, publishStackAssets } = options;

  const queue = new PQueue({ concurrency });
  const publishingErrors: Error[] = [];

  for (const stack of stacks) {
    queue.add(async () => {
      await publishStackAssets(stack);
    }).catch((err) => {
      publishingErrors.push(err);
    });
  }

  await queue.onIdle();

  if (publishingErrors.length) {
    throw Error(`Publishing Assets Failed: ${publishingErrors.join(', ')}`);
  }
};