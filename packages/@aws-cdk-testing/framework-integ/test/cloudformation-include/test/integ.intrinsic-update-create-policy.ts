import * as core from 'aws-cdk-lib';
import * as inc from 'aws-cdk-lib/cloudformation-include';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { CFN_INCLUDE_REJECT_COMPLEX_RESOURCE_UPDATE_CREATE_POLICY_INTRINSICS } from 'aws-cdk-lib/cx-api';

const app = new core.App();

const stack = new core.Stack(app, 'Stack');
stack.node.setContext(CFN_INCLUDE_REJECT_COMPLEX_RESOURCE_UPDATE_CREATE_POLICY_INTRINSICS, false);

// invalid without the FF
new inc.CfnInclude(stack, 'Stack', {
  templateFile: 'test-templates/invalid/intrinsics-update-policy.json',
});
new inc.CfnInclude(stack, 'Stack', {
  templateFile: 'test-templates/invalid/intrinsics-create-policy.json',
});

new integ.IntegTest(app, 'IntrinsicsUpdatePolicy', {
  testCases: [stack],
});
