import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-lifecycle-policy-container-default-parameters');

new imagebuilder.LifecyclePolicy(stack, 'LifecyclePolicy-Container', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.CONTAINER_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      countFilter: { count: 5 },
    },
  ],
  resourceSelection: {
    recipes: [
      imagebuilder.ContainerRecipe.fromContainerRecipeAttributes(stack, 'ContainerRecipe', {
        containerRecipeName: 'test-container-lifecycle-policy-recipe',
        containerRecipeVersion: '1.0.0',
      }),
    ],
  },
});

new integ.IntegTest(app, 'LifecyclePolicyTest-Container-DefaultParameters', {
  testCases: [stack],
});
