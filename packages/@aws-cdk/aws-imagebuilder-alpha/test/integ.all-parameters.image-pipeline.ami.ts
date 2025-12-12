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

const infrastructureConfiguration = new imagebuilder.InfrastructureConfiguration(stack, 'InfrastructureConfiguration');
const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
});

const amiDistributionConfiguration = new imagebuilder.DistributionConfiguration(stack, 'AMIDistributionConfiguration');
amiDistributionConfiguration.addAmiDistributions({ amiName: 'imagebuidler-{{ imagebuilder:buildDate }}' });

const customBuildWorkflow = new imagebuilder.Workflow(stack, 'CustomBuildWorkflow', {
  workflowType: imagebuilder.WorkflowType.BUILD,
  data: imagebuilder.WorkflowData.fromJsonObject({
    name: 'build-image',
    description: 'Workflow to build an AMI',
    schemaVersion: imagebuilder.WorkflowSchemaVersion.V1_0,
    steps: [
      {
        name: 'LaunchBuildInstance',
        action: imagebuilder.WorkflowAction.LAUNCH_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          waitFor: 'ssmAgent',
        },
      },
      {
        name: 'ApplyBuildComponents',
        action: imagebuilder.WorkflowAction.EXECUTE_COMPONENTS,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
      {
        name: 'InventoryCollection',
        action: imagebuilder.WorkflowAction.COLLECT_IMAGE_METADATA,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        if: {
          and: [
            {
              stringEquals: 'AMI',
              value: '$.imagebuilder.imageType',
            },
            {
              booleanEquals: true,
              value: '$.imagebuilder.collectImageMetadata',
            },
          ],
        },
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
      {
        name: 'RunSanitizeScript',
        action: imagebuilder.WorkflowAction.SANITIZE_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        if: {
          and: [
            {
              stringEquals: 'AMI',
              value: '$.imagebuilder.imageType',
            },
            {
              not: {
                stringEquals: 'Windows',
                value: '$.imagebuilder.platform',
              },
            },
          ],
        },
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
      {
        name: 'RunSysPrepScript',
        action: imagebuilder.WorkflowAction.RUN_SYS_PREP,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        if: {
          and: [
            {
              stringEquals: 'AMI',
              value: '$.imagebuilder.imageType',
            },
            {
              stringEquals: 'Windows',
              value: '$.imagebuilder.platform',
            },
          ],
        },
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
      {
        name: 'CreateOutputAMI',
        action: imagebuilder.WorkflowAction.CREATE_IMAGE,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        if: {
          stringEquals: 'AMI',
          value: '$.imagebuilder.imageType',
        },
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
      {
        name: 'TerminateBuildInstance',
        action: imagebuilder.WorkflowAction.TERMINATE_INSTANCE,
        onFailure: imagebuilder.WorkflowOnFailure.CONTINUE,
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
    ],
    outputs: [
      {
        name: 'ImageId',
        value: '$.stepOutputs.CreateOutputAMI.imageId',
      },
    ],
  }),
});

const imagePipeline = new imagebuilder.ImagePipeline(stack, 'ImagePipeline-AMI', {
  imagePipelineName: 'test-image-pipeline',
  description: 'this is an image pipeline description.',
  recipe: imageRecipe.imageRecipeLatestMajorVersion,
  infrastructureConfiguration,
  distributionConfiguration: amiDistributionConfiguration,
  status: imagebuilder.ImagePipelineStatus.ENABLED,
  executionRole,
  schedule: {
    expression: events.Schedule.expression('cron(0 7 ? * mon *)'),
    startCondition: imagebuilder.ScheduleStartCondition.EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE,
    autoDisableFailureCount: 5,
  },
  workflows: [{ workflow: customBuildWorkflow.workflowLatestVersion }],
  imageLogGroup,
  imagePipelineLogGroup,
  enhancedImageMetadataEnabled: true,
  imageTestsEnabled: true,
  imageScanningEnabled: true,
});

imagePipeline.grantDefaultExecutionRolePermissions(executionRole);
imagePipeline.onEvent('ImageBuildSuccessTriggerRule');
imagePipeline.onCVEDetected('ImageBuildCVEDetectedTriggerRule');

new integ.IntegTest(app, 'ImagePipelineTest-AMI-AllParameters', {
  testCases: [stack],
});
