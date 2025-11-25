import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { CfnImagePipeline } from 'aws-cdk-lib/aws-imagebuilder';
import { Construct } from 'constructs';
import { IRecipeBase } from '../recipe-base';
import { WorkflowConfiguration, WorkflowOnFailure } from '../workflow';

/**
 * Generates the image tests configuration property into the `ImageTestsConfiguration` type in the CloudFormation L1
 * definition.
 *
 * @param imageTestsEnabled Props input for whether image tests are enabled
 */
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

/**
 * Generates the image scanning configuration property into the `ImageScanningConfiguration` type in the CloudFormation
 * L1 definition.
 *
 * @param scope The construct scope
 * @param imageScanningEnabled Props input for whether image scanning is enabled
 * @param imageScanningEcrRepository Props input for the image scanning ECR repository
 * @param imageScanningEcrTags Props input for the image scanning ECR tags
 * @param recipe Props input for the image or container recipe
 */
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
):
  | { ecrConfiguration?: { containerTags?: string[]; repositoryName?: string }; imageScanningEnabled?: boolean }
  | undefined => {
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

  const imageScanningConfiguration = {
    ...(imageScanningEnabled !== undefined && { imageScanningEnabled: imageScanningEnabled }),
    ...(Object.keys(ecrConfiguration).length && { ecrConfiguration }),
  };

  return Object.keys(imageScanningConfiguration).length ? imageScanningConfiguration : undefined;
};

/**
 * Generates the workflows property into the `WorkflowConfiguration` type in the CloudFormation L1
 * definition.
 *
 * @param workflows Props input for the workflows
 */
export const buildWorkflows = ({
  workflows,
}: {
  workflows?: WorkflowConfiguration[];
}):
  | {
    workflowArn: string;
    onFailure?: WorkflowOnFailure;
    parallelGroup?: string;
    parameters?: {
      name: string;
      value: string[];
    }[];
  }[]
  | undefined => {
  const cfnWorkflows = workflows?.map((workflow) => {
    const parameters = Object.entries(workflow.parameters ?? {}).map(([name, value]) => ({
      name,
      value: value.value,
    }));
    return {
      workflowArn: workflow.workflow.workflowArn,
      onFailure: workflow.onFailure,
      parallelGroup: workflow.parallelGroup,
      ...(parameters.length && { parameters }),
    };
  });

  return cfnWorkflows?.length ? cfnWorkflows : undefined;
};
