import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-pipeline-container-all-parameters');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const scanningRepository = new ecr.Repository(stack, 'ScanningRepository', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
});
const imageLogGroup = new logs.LogGroup(stack, 'ImageLogGroup', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const imagePipelineLogGroup = new logs.LogGroup(stack, 'ImagePipelineLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  osVersion: imagebuilder.OSVersion.AMAZON_LINUX_2023,
});

const containerDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'ContainerDistributionConfiguration',
);
containerDistributionConfiguration.addContainerDistributions({
  containerRepository: imagebuilder.Repository.fromEcr(repository),
});

const containerImagePipeline = new imagebuilder.ImagePipeline(stack, 'ImagePipeline-Container', {
  imagePipelineName: 'test-container-image-pipeline',
  recipe: containerRecipe,
  infrastructureConfiguration,
  distributionConfiguration: containerDistributionConfiguration,
  status: imagebuilder.ImagePipelineStatus.DISABLED,
  executionRole,
  schedule: {
    expression: events.Schedule.rate(cdk.Duration.days(7)),
    startCondition: imagebuilder.ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
    autoDisableFailureCount: 5,
  },
  workflows: [
    { workflow: imagebuilder.AwsManagedWorkflow.buildContainer(stack, 'BuildContainer') },
    { workflow: imagebuilder.AwsManagedWorkflow.testContainer(stack, 'TestContainer') },
    { workflow: imagebuilder.AwsManagedWorkflow.distributeContainer(stack, 'DistributeContainer') },
  ],
  imageLogGroup,
  imagePipelineLogGroup,
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: true,
  imageScanningEnabled: true,
  imageScanningEcrRepository: scanningRepository,
  imageScanningEcrTags: ['latest-scan'],
});
containerImagePipeline.grantDefaultExecutionRolePermissions(executionRole);
containerImagePipeline.onEvent('ImageBuildSuccessTriggerRule');
containerImagePipeline.onImagePipelineAutoDisabled('ImagePipelineAutoDisabledTriggerRule');

new integ.IntegTest(app, 'ImagePipelineTest-Container-AllParameters', {
  testCases: [stack],
});
