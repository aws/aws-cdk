import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-pipeline-ami-required-parameters');

const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
});

new imagebuilder.ImagePipeline(stack, 'ImagePipeline-AMI', { recipe: imageRecipe });

new integ.IntegTest(app, 'ImagePipelineTest-AMI-DefaultParameters', {
  testCases: [stack],
});
