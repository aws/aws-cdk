# Integration Tests

This document describes the purpose of integration tests as well as acting as a guide
on what type of changes require integrations tests and how you should write integration tests.

- [What are CDK Integration Tests](#what-are-cdk-integration-tests)
- [When are integration tests required](#when-are-integration-tests-required)
- [How to write Integration Tests](#how-to-write-integration-tests)
  - [Creating a test](#creating-a-test)
  - [New L2 Constructs](#new-l2-constructs)
  - [Existing L2 Constructs](#existing-l2-constructs)
  - [Assertions](#assertions)
- [Running Integration Tests](#running-integration-tests)

## What are CDK Integration Tests

All Construct libraries in the CDK code base have integration tests that serve to -

1. Acts as a regression detector. It does this by running `cdk synth` on the integration test and comparing it against
   the Cloud Assembly stored in the snapshot (`*.integ.snapshot/`) directory. This highlights how a change affects the synthesized stacks.
2. Allows for a way to verify if the stacks are still valid CloudFormation templates, as part of an intrusive change.
   This is done by running `yarn integ` which will run `cdk deploy` across all of the integration tests in that package.
   If you are developing a new integration test or for some other reason want to work on a single integration test
   over and over again without running through all the integration tests you can do so using
   `yarn integ integ.test-name.js` .Remember to set up AWS credentials before doing this.
3. (Optionally) Acts as a way to validate that constructs set up the CloudFormation resources as expected.
   A successful CloudFormation deployment does not mean that the resources are set up correctly.


## When are Integration Tests Required

The following list contains common scenarios where we _know_ that integration tests are required.
This is not an exhaustive list and we will, by default, require integration tests for all
new features unless there is a good reason why one is not needed.

**1. Adding a new feature that is using previously unused CloudFormation resource types**
For example, adding a new L2 construct for an L1 resource. There should be a new integration test
to test that the new L2 successfully creates the resources in AWS.

**2. Adding a new feature that is using previously unused (or untested) CloudFormation properties**
For example, there is an existing L2 construct for a CloudFormation resource and you are adding
support for a new property. This could be either a new property that has been added to CloudFormation
or an existing property that the CDK did not have coverage for. You should either update and existing
integration test to cover this new property or create a new test.

Sometimes the CloudFormation documentation is incorrect or unclear on the correct way to configure
a property. This can lead to introducing new features that don't actually work. Creating
an integration test for the new feature can ensure that it works and avoid unnecessary bugs.

**3. Involves configuring resource types across services (i.e. integrations)**
For example, you are adding functionality that allows for service x to integrate with service y.
A good example of this is the [aws-stepfunctions-tasks](./packages/@aws-cdk/aws-stepfunctions-tasks) or
[aws-apigatewayv2-integrations](./packages/@aws-cdk/aws-apigatewayv2-integrations) modules. Both of these
have L2 constructs that provide functionality to integrate services.

Sometimes these integrations involve configuring/formatting json/vtl or some other type of data.
For these types of features it is important to create an integration test that not only validates
that the infrastructure deploys successfully, but that the intended functionality works. This could
mean deploying the integration test and then manually making an HTTP request or invoking a Lambda function.

**4. Adding a new supported version (e.g. a new [AuroraMysqlEngineVersion](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds.AuroraMysqlEngineVersion.html))**
Sometimes new versions introduce new CloudFormation properties or new required configuration.
For example Aurora MySQL version 8 introduced a new parameter and was not compatible with the
existing parameter (see [#19145](https://github.com/aws/aws-cdk/pull/19145)).

**5. Adding any functionality via a [Custom Resource](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.custom_resources-readme.html)**
Custom resources involve non-standard functionality and are at a higher risk of introducing bugs.

## How to write Integration Tests

This section will detail how to write integration tests, how they are executed and how to ensure
you have good test coverage.

### Creating a Test

An integration tests is any file located in the `test/` directory that has a name that starts with `integ.`
(e.g. `integ.*.ts`).

To create a new integration test, first create a new file, for example `integ.my-new-construct.ts`.
The contents of this file should be a CDK app. For example, a very simple integration test for a
Lambda Function would look like this:

_integ.lambda.ts_
```ts
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_10_X,
});

app.synth();
```

To run the test you would run:

*Note - filename must be `*.js`*
```
yarn integ --update-on-failed integ.lambda.js
```

This will:
1. Synthesize the CDK app
2. `cdk deploy` to your AWS account
3. `cdk destroy` to delete the stack
4. Save a snapshot of the Cloud Assembly to `lambda.integ.snapshot/`

Now when you run `npm test` it will synth the integ app and compare the result with the snapshot.
If the snapshot has changed the same process must be followed to update the snapshot.

### New L2 Constructs

When creating a new L2 construct (or new construct library) it is important to ensure you have a good
coverage base from which future contributions can build on.

Some general rules to follow are:

- **1 test with all default values**
One test for each L2 that only populates the required properties. For a Lambda Function this would look like:

```ts
new lambda.Function(this, 'Handler', {
  code,
  handler,
  runtime,
});
```

- **1 test with all values provided**
One test for each L2 that populates non-default properties. Some of this will come down to judgement, but this should
be based on major functionality. For example, when testing a Lambda Function there are 37 (*at the time of this writing) different
input parameters. Some of these can be tested together and don't represent large pieces of functionality,
while others do.

For example, the test for a Lambda Function might look like this. For most of these properties we are probably fine
testing them together and just testing one of their values. For example we don't gain much by testing a bunch of
different `memorySize` settings, as long as we test that we can `set` the memorySize then we should be good.

```ts
new lambda.Function(this, 'Handler', {
  code,
  handler,
  runtime,
  architecture,
  description,
  environment,
  environmentEncryption,
  functionName,
  initialPolicy,
  insightsVersion,
  layers,
  maxEventAge,
  memorySize,
  reservedConcurrentExecutions,
  retryAttempts,
  role,
  timeout,
  tracing,
});
```

Other parameters might represent larger pieces of functionality and might create other resources for us or configure
integrations with other services. For these it might make sense to split them out into separate tests so it is easier
to reason about them.

A couple of examples would be
(you could also mix in different configurations of the above parameters with each of these):

_testing filesystems_
```ts
new lambda.Function(this, 'Handler', {
  filesystem,
});
```

_testing event sources_
```ts
new lambda.Function(this, 'Handler', {
  events,
});
```

_testing VPCs_
```ts
new lambda.Function(this, 'Handler', {
  securityGroups,
  vpc,
  vpcSubnets,
});
```

### Existing L2 Constructs

Updating an existing L2 Construct could consist of:

1. **Adding coverage for a new (or previously uncovered) CloudFormation property.**
In this case you would want to either add this new property to an existing integration test or create a new
integration test. A new integration test is preferred for larger update (e.g. adding VPC connectivity, etc).

2. **Updating functionality for an existing property.**
In this case you should first check if you are already covered by an existing integration test. If not, then you would follow the
same process as adding new coverage.

3. **Changing functionality that affects asset bundling**
Some constructs deal with asset bundling (i.e. `aws-lambda-nodejs`, `aws-lambda-python`, etc). There are some updates that may not
touch any CloudFormation property, but instead change the way that code is bundled. While these types of changes may not require
a change to an integration test, you need to make sure that the integration tests and assertions are rerun.

An example of this would be making a change to the way `aws-lambda-nodejs` bundles Lambda code. A couple of things could go wrong that would
only be caught by rerunning the integration tests. 

1. The bundling commands are only running when performing a real synth (not part of unit tests). Running the integration test confirms
that the actual bundling was not broken.
2. When deploying Lambda Functions, CloudFormation will only update the Function configuration with the new code,
but it will not validate that the Lambda function can be invoked. Because of this, it is important to rerun the integration test
to deploy the Lambda Function _and_ then rerun the assertions to ensure that the function can still be invoked.

### Assertions
...Coming soon...

## Running Integration Tests

Most of the time you will only need to run integration tests for an individual module (i.e. `aws-lambda`). Other times you may need to run tests across multiple modules.
In this case I would recommend running from the root directory like below.

_Run snapshot tests only_
```bash
yarn integ-runner --directory packages/@aws-cdk
```

_Run snapshot tests and then re-run integration tests for failed snapshots_
```bash
yarn integ-runner --directory packages/@aws-cdk --update-on-failed
```

One benefit of running from the root directory like this is that it will only collect tests from "built" modules. If you have built the entire
repo it will run all integration tests, but if you have only built a couple modules it will only run tests from those.

### Running large numbers of Tests

If you need to re-run a large number of tests you can run them in parallel like this.

```bash
yarn integ-runner --directory packages/@aws-cdk --update-on-failed \
  --parallel-regions us-east-1 \
  --parallel-regions us-east-2 \
  --parallel-regions us-west-2 \
  --parallel-regions eu-west-1 \
  --profiles profile1 \
  --profiles profile2 \
  --profiles profile3 \
  --verbose
```

When using both `--parallel-regions` and `--profiles` it will execute (regions*profiles) tests in parallel (in this example 12)
If you want to execute more than 16 tests in parallel you can pass a higher value to `--max-workers`.
