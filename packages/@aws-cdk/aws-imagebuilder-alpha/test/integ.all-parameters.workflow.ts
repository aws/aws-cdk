import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-workflow-all-parameters');

const key = new kms.Key(stack, 'Workflow-EncryptionKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  pendingWindow: cdk.Duration.days(7),
});

new imagebuilder.Workflow(stack, 'InlineWorkflow', {
  workflowName: 'aws-cdk-imagebuilder-workflow-all-parameters-inline',
  workflowVersion: '1.0.0',
  workflowType: imagebuilder.WorkflowType.BUILD,
  description: 'This is a test workflow',
  changeDescription: 'This is a change description',
  kmsKey: key,
  tags: {
    Environment: 'Test',
    Application: 'ImageBuilder',
  },
  data: imagebuilder.WorkflowData.fromJsonObject({
    name: 'build-image',
    description: 'Workflow to build an AMI',
    schemaVersion: imagebuilder.WorkflowSchemaVersion.V1_0,
    parameters: [{ name: 'snsTopicArn', type: imagebuilder.WorkflowParameterType.STRING }],
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
        name: 'WaitForApproval',
        action: imagebuilder.WorkflowAction.WAIT_FOR_ACTION,
        onFailure: imagebuilder.WorkflowOnFailure.ABORT,
        inputs: {
          'snsTopicArn.$': '$.parameters.snsTopicArn',
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

new integ.IntegTest(app, 'WorkflowTest-AllParameters', {
  testCases: [stack],
});
