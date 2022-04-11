# integ-runner

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## Usage

Suppose you have a simple stack, that only encapsulates a Lambda function with a
certain handler:

```ts
import { Function, FunctionOptions } from '../lib';

interface StackUnderTestProps extends StackOptions {
  functionProps?: FunctionOptions;
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);
	
	new Function(this, 'Handler', {
	  runtime: Runtime.NODEJS_12_X,
	  handler: 'index.handler',
	  code: Code.fromAsset(path.join(__dirname, 'lambda-handler')),
	  ...props.functionProps,
	});
  }
}
```

You may want to test this stack under different conditions. For example, we want
this stack to be deployed correctly, regardless of the architecture we choose
for the Lambda function. In particular, it should work for both `ARM_64` and
`X86_64`. So you can create an `IntegTestCase` that exercises both scenarios:

```ts
const app = new App();
const stack = new Stack(app, 'stack');

new IntegTestCase(stack, 'DifferentArchitectures', {
  stacks: [
    new StackUnderTest(app, 'Stack1', {
      functionProps: {
        architecture: lambda.Architecture.ARM_64,
      },
    }),
    new StackUnderTest(app, 'Stack2', {
      functionProps: {
        architecture: lambda.Architecture.X86_64,
      },
  	}),
  ]
});
```

This is all the instruction you need for the integration test runner to know
which stacks to synthesize, deploy and destroy. But you may also need to
customize the behavior of the runner by changing its parameters. For example:

```ts
const app = new App();
const stack = new Stack(app, 'stack');

new IntegTestCase(stack, 'CustomizedDeploymentWorkflow', {
  stacks: [
    new StackUnderTest(app, 'Stack1', {
      functionProps: {
        architecture: lambda.Architecture.ARM_64,
      },
	  }),
  ],
  diffAssets: true,
  update: true,
  cdkCommandOptions: {
    deploy: {
      args: {
        requireApproval: RequireApproval.NEVER,
        json: true,
      },
	  },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});
```

