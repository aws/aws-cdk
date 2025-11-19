import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-image-recipe-marketplace-base-image');

new imagebuilder.ImageRecipe(stack, 'ImageRecipe', {
  baseImage: imagebuilder.BaseImage.fromMarketplaceProductId('abcfcbaf-134e-4639-a7b4-fd285b9fcf0a'),
});

new integ.IntegTest(app, 'ImageRecipeTest', {
  testCases: [stack],
});
