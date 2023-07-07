// eslint-disable-next-line import/no-extraneous-dependencies
import { ECR, ImageIdentifier, ListImagesRequest } from '@aws-sdk/client-ecr';
import { makeHandler } from '../../nodejs-entrypoint';

const AUTO_DELETE_IMAGES_TAG = 'aws-cdk:auto-delete-images';

const ecr = new ECR({});

export const handler = makeHandler(autoDeleteHandler);

export async function autoDeleteHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
      break;
    case 'Update':
      return onUpdate(event);
    case 'Delete':
      return onDelete(event.ResourceProperties?.RepositoryName);
  }
};

async function onUpdate(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const updateEvent = event as AWSLambda.CloudFormationCustomResourceUpdateEvent;
  const oldRepositoryName = updateEvent.OldResourceProperties?.RepositoryName;
  const newRepositoryName = updateEvent.ResourceProperties?.RepositoryName;
  const repositoryNameHasChanged = (newRepositoryName && oldRepositoryName)
    && (newRepositoryName !== oldRepositoryName);

  /* If the name of the repository has changed, CloudFormation will try to delete the repository
     and create a new one with the new name. So we have to delete the images in the
     repository so that this operation does not fail. */
  if (repositoryNameHasChanged) {
    return onDelete(oldRepositoryName);
  }
}

/**
 * Recursively delete all images in the repository
 *
 * @param ListImagesRequest the repositoryName & nextToken if presented
 */
async function emptyRepository(params: ListImagesRequest) {
  const listedImages = await ecr.listImages(params);

  const imageIds: ImageIdentifier[] = [];
  const imageIdsTagged: ImageIdentifier[] = [];
  (listedImages.imageIds ?? []).forEach(imageId => {
    if ('imageTag' in imageId) {
      imageIdsTagged.push(imageId);
    } else {
      imageIds.push(imageId);
    }
  });

  const nextToken = listedImages.nextToken ?? null;
  if (imageIds.length === 0 && imageIdsTagged.length === 0) {
    return;
  }

  if (imageIdsTagged.length !== 0) {
    await ecr.batchDeleteImage({
      repositoryName: params.repositoryName,
      imageIds: imageIdsTagged,
    });
  }

  if (imageIds.length !== 0) {
    await ecr.batchDeleteImage({
      repositoryName: params.repositoryName,
      imageIds: imageIds,
    });
  }

  if (nextToken) {
    await emptyRepository({
      ...params,
      nextToken,
    });
  }
}

async function onDelete(repositoryName: string) {
  if (!repositoryName) {
    throw new Error('No RepositoryName was provided.');
  }

  const response = await ecr.describeRepositories({ repositoryNames: [repositoryName] });
  const repository = response.repositories?.find(repo => repo.repositoryName === repositoryName);

  if (!await isRepositoryTaggedForDeletion(repository?.repositoryArn!)) {
    process.stdout.write(`Repository does not have '${AUTO_DELETE_IMAGES_TAG}' tag, skipping cleaning.\n`);
    return;
  }
  try {
    await emptyRepository({ repositoryName });
  } catch (e: any) {
    if (e.name !== 'RepositoryNotFoundException') {
      throw e;
    }
    // Repository doesn't exist. Ignoring
  }
}

/**
 * The repository will only be tagged for deletion if it's being deleted in the same
 * deployment as this Custom Resource.
 *
 * If the Custom Resource is ever deleted before the repository, it must be because
 * `autoDeleteImages` has been switched to false, in which case the tag would have
 * been removed before we get to this Delete event.
 */
async function isRepositoryTaggedForDeletion(repositoryArn: string) {
  const response = await ecr.listTagsForResource({ resourceArn: repositoryArn });
  return response.tags?.some(tag => tag.Key === AUTO_DELETE_IMAGES_TAG && tag.Value === 'true');
}
