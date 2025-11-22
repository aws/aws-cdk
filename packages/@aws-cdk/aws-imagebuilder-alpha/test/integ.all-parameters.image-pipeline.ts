import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-pipeline-all-parameters');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
});
const imageLogGroup = new logs.LogGroup(stack, 'ImageLogGroup', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const imagePipelineLogGroup = new logs.LogGroup(stack, 'ImagePipelineLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
});
const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  osVersion: imagebuilder.OSVersion.AMAZON_LINUX_2023,
});

const amiDistributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'AMIDistributionConfiguration');
amiDistributionConfiguration.addAmiDistributions({ amiName: 'imagebuidler-{{ imagebuilder:buildDate }}' });

const containerDistributionConfiguration = new imagebuilder.DistributionConfiguration(
  stack,
  'ContainerDistributionConfiguration',
);
containerDistributionConfiguration.addContainerDistributions({
  containerRepository: imagebuilder.Repository.fromEcr(repository),
});

const imagePipeline = new imagebuilder.ImagePipeline(stack, 'ImagePipeline-AMI', {
  imagePipelineName: 'test-image-pipeline',
  description: 'this is an image pipeline description.',
  recipe: imageRecipe,
  infrastructureConfiguration,
  distributionConfiguration: amiDistributionConfiguration,
  enabled: true,
  executionRole,
  schedule: {
    expression: events.Schedule.expression('cron(0 7 ? * mon *)'),
    timezone: cdk.TimeZone.PST8PDT,
    startCondition: imagebuilder.ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
    autoDisableFailureCount: 5,
  },
  workflows: [{ workflow: imagebuilder.AwsManagedWorkflow.buildImage(stack, 'BuildImage') }],
  imageLogGroup,
  imagePipelineLogGroup,
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: false,
  imageScanningEnabled: false,
});

imagePipeline.grantDefaultExecutionRolePermissions(executionRole);

const containerImagePipeline = new imagebuilder.ImagePipeline(stack, 'ImagePipeline-Container', {
  imagePipelineName: 'test-container-image-pipeline',
  recipe: containerRecipe,
  infrastructureConfiguration,
  distributionConfiguration: containerDistributionConfiguration,
  enabled: true,
  executionRole,
  schedule: {
    expression: events.Schedule.rate(cdk.Duration.days(7)),
    timezone: cdk.TimeZone.EST5EDT,
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
  imageTestsEnabled: false,
  imageScanningEnabled: false,
});

imagePipeline.onImageBuildSuccess('ImageBuildSuccessTriggerRule', {
  target: new targets.AwsApi({
    service: 'imagebuilder',
    action: 'StartImagePipelineExecution',
    parameters: { imagePipelineArn: containerImagePipeline.imagePipelineArn },
  }),
});

new integ.IntegTest(app, 'ImagePipelineTest-AllParameters', {
  testCases: [stack],
});
