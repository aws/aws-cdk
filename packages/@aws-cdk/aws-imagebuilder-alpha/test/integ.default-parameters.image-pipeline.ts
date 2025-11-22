import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-pipeline-required-parameters');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
});
const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  osVersion: imagebuilder.OSVersion.AMAZON_LINUX_2023,
});

new imagebuilder.ImagePipeline(stack, 'ImagePipeline-AMI', { recipe: imageRecipe });
new imagebuilder.ImagePipeline(stack, 'ImagePipeline-Container', { recipe: containerRecipe });

new integ.IntegTest(app, 'ImagePipelineTest-DefaultParameters', {
  testCases: [stack],
});
