import cdk = require('@aws-cdk/cdk');
import path = require('path');
import assets = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-docker');

const asset = new assets.DockerImageAsset(stack, 'DockerImage', {
  directory: path.join(__dirname, 'demo-image'),
});

new cdk.CfnOutput(stack, 'ArtifactHash', { value: asset.artifactHash });
new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });

app.run();
