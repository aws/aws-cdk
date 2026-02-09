import * as cdk from 'aws-cdk-lib';
import type { CfnImage, CfnImagePipeline } from 'aws-cdk-lib/aws-imagebuilder';
import type { Construct } from 'constructs';
import type { ImageProps } from '../image';
import type { ImagePipelineProps } from '../image-pipeline';

/**
 * Generates the image tests configuration property into the `ImageTestsConfiguration` type in the CloudFormation L1
 * definition.
 *
 * @param props Props input for the construct
 */
export const buildImageTestsConfiguration = <
  PropsT extends ImagePipelineProps | ImageProps,
  OutputT extends CfnImagePipeline.ImageTestsConfigurationProperty | CfnImage.ImageTestsConfigurationProperty,
>(
  props: PropsT,
): OutputT | undefined => {
  if (props.imageTestsEnabled === undefined) {
    return undefined;
  }

  return { imageTestsEnabled: props.imageTestsEnabled } as OutputT;
};

/**
 * Generates the image scanning configuration property into the `ImageScanningConfiguration` type in the CloudFormation
 * L1 definition.
 *
 * @param scope The construct scope
 * @param props Props input for the construct
 */
export const buildImageScanningConfiguration = <
  PropsT extends ImagePipelineProps | ImageProps,
  OutputT extends CfnImagePipeline.ImageScanningConfigurationProperty | CfnImage.ImageScanningConfigurationProperty,
>(
  scope: Construct,
  props: PropsT,
): OutputT | undefined => {
  if (!props.recipe._isContainerRecipe() && props.imageScanningEcrRepository !== undefined) {
    throw new cdk.ValidationError('imageScanningEcrRepository is only supported for container recipe builds', scope);
  }

  if (!props.recipe._isContainerRecipe() && props.imageScanningEcrTags !== undefined) {
    throw new cdk.ValidationError('imageScanningEcrTags is only supported for container recipe builds', scope);
  }

  const ecrConfiguration: CfnImagePipeline.EcrConfigurationProperty = {
    ...(props.imageScanningEcrRepository !== undefined && {
      repositoryName: props.imageScanningEcrRepository.repositoryName,
    }),
    ...((props.imageScanningEcrTags ?? []).length && { containerTags: props.imageScanningEcrTags }),
  };

  const imageScanningConfiguration = {
    ...(props.imageScanningEnabled !== undefined && { imageScanningEnabled: props.imageScanningEnabled }),
    ...(Object.keys(ecrConfiguration).length && { ecrConfiguration }),
  };

  return Object.keys(imageScanningConfiguration).length ? (imageScanningConfiguration as OutputT) : undefined;
};

/**
 * Generates the workflows property into the `WorkflowConfiguration` type in the CloudFormation L1
 * definition.
 *
 * @param props Props input for the construct
 */
export const buildWorkflows = <
  PropsT extends ImagePipelineProps | ImageProps,
  OutputT extends CfnImagePipeline.WorkflowConfigurationProperty[] | CfnImage.WorkflowConfigurationProperty[],
>(
  props: PropsT,
): OutputT | undefined => {
  const cfnWorkflows = props.workflows?.map((workflow) => {
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

  return cfnWorkflows?.length ? (cfnWorkflows as OutputT) : undefined;
};
