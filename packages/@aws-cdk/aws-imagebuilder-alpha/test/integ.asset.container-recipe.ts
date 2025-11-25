import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-container-recipe-asset');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });

new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  dockerfile: imagebuilder.DockerfileData.fromAsset(
    stack,
    'DockerfileData',
    path.join(__dirname, 'assets', 'Dockerfile'),
  ),
});

new integ.IntegTest(app, 'ContainerRecipeTest-Asset', {
  testCases: [stack],
});
