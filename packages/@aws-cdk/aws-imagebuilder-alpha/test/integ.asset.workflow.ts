import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-workflow-asset');

new imagebuilder.Workflow(stack, 'S3AssetWorkflow', {
  workflowName: 'aws-cdk-imagebuilder-workflow-all-parameters-s3-asset',
  workflowVersion: '1.0.0',
  workflowType: imagebuilder.WorkflowType.TEST,
  description: 'This is a test workflow',
  changeDescription: 'This is a change description',
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
