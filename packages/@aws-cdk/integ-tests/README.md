# integ-tests

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
interface StackUnderTestProps extends StackProps {
  architecture?: lambda.Architecture;
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);
	
    new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
      architecture: props.architecture,
    });
  }
}
```

You may want to test this stack under different conditions. For example, we want
this stack to be deployed correctly, regardless of the architecture we choose
for the Lambda function. In particular, it should work for both `ARM_64` and
`X86_64`. So you can create an `IntegTestCase` that exercises both scenarios:

```ts
interface StackUnderTestProps extends StackProps {
  architecture?: lambda.Architecture;
}

class StackUnderTest extends Stack {
  constructor(scope: Construct, id: string, props: StackUnderTestProps) {
    super(scope, id, props);
	
    new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
      architecture: props.architecture,
    });
  }
}

// Beginning of the test suite
const app = new App();

const stack = new Stack(app, 'stack');

const differentArchsCase = new IntegTestCase(stack, 'DifferentArchitectures', {
  stacks: [
    new StackUnderTest(app, 'Stack1', {
      architecture: lambda.Architecture.ARM_64,
    }),
    new StackUnderTest(app, 'Stack2', {
      architecture: lambda.Architecture.X86_64,
    }),
  ],
});

// There must be exactly one instance of TestCase per file
new IntegTest(app, 'integ-test', {

  // Register as many test cases as you want here
  testCases: [differentArchsCase],
});
```

This is all the instruction you need for the integration test runner to know
which stacks to synthesize, deploy and destroy. But you may also need to
customize the behavior of the runner by changing its parameters. For example:

```ts
const app = new App();

const stackUnderTest = new Stack(app, 'StackUnderTest', /* ... */);

const stack = new Stack(app, 'stack');

const testCase = new IntegTestCase(stack, 'CustomizedDeploymentWorkflow', {
  stacks: [stackUnderTest],
  diffAssets: true,
  stackUpdateWorkflow: true,
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

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});
```

## Assertions

When writing integration tests, you sometimes need to perform actions against the deployed integration test
infrastructure to validate that certain functionality is working. This module contains assertion constructs
that allow you to accomplish this.

### Example

The `aws-stepfunctions-tasks` module contains some good examples of when integration tests need to perform assertions
on the deployed infrastructure. The `EventBridgePutEvents` construct creates a step function task to send and event
to and EventBridge event bus. We are creating an integration between two different AWS services, so it is not enough
to just assert that the infrastructure is successfully created, we also need to assert that the integration was configured
correctly to allow the step function task to send the event to event bridge.

Given an Integration Test that looks like this:
```ts
const app = new App();
const stack = new Stack(app, 'aws-stepfunctions-tasks-eventbridge-put-events-integ');

const eventBus = new events.EventBus(stack, 'EventBus', {
  eventBusName: 'MyEventBus1',
});

const putEventsTask = new stepfunctions_tasks.EventBridgePutEvents(stack, 'Put Custom Events', {
  entries: [{
    // Entry with no event bus specified
    detail: sfn.TaskInput.fromObject({
      Message: 'Hello from Step Functions!',
    }),
    detailType: 'MessageFromStepFunctions',
    source: 'step.functions',
  }, {
    // Entry with EventBus provided as object
    detail: sfn.TaskInput.fromObject({
      Message: 'Hello from Step Functions!',
    }),
    eventBus,
    detailType: 'MessageFromStepFunctions',
    source: 'step.functions',
  }],
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: putEventsTask,
  timeout: cdk.Duration.seconds(30),
});

new IntegTest(app, 'IntegTest', {
  testCases: [
    new IntegTestCase(app, 'TestCase', {
      stacks: [stack],
    }),
  ],
});
```

We could then register assertions

```ts
const assert = new DeployAssert(
  stack,
);

// Start an execution
const start = assert.queryAws({
  api: 'startExecution',
  service: 'StepFunctions',
  parameters: {
    stateMachineArn: sm.stateMachineArn,
  },
});

// describe the results of the execution
const describe = assert.queryAws({
  api: 'describeExecution',
  service: 'StepFunctions',
  parameters: {
    executionArn: start.getAttString('executionArn'),
  },
});

// assert the results
assert.registerAssertion(describe.assertEqual({
  status: 'SUCCEEDED',
}, 'success'));
```
