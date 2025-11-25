import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-lifecycle-policy-ami-default-parameters');

new imagebuilder.LifecyclePolicy(stack, 'LifecyclePolicy-AMI', {
  resourceType: imagebuilder.LifecyclePolicyResourceType.AMI_IMAGE,
  details: [
    {
      action: { type: imagebuilder.LifecyclePolicyActionType.DELETE },
      filter: { countFilter: { count: 5 } },
    },
  ],
  resourceSelection: { tags: { Environment: 'test' } },
});

new integ.IntegTest(app, 'LifecyclePolicyTest-AMI-DefaultParameters', {
  testCases: [stack],
});
