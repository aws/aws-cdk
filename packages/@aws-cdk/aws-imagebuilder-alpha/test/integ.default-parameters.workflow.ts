import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-workflow-default-parameters');

new imagebuilder.Workflow(stack, 'Workflow', {
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

new integ.IntegTest(app, 'WorkflowTest-DefaultParameters', {
  testCases: [stack],
});
