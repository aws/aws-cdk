import * as inc from '@aws-cdk/cloudformation-include';
import * as core from '@aws-cdk/core';

/// !cdk-integ ParentStack

const app = new core.App();

const stack = new core.Stack(app, 'ParentStack');

new inc.CfnInclude(stack, 'ParentStack', {
  templateFile: 'test-templates/nested/parent-export-stack.json',
  nestedStacks: {
    "ChildStack": {
      templateFile: 'test-templates/nested/child-import-stack.json',
      nestedStacks: {
        "GrandChildStack": {
          templateFile: 'test-templates/nested/grandchild-import-stack.json',
        },
      },
    },
    "AnotherChildStack": {
      templateFile: 'test-templates/nested/child-import-stack.json',
      nestedStacks: {
        "GrandChildStack": {
          templateFile: 'test-templates/nested/grandchild2-import-stack.json',
        }
      }
    }
  }
});

app.synth();
