import * as core from 'aws-cdk-lib';
import * as inc from 'aws-cdk-lib/cloudformation-include';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';

const app = new core.App();
const stack = new core.Stack(app, 'Stack');

new inc.CfnInclude(stack, 'Stack', {
  templateFile: path.join(__dirname, 'test-templates/autoscaling-update-policy.json'),
});

new integ.IntegTest(app, 'AutoScalingUpdatePolicyTest', {
  testCases: [stack],
});
