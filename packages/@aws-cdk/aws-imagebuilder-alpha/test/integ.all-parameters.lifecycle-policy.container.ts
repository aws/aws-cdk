import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-lifecycle-policy-container-all-parameters');

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/EC2ImageBuilderLifecycleExecutionPolicy')],
});

new imagebuilder.LifecyclePolicy(stack, 'LifecyclePolicy-Container', {
  lifecyclePolicyName: 'test-container-lifecycle-policy',
  description: 'This is a test lifecycle policy',
  status: imagebuilder.LifecyclePolicyStatus.DISABLED,
  resourceType: imagebuilder.LifecyclePolicyResourceType.CONTAINER_IMAGE,
  executionRole: role,
  details: [
    {
      action: {
        type: imagebuilder.LifecyclePolicyActionType.DELETE,
        includeContainers: false,
      },
      filter: {
        ageFilter: {
          age: cdk.Duration.days(30),
          retainAtLeast: 5,
        },
      },
      exclusionRules: { imageExclusionRules: { tags: { Environment: 'test' } } },
    },
  ],
  resourceSelection: { tags: { Environment: 'test' } },
});

new integ.IntegTest(app, 'LifecyclePolicyTest-Container-AllParameters', {
  testCases: [stack],
});
