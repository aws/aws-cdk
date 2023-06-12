import * as cxapi from '@aws-cdk/cx-api';

type Options = {
  buildStackAssets: (stack: cxapi.CloudFormationStackArtifact) => Promise<void>;
};

export async function buildAllStackAssets(stacks: cxapi.CloudFormationStackArtifact[], options: Options): Promise<void> {
  const { buildStackAssets } = options;

  const buildingErrors: unknown[] = [];

  const buildStackAssetsResults = await Promise.allSettled(
    stacks.map((stack) => buildAllStackAssets(stack))
  );

  buildStackAssetsResults.forEach((result) => {
    if (result.status === "rejected") {
      buildingErrors.push(result.reason);
    }
  });

  if (buildingErrors.length) {
    throw Error(`Building Assets Failed: ${buildingErrors.join(', ')}`);
  }
}
