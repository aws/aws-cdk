import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-recipe-marketplace-base-image');

const imageRecipe = new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromMarketplaceProductId('abcfcbaf-134e-4639-a7b4-fd285b9fcf0a'),
});

new cdk.CfnOutput(stack, 'ImageRecipeVersion', { value: imageRecipe.imageRecipeVersion });
new cdk.CfnOutput(stack, 'ImageRecipeArn', { value: imageRecipe.imageRecipeArn });

new integ.IntegTest(app, 'ImageRecipeTest-MarketplaceBaseImage', {
  testCases: [stack],
});
