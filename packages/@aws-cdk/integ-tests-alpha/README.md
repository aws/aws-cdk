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

## Overview

This library is meant to be used in combination with the [integ-runner](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/integ-runner) CLI
to enable users to write and execute integration tests for AWS CDK Constructs.

An integration test should be defined as a CDK application, and
there should be a 1:1 relationship between an integration test and a CDK application.

So for example, in order to create an integration test called `my-function`
we would need to create a file to contain our integration test application.

*test/integ.my-function.ts*

```ts
const app = new App();
const stack = new Stack();
new lambda.Function(stack, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
});
```

This is a self contained CDK application which we could deploy by running

```bash
cdk deploy --app 'node test/integ.my-function.js'
```

In order to turn this into an integration test, all that is needed is to
use the `IntegTest` construct.

```ts
declare const app: App;
declare const stack: Stack;
new IntegTest(app, 'Integ', { testCases: [stack] });
```

You will notice that the `stack` is registered to the `IntegTest` as a test case.
Each integration test can contain multiple test cases, which are just instances
of a stack. See the [Usage](#usage) section for more details.

## Usage

### IntegTest

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
      runtime: lambda.Runtime.NODEJS_LATEST,
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
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
      architecture: props.architecture,
    });
  }
}

// Beginning of the test suite
const app = new App();

new IntegTest(app, 'DifferentArchitectures', {
  testCases: [
    new StackUnderTest(app, 'Stack1', {
      architecture: lambda.Architecture.ARM_64,
    }),
    new StackUnderTest(app, 'Stack2', {
      architecture: lambda.Architecture.X86_64,
    }),
  ],
});
```

This is all the instruction you need for the integration test runner to know
which stacks to synthesize, deploy and destroy. But you may also need to
customize the behavior of the runner by changing its parameters. For example:

```ts
const app = new App();

const stackUnderTest = new Stack(app, 'StackUnderTest', /* ... */);

const stack = new Stack(app, 'stack');

