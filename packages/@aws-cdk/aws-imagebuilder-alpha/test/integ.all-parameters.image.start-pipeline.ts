import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-start-pipeline-all-parameters');

const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromSsmParameterName(
    '/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64',
  ),
  components: [
    {
      component: imagebuilder.AwsManagedComponent.fromAwsManagedComponentName(
        stack,
        'SimpleBootTest',
        'simple-boot-test-linux',
      ),
    },
  ],
});

const imagePipeline = new imagebuilder.ImagePipeline(stack, 'ImagePipeline', {
  recipe: imageRecipe,
  imageTestsEnabled: false,
});

const image = new imagebuilder.Image(stack, 'Image-StartPipeline', {
  imagePipelineExecutionSettings: { imagePipeline, onUpdate: false },
  tags: { tagKey1: 'tagValue1', tagKey2: 'tagValue2' },
});

new cdk.CfnOutput(stack, 'ImageArn', { value: image.imageArn });
new cdk.CfnOutput(stack, 'ImageName', { value: image.imageName });
new cdk.CfnOutput(stack, 'ImageVersion', { value: image.imageVersion });
new cdk.CfnOutput(stack, 'ImageId', { value: image.imageId });

new integ.IntegTest(app, 'ImageTest-StartPipeline-AllParameters', {
  testCases: [stack],
});
