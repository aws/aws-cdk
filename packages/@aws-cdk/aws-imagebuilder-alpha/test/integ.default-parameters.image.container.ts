import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-container-default-parameters');

const repository = new ecr.Repository(stack, 'Repository', {
  emptyOnDelete: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromEcrPublic('amazonlinux', 'amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
  osVersion: imagebuilder.OSVersion.AMAZON_LINUX_2023,
  components: [
    {
      component: imagebuilder.AwsManagedComponent.helloWorld(stack, 'HelloWorld', {
        platform: imagebuilder.Platform.LINUX,
      }),
    },
  ],
});

new imagebuilder.Image(stack, 'Image-Container', { recipe: containerRecipe });

new integ.IntegTest(app, 'ImageTest-Container-DefaultParameters', {
  testCases: [stack],
});
