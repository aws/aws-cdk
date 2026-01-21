import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-component-s3-data');

const asset = new s3assets.Asset(stack, 'asset', {
  path: path.join(__dirname, 'assets', 'component-data.yaml'),
});

const component = new imagebuilder.Component(stack, 'S3AssetComponent', {
  componentName: 'aws-cdk-imagebuilder-component-s3',
  componentVersion: '1.0.0',
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromS3(asset.bucket, asset.s3ObjectKey),
});

new cdk.CfnOutput(stack, 'ComponentVersion', { value: component.componentVersion });

new integ.IntegTest(app, 'ComponentTest-S3', {
  testCases: [stack],
});
