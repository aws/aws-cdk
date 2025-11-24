import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-lifecycle-policy-ami-all-parameters');

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy')],
});

new imagebuilder.LifecyclePolicy(stack, 'LifecyclePolicy-AMI', {
  lifecyclePolicyName: 'test-ami-lifecycle-policy',
  description: 'This is a test lifecycle policy',
  status: imagebuilder.LifecyclePolicyStatus.DISABLED,
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  executionRole: role,
  details: [
    {
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DELETE,
        includeAmis: true,
        includeSnapshots: true,
      },
      filter: {
        age: cdk.Duration.days(30),
        retainAtLeast: 5,
      },
      amiExclusionRules: {
        isPublic: true,
        lastLaunched: cdk.Duration.days(20),
        regions: ['us-west-2', 'us-east-2'],
        sharedAccounts: ['098765432109'],
        tags: { Environment: 'test' },
      },
      imageExclusionRules: { tags: { Environment: 'test' } },
    },
    {
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DISABLE,
        includeAmis: false,
        includeSnapshots: false,
      },
      filter: {
        age: cdk.Duration.days(20),
        retainAtLeast: 5,
      },
      amiExclusionRules: {
        isPublic: true,
        lastLaunched: cdk.Duration.days(10),
        regions: ['us-west-2', 'us-east-2'],
        sharedAccounts: ['098765432109'],
        tags: { Environment: 'test' },
      },
      imageExclusionRules: { tags: { Environment: 'test' } },
    },
    {
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DEPRECATE,
        includeAmis: false,
        includeSnapshots: false,
      },
      filter: {
        age: cdk.Duration.days(10),
        retainAtLeast: 5,
      },
      amiExclusionRules: {
        isPublic: true,
        lastLaunched: cdk.Duration.days(1),
        regions: ['us-west-2', 'us-east-2'],
        sharedAccounts: ['098765432109'],
        tags: { Environment: 'test' },
      },
      imageExclusionRules: { tags: { Environment: 'test' } },
    },
  ],
  resourceSelection: {
    recipes: [
      imagebuilder.ImageRecipe.fromImageRecipeAttributes(stack, 'ImageRecipe', {
        imageRecipeName: 'test-ami-lifecycle-policy-recipe',
        imageRecipeVersion: '1.0.0',
      }),
    ],
  },
});

new integ.IntegTest(app, 'LifecyclePolicyTest-AMI-AllParameters', {
  testCases: [stack],
});
