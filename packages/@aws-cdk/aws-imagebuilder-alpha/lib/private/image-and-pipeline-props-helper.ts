import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { CfnImagePipeline } from 'aws-cdk-lib/aws-imagebuilder';
import { Construct } from 'constructs';
import { IRecipeBase } from '../recipe-base';

export const buildImageTestsConfiguration = ({
  imageTestsEnabled,
}: {
  imageTestsEnabled?: boolean;
}): { imageTestsEnabled: boolean } | undefined => {
  if (imageTestsEnabled === undefined) {
    return undefined;
  }

  return { imageTestsEnabled };
};

export const buildImageScanningConfiguration = (
  scope: Construct,
  {
    imageScanningEnabled,
    imageScanningEcrRepository,
    imageScanningEcrTags,
    recipe,
  }: {
    imageScanningEnabled?: boolean;
    imageScanningEcrRepository?: ecr.IRepository;
    imageScanningEcrTags?: string[];
    recipe: IRecipeBase;
  },
): CfnImagePipeline.ImageScanningConfigurationProperty | undefined => {
  if (!recipe._isContainerRecipe() && imageScanningEcrRepository !== undefined) {
    throw new cdk.ValidationError('imageScanningEcrRepository is only supported for container recipe builds', scope);
  }

  if (!recipe._isContainerRecipe() && imageScanningEcrTags !== undefined) {
    throw new cdk.ValidationError('imageScanningEcrTags is only supported for container recipe builds', scope);
  }

  const ecrConfiguration: CfnImagePipeline.EcrConfigurationProperty = {
    ...(imageScanningEcrRepository !== undefined && {
      repositoryName: imageScanningEcrRepository.repositoryName,
    }),
    ...((imageScanningEcrTags ?? []).length && { containerTags: imageScanningEcrTags }),
  };

  const imageScanningConfiguration: CfnImagePipeline.ImageScanningConfigurationProperty = {
    ...(imageScanningEnabled !== undefined && { imageScanningEnabled: imageScanningEnabled }),
    ...(Object.keys(ecrConfiguration).length && { ecrConfiguration }),
  };

  return Object.keys(imageScanningConfiguration).length ? imageScanningConfiguration : undefined;
};
