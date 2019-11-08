import cdk = require('@aws-cdk/core');
import ecr = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');

const repo = new ecr.Repository(stack, 'Repo');
repo.onImageScanCompleted('ImageScanComplete', {
});

new cdk.CfnOutput(stack, 'RepositoryURI', {
  value: repo.repositoryUri
});

app.synth();
