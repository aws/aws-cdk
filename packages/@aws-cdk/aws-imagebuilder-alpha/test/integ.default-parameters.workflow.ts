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
    schemaVersion: '1.0',
    steps: [
      {
        name: 'LaunchBuildInstance',
        action: 'LaunchInstance',
        onFailure: 'Abort',
        inputs: {
          waitFor: 'ssmAgent',
        },
      },
      {
        name: 'ApplyBuildComponents',
        action: 'ExecuteComponents',
        onFailure: 'Abort',
        inputs: {
          'instanceId.$': '$.stepOutputs.LaunchBuildInstance.instanceId',
        },
      },
      {
        name: 'InventoryCollection',
        action: 'CollectImageMetadata',
        onFailure: 'Abort',
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
        action: 'SanitizeInstance',
        onFailure: 'Abort',
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
        action: 'RunSysPrep',
        onFailure: 'Abort',
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
        action: 'CreateImage',
        onFailure: 'Abort',
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
        action: 'TerminateInstance',
        onFailure: 'Continue',
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

new integ.IntegTest(app, 'WorkflowTest', {
  testCases: [stack],
});
