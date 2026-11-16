import * as core from 'aws-cdk-lib';
import * as inc from 'aws-cdk-lib/cloudformation-include';
import * as path from 'path';

const app = new core.App();

const stack = new core.Stack(app, 'ParentStack');

new inc.CfnInclude(stack, 'ParentStack', {
  templateFile: path.join(__dirname, 'test-templates/nested/parent-one-child.json'),
  loadNestedStacks: {
    ChildStack: {
      templateFile: path.join(__dirname, 'test-templates/nested/grandchild-import-stack.json'),
    },
  },
});

app.synth();
