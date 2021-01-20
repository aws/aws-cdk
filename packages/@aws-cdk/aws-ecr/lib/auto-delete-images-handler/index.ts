// eslint-disable-next-line import/no-extraneous-dependencies
import { ECR } from 'aws-sdk';

const ecr = new ECR();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return;
    case 'Delete':
      return onDelete(event);
  }
}

/**
 * Recursively delete all images in the repository
 *
 * @param ECR.ListImagesRequest the repositoryName & nextToken if presented
 */
async function emptyRepository(params: ECR.ListImagesRequest) {
  const listedImages = await ecr.listImages(params).promise();
  const imageIds = listedImages?.imageIds ?? [];
  const nextToken = listedImages.nextToken ?? null;
  if (imageIds.length === 0) {
    return;
  }

  await ecr.batchDeleteImage({
    repositoryName: params.repositoryName,
    imageIds,
  }).promise();

  if (nextToken) {
    await emptyRepository({
      ...params,
      nextToken,
    });
  }
}

async function onDelete(deleteEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent) {
  const repositoryName = deleteEvent.ResourceProperties?.RepositoryName;
  if (!repositoryName) {
    throw new Error('No RepositoryName was provided.');
  }
  await emptyRepository({ repositoryName });
}
