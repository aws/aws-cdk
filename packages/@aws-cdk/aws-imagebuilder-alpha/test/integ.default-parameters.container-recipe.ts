import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-container-recipe-default-parameters');

const repository = new ecr.Repository(stack, 'Repository', { removalPolicy: cdk.RemovalPolicy.DESTROY });

const containerRecipe = new imagebuilder.ContainerRecipe(stack, 'ContainerRecipe', {
  baseImage: imagebuilder.BaseContainerImage.fromDockerHub('amazonlinux', 'latest'),
  targetRepository: imagebuilder.Repository.fromEcr(repository),
});

new cdk.CfnOutput(stack, 'ContainerRecipeVersion', { value: containerRecipe.containerRecipeVersion });

new integ.IntegTest(app, 'ContainerRecipeTest-DefaultParameters', {
  testCases: [stack],
});