const testCase = new IntegTest(app, 'CustomizedDeploymentWorkflow', {
  testCases: [stackUnderTest],
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
```

### IntegTestCaseStack

In the majority of cases an integration test will contain a single `IntegTestCase`.
By default when you create an `IntegTest` an `IntegTestCase` is created for you
and all of your test cases are registered to this `IntegTestCase`. The `IntegTestCase`
and `IntegTestCaseStack` constructs are only needed when it is necessary to
defined different options for individual test cases.

For example, you might want to have one test case where `diffAssets` is enabled.

```ts
declare const app: App;
declare const stackUnderTest: Stack;
const testCaseWithAssets = new IntegTestCaseStack(app, 'TestCaseAssets', {
  diffAssets: true,
});

new IntegTest(app, 'Integ', { testCases: [stackUnderTest, testCaseWithAssets] });
```

## Assertions

This library also provides a utility to make assertions against the infrastructure that the integration test deploys.

There are two main scenarios in which assertions are created.

- Part of an integration test using `integ-runner`

In this case you would create an integration test using the `IntegTest` construct and then make assertions using the `assert` property.
You should **not** utilize the assertion constructs directly, but should instead use the `methods` on `IntegTest.assertions`.

```ts
declare const app: App;
declare const stack: Stack;

const integ = new IntegTest(app, 'Integ', { testCases: [stack] });
integ.assertions.awsApiCall('S3', 'getObject');
```

By default an assertions stack is automatically generated for you. You may however provide your own stack to use. 

```ts
declare const app: App;
declare const stack: Stack;
declare const assertionStack: Stack;

const integ = new IntegTest(app, 'Integ', { testCases: [stack], assertionStack: assertionStack });
integ.assertions.awsApiCall('S3', 'getObject');
```

- Part of a  normal CDK deployment

In this case you may be using assertions as part of a normal CDK deployment in order to make an assertion on the infrastructure
before the deployment is considered successful. In this case you can utilize the assertions constructs directly.

```ts
declare const myAppStack: Stack;

new AwsApiCall(myAppStack, 'GetObject', {
  service: 'S3',
  api: 'getObject',
});
```

### DeployAssert

Assertions are created by using the `DeployAssert` construct. This construct creates it's own `Stack` separate from
any stacks that you create as part of your integration tests. This `Stack` is treated differently from other stacks
by the `integ-runner` tool. For example, this stack will not be diffed by the `integ-runner`.

`DeployAssert` also provides utilities to register your own assertions.

```ts
declare const myCustomResource: CustomResource;
declare const stack: Stack;
declare const app: App;

const integ = new IntegTest(app, 'Integ', { testCases: [stack] });
integ.assertions.expect(
  'CustomAssertion',
  ExpectedResult.objectLike({ foo: 'bar' }),
  ActualResult.fromCustomResource(myCustomResource, 'data'),
);
```

In the above example an assertion is created that will trigger a user defined `CustomResource`
and assert that the `data` attribute is equal to `{ foo: 'bar' }`.

### API Calls

A common method to retrieve the "actual" results to compare with what is expected is to make an
API call to receive some data. This library does this by utilizing CloudFormation custom resources
which means that CloudFormation will call out to a Lambda Function which will
make the API call.

#### HttpApiCall

Using the `HttpApiCall` will use the
[node-fetch](https://github.com/node-fetch/node-fetch) JavaScript library to
make the HTTP call.

This can be done by using the class directory (in the case of a normal deployment):

```ts
declare const stack: Stack;

new HttpApiCall(stack, 'MyAsssertion', {
  url: 'https://example-api.com/abc',
});
```

Or by using the `httpApiCall` method on `DeployAssert` (when writing integration tests):

```ts
declare const app: App;
declare const stack: Stack;
const integ = new IntegTest(app, 'Integ', {
  testCases: [stack],
});
integ.assertions.httpApiCall('https://example-api.com/abc');
```

#### AwsApiCall

Using the `AwsApiCall` construct will use the AWS JavaScript SDK to make the API call.

This can be done by using the class directory (in the case of a normal deployment):

```ts
declare const stack: Stack;

new AwsApiCall(stack, 'MyAssertion', {
  service: 'SQS',
  api: 'receiveMessage',
  parameters: {
    QueueUrl: 'url',
  },
});
```

Or by using the `awsApiCall` method on `DeployAssert` (when writing integration tests):

```ts
declare const app: App;
declare const stack: Stack;
const integ = new IntegTest(app, 'Integ', {
  testCases: [stack],
});
integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: 'url',
});
```

You must specify the `service` and the `api` when using The `AwsApiCall` construct.
The `service` is the name of an AWS service, in one of the following forms:

- An AWS SDK for JavaScript v3 package name (`@aws-sdk/client-api-gateway`)
- An AWS SDK for JavaScript v3 client name (`api-gateway`)
- An AWS SDK for JavaScript v2 constructor name (`APIGateway`)
- A lowercase AWS SDK for JavaScript v2 constructor name (`apigateway`)

The `api` is the name of an AWS API call, in one of the following forms:

- An API call name as found in the API Reference documentation (`GetObject`)
- The API call name starting with a lowercase letter (`getObject`)
- The AWS SDK for JavaScript v3 command class name (`GetObjectCommand`)

By default, the `AwsApiCall` construct will automatically add the correct IAM policies
to allow the Lambda function to make the API call. It does this based on the `service`
and `api` that is provided. In the above example the service is `SQS` and the api is
`receiveMessage` so it will create a policy with `Action: 'sqs:ReceiveMessage`.

There are some cases where the permissions do not exactly match the service/api call, for
example the S3 `listObjectsV2` api. In these cases it is possible to add the correct policy
by accessing the `provider` object.

```ts
declare const app: App;
declare const stack: Stack;
declare const integ: IntegTest;

const apiCall = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: 'mybucket',
});

apiCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});
```

When executing `waitForAssertion()`, it is necessary to add an IAM policy using `waiterProvider.addToRolePolicy()`.
Because `IApiCall` does not have a `waiterProvider` property, you need to cast it to `AwsApiCall`.

```ts
declare const integ: IntegTest;

const apiCall = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: 'mybucket',
}).waitForAssertions() as AwsApiCall;

apiCall.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});
```

Note that addToRolePolicy() uses direct IAM JSON policy blobs, not a iam.PolicyStatement
object like you will see in the rest of the CDK.

### EqualsAssertion

