import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-pipeline-ami-all-parameters');

const executionRole = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
});
const imageLogGroup = new logs.LogGroup(stack, 'ImageLogGroup', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const imagePipelineLogGroup = new logs.LogGroup(stack, 'ImagePipelineLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
imageLogGroup.grantWrite(executionRole);
imagePipelineLogGroup.grantWrite(executionRole);

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
});

const amiDistributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'AMIDistributionConfiguration');
amiDistributionConfiguration.addAmiDistributions({ amiName: 'imagebuidler-{{ imagebuilder:buildDate }}' });

const imagePipeline = new imagebuilder.ImagePipeline(stack, 'ImagePipeline-AMI', {
  imagePipelineName: 'test-image-pipeline',
  description: 'this is an image pipeline description.',
  recipe: imageRecipe,
  infrastructureConfiguration,
  distributionConfiguration: amiDistributionConfiguration,
  status: imagebuilder.ImagePipelineStatus.ENABLED,
  executionRole,
  schedule: {
    expression: events.Schedule.expression('cron(0 7 ? * mon *)'),
    startCondition: imagebuilder.ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
    autoDisableFailureCount: 5,
  },
  workflows: [{ workflow: imagebuilder.AmazonManagedWorkflow.buildImage(stack, 'BuildImage') }],
  imageLogGroup,
  imagePipelineLogGroup,
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: true,
  imageScanningEnabled: true,
});

imagePipeline.grantDefaultExecutionRolePermissions(executionRole);
imagePipeline.onEvent('ImageBuildSuccessTriggerRule');
imagePipeline.onCVEDetected('ImageBuildCVEDetectedTriggerRule');

imagePipeline.start({ onUpdate: true, tags: { key1: 'value1', key2: 'value2' } });

new integ.IntegTest(app, 'ImagePipelineTest-AMI-AllParameters', {
  testCases: [stack],
});
