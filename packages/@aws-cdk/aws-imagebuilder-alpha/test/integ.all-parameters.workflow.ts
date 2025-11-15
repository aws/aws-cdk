import * as path from 'path';
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

new imagebuilder.Workflow(stack, 'S3AssetWorkflow', {
  workflowName: 'aws-cdk-imagebuilder-workflow-all-parameters-s3-asset-workflow',
  workflowVersion: '1.0.0',
  workflowType: imagebuilder.WorkflowType.TEST,
  description: 'This is a test workflow',
  changeDescription: 'This is a change description',
  kmsKey: key,
  tags: {
    Environment: 'Test',
    Application: 'ImageBuilder',
  },
  data: imagebuilder.WorkflowData.fromAsset(
    stack,
    'WorkflowData',
    path.join(__dirname, 'assets', 'workflow-data.yaml'),
  ),
});

new integ.IntegTest(app, 'WorkflowTest', {
  testCases: [stack],
});
