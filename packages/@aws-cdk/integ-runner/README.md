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


## Overview


## Usage

- Run all integration tests in `test` directory

```bash
integ-runner [ARGS] [TEST...]
```

This will look for all files that match the naming convention of `/integ.*.js$/`. Each of these files will be expected
to be a self contained CDK app. The runner will execute the following for each file (app):

1. Check if a snapshot file exists (i.e. `/*.integ.snapshot$/`)
2. If the snapshot does not exist
	2a. Synth the integ app which will produce the `integ.json` file
3. Read the `integ.json` file which contains instructions on what the runner should do.
4. Execute instructions

### Options

- `--update-on-failed` (default=`false`)
  Rerun integration tests if snapshot fails
- `--clean` (default=`true`)
  Destroy stacks after deploy (use `--no-clean` for debugging)
- `--verbose` (default=`false`)
  verbose logging
- `--parallel` (default=`true`)
  Run tests in parallel across default regions
- `--parallel-regions` (default=`us-east-1`,`us-east-2`, `us-west-2`)
  List of regions to run tests in. If this is provided then all tests will
  be run in parallel across these regions
- `--directory` (default=`test`)
  Search for integration tests recursively from this starting directory
- `--force` (default=`false`)
  Rerun integration test even if the test passes
- `--file`
  Read the list of tests from this file

Example:

```bash
integ-runner --update --parallel --parallel-regions us-east-1 --parallel-regions us-east-2 --parallel-regions us-west-2 --directory ./
```

This will search for integration tests recursively from the current directory and then execute them in parallel across `us-east-1`, `us-east-2`, & `us-west-2`.

### Common Workflow

A common workflow to use when running integration tests is to first run the integration tests to see if there are any snapshot differences.

```bash
integ-runner
```

If there are any differences you might see an output like the output below.

```bash
integ-runner

Verifying integration test snapshots...

  eks-cluster-private-endpoint No Change!
  eks-inference No Change!
  alb-controller No Change!
  eks-oidc-provider No Change!
  eks-bottlerocket-ng No Change!
  eks-cluster No Change!
  fargate-cluster No Change!
  eks-cluster-handlers-vpc No Change!
  eks-helm-asset - Snapshot changed!
Resources
[+] Custom::AWSCDK-EKS-HelmChart Clustercharttestocichart9C188967



Snapshot Results:

Tests:    1 failed, 9 total
Error: Some snapshot tests failed!
To re-run failed tests run: yarn integ-runner --update-on-failed
    at main (packages/@aws-cdk/integ-runner/lib/cli.js:90:15)
error Command failed with exit code 1. 
```

To re-run the integration test for the failed tests you would then run:

```bash
integ-runner --update-on-failed
```

This will run the snapshot tests and collect all the failed tests. It will then re-execute the
integration test for the failed tests and if successful, save the new snapshot.

```bash
integ-runner --update-on-failed

Verifying integration test snapshots...

  eks-cluster-private-endpoint No Change!
  eks-inference No Change!
  alb-controller No Change!
  eks-oidc-provider No Change!
  eks-bottlerocket-ng No Change!
  eks-cluster No Change!
  fargate-cluster No Change!
  eks-cluster-handlers-vpc No Change!
  eks-helm-asset - Snapshot changed!
Resources
[+] Custom::AWSCDK-EKS-HelmChart Clustercharttestocichart9C188967



Snapshot Results:

Tests:    1 failed, 9 total

Running integration tests for failed tests...

Running in parallel across: us-east-1, us-east-2, us-west-2
Running test test/integ.eks-helm-asset.js in us-east-1
  eks-helm-asset Test Succeeded!

Test Results:

Tests:    1 passed, 1 total
```


### integ.json schema

See [@aws-cdk/cloud-assembly-schema/lib/integ-tests/schema.ts](../cloud-assembly-schema/lib/integ-tests/schema.ts)

### defining an integration test

In most cases an integration test will be an instance of a stack

```ts
import { Function, FunctionOptions } from '../lib';

interface MyIntegTestProps extends StackOptions {
  functionProps?: FunctionOptions;
}
class MyIntegTest extends Stack {
  constructor(scope: Construct, id: string, props: MyIntegTestProps) {
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

You would then use the `IntegTest` construct to create your test cases

```ts
new IntegTeset(app, 'ArmTest', {
  stacks: [
    new MyIntegTest(app, 'Stack1', {
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

new IntegTeset(app, 'AmdTest', {
  stacks: [
    new MyIntegTest(app, 'Stack2', {
	  functionProps: {
	    architecture: lambda.Architecture.X86_64,
	  },
	}),
  ],
});
```

This will synthesize an `integ.json` file with the following contents

```json
{
  "ArmTest": {
    "stacks": ["Stack1"],
	"diffAssets": true,
	"update": true,
	"cdkCommands": {
	  "deploy": {
	    "args": {
		  "requireApproval": "never",
		  "json": true
		}
	  },
	  "destroy": {
	    "args": {
		  "force": true
		}
	  }
	}
  },
  "AmdTest": {
    "stacks": ["Stack2"]
  }
}
```
