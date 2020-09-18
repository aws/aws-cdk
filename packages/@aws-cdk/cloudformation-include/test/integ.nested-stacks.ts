import * as core from '@aws-cdk/core';
import * as inc from '../lib';

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
