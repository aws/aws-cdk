import cdk = require('@aws-cdk/core');
import path = require('path');
import assets = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-docker');

const asset = new assets.DockerImageAsset(stack, 'DockerImage', {
  directory: path.join(__dirname, 'demo-image'),
});

new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });

app.synth();
