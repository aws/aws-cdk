import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-workflow-s3-data');

const asset = new s3assets.Asset(stack, 'asset', {
  path: path.join(__dirname, 'assets', 'workflow-data.yaml'),
});

new imagebuilder.Workflow(stack, 'S3AssetWorkflow', {
  workflowName: 'aws-cdk-imagebuilder-workflow-s3',
  workflowVersion: '1.0.0',
  workflowType: imagebuilder.WorkflowType.BUILD,
  data: imagebuilder.WorkflowData.fromS3(asset.bucket, asset.s3ObjectKey),
});

new integ.IntegTest(app, 'WorkflowTest-S3', {
  testCases: [stack],
});
