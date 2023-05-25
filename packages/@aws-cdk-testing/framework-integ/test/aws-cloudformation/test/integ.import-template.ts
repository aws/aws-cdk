import * as core from 'aws-cdk-lib';
import * as inc from 'aws-cdk-lib/cloudformation-include';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new core.App();

const stack = new core.Stack(app, 'ImportStack');

new inc.CfnInclude(stack, 'ImportStack', {
  templateFile: 'test-templates/resource-attribute-deletion-policy.json',
});

new integ.IntegTest(app, 'DependsOnTest', {
  testCases: [stack],
});

app.synth();
