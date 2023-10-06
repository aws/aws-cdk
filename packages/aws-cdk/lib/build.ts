import * as cxapi from '@aws-cdk/cx-api';

type Options = {
  buildStackAssets: (stack: cxapi.CloudFormationStackArtifact) => Promise<void>;
};

export async function buildAllStackAssets(stacks: cxapi.CloudFormationStackArtifact[], options: Options): Promise<void> {
  const { buildStackAssets } = options;

  const buildingErrors: unknown[] = [];

  for (const stack of stacks) {
    try {
      await buildStackAssets(stack);
    } catch (err) {
      buildingErrors.push(err);
    }
  }

  if (buildingErrors.length) {
    throw Error(`Building Assets Failed: ${buildingErrors.join(', ')}`);
  }
}
