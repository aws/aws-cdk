import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-container-recipe-s3');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const asset = new s3assets.Asset(stack, 'asset', {
  path: path.join(__dirname, 'assets', 'Dockerfile'),
});

new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  dockerfile: imagebuilder.DockerfileData.fromS3(asset.bucket, asset.s3ObjectKey),
});

new integ.IntegTest(app, 'ContainerRecipeTest-S3', {
  testCases: [stack],
});
