import * as core from 'aws-cdk-lib';
import * as inc from 'aws-cdk-lib/cloudformation-include';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new core.App();

const stack = new core.Stack(app, 'Stack');

new inc.CfnInclude(stack, 'Stack', {
  templateFile: 'test-templates/tags-with-intrinsics.json',
});

new integ.IntegTest(app, 'ResourceTagIntrinsicStack', {
  testCases: [stack],
});
