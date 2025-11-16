import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-component-asset');

new imagebuilder.Component(stack, 'S3AssetComponent', {
  componentName: 'aws-cdk-imagebuilder-component-all-parameters-s3-asset-component',
  componentVersion: '1.0.0',
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromAsset(
    stack,
    'ComponentData',
    path.join(__dirname, 'assets', 'component-data.yaml'),
  ),
});

new integ.IntegTest(app, 'ComponentTest', {
  testCases: [stack],
});
