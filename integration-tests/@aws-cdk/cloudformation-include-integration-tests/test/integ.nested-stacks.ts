import * as inc from '@aws-cdk/cloudformation-include';
import * as core from '@aws-cdk/core';

const app = new core.App();

const stack = new core.Stack(app, 'ParentStack');

new inc.CfnInclude(stack, 'ParentStack', {
  templateFile: 'test-templates/nested/parent-one-child.json',
  loadNestedStacks: {
    ChildStack: {
      templateFile: 'test-templates/nested/grandchild-import-stack.json',
    },
  },
});

app.synth();