This library currently provides the ability to assert that two values are equal
to one another by utilizing the `EqualsAssertion` class. This utilizes a Lambda
backed `CustomResource` which in tern uses the [Match](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Match.html) utility from the
[@aws-cdk/assertions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html) library. 


```ts
declare const app: App;
declare const stack: Stack;
declare const queue: sqs.Queue;
declare const fn: lambda.IFunction;

const integ = new IntegTest(app, 'Integ', {
  testCases: [stack],
});

integ.assertions.invokeFunction({
  functionName: fn.functionName,
  invocationType: InvocationType.EVENT,
  payload: JSON.stringify({ status: 'OK' }),
});

const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: queue.queueUrl,
  WaitTimeSeconds: 20,
});

message.assertAtPath('Messages.0.Body', ExpectedResult.objectLike({
  requestContext: {
    condition: 'Success',
  },
  requestPayload: {
    status: 'OK',
  },
  responseContext: {
    statusCode: 200,
  },
  responsePayload: 'success',
}));
```

#### Match

`integ-tests` also provides a `Match` utility similar to the `@aws-cdk/assertions` module. `Match`
can be used to construct the `ExpectedResult`. While the utility is similar, only a subset of methods are currently available on the `Match` utility of this module: `arrayWith`, `objectLike`, `stringLikeRegexp` and `serializedJson`.

```ts
declare const message: AwsApiCall;

message.expect(ExpectedResult.objectLike({
  Messages: Match.arrayWith([
    {
      Payload: Match.serializedJson({ key: 'value' }),
    },
    {
	  Body: {
	    Values: Match.arrayWith([{ Asdf: 3 }]),
		Message: Match.stringLikeRegexp('message'),
	  },
    },
  ]),
}));
```

### Examples

#### Invoke a Lambda Function

In this example there is a Lambda Function that is invoked and
we assert that the payload that is returned is equal to '200'.

```ts
declare const lambdaFunction: lambda.IFunction;
declare const app: App;

const stack = new Stack(app, 'cdk-integ-lambda-bundling');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

const invoke = integ.assertions.invokeFunction({
  functionName: lambdaFunction.functionName,
});
invoke.expect(ExpectedResult.objectLike({
  Payload: '200',
}));
```

The above example will by default create a CloudWatch log group that's never
expired. If you want to configure it with custom log retention days, you need
to specify the `logRetention` property.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';

declare const lambdaFunction: lambda.IFunction;
declare const app: App;

const stack = new Stack(app, 'cdk-integ-lambda-bundling');

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

const invoke = integ.assertions.invokeFunction({
  functionName: lambdaFunction.functionName,
  logRetention: logs.RetentionDays.ONE_WEEK,
});
```

#### Make an AWS API Call

In this example there is a StepFunctions state machine that is executed
and then we assert that the result of the execution is successful.

```ts
declare const app: App;
declare const stack: Stack;
declare const sm: IStateMachine;

const testCase = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
}));
```

#### Chain ApiCalls

Sometimes it may be necessary to chain API Calls. Since each API call is its own resource, all you
need to do is add a dependency between the calls. There is an helper method `next` that can be used.

```ts
declare const integ: IntegTest;

integ.assertions.awsApiCall('S3', 'putObject', {
  Bucket: 'amzn-s3-demo-bucket',
  Key: 'my-key',
  Body: 'helloWorld',
}).next(integ.assertions.awsApiCall('S3', 'getObject', {
  Bucket: 'amzn-s3-demo-bucket',
  Key: 'my-key',
}));
```

#### Wait for results

A common use case when performing assertions is to wait for a condition to pass. Sometimes the thing
that you are asserting against is not done provisioning by the time the assertion runs. In these
cases it is possible to run the assertion asynchronously by calling the `waitForAssertions()` method.

Taking the example above of executing a StepFunctions state machine, depending on the complexity of
the state machine, it might take a while for it to complete.

```ts
declare const app: App;
declare const stack: Stack;
declare const sm: IStateMachine;

const testCase = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions();
```

When you call `waitForAssertions()` the assertion provider will continuously make the `awsApiCall` until the
`ExpectedResult` is met. You can also control the parameters for waiting, for example:

```ts
declare const testCase: IntegTest;
declare const start: IApiCall;

const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: Duration.minutes(5),
  interval: Duration.seconds(15),
  backoffRate: 3,
});
```

