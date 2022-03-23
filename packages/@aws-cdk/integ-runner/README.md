# integ-runner


## Overview


## Usage

- Run all integration tests in `test` directory

```bash
integ-runner
```

This will look for all files that match the naming convention of `/integ.*.ts$/`. Each of these files will be expected
to be a self contained CDK app. The runner will execute the following for each file (app):

1. Check if a snapshot file exists (i.e. `/integ.*.expected.snapshot$/`)
2. If the snapshot does not exist
	2a. Synth the integ app which will produce the `integ.json` file
3. Read the `integ.json` file which contains instructions on what the runner should do.
4. Execute instructions

### Options

- `--update` (default=false)
  Rerun integration tests if snapshot fails
- `--clean` (default=`true`)
  Destroy stacks after deploy (use `--no-clean` for debugging)
- `--verbose` (default=`false`)
  verbose logging
- `--parallel` (default=`false`)
  Run tests in parallel across default regions
- `--parallel-regions`
  List of regions to run tests in. If this is provided then all tests will
  be run in parallel across these regions
- `--directory` (default=`test`)
  Search for integration tests recursively from this starting directory
- `--force` (default=`false`)
  Rerun integration test even if the test passes

Example:
```bash
integ-runner --update --parallel --parallel-regions us-east-1 --parallel-regions us-east-2 --parallel-regions us-west-2 --directory ./
```

This will search for integration tests recursively from the current directory and then execute them in parallel across `us-east-1`, `us-east-2`, & `us-west-2`.

### integ.json schema

```ts
interface CdkCommand {
  /**
   * Whether or not to run this command as part of the workflow
   * This can be used if you only want to test some of the workflow
   * for example enable `synth` and disable `deploy` & `destroy` in order
   * to limit the test to synthesis
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Additional arguments to pass to the command
   * This can be used to test specific CLI functionality
   *
   * @default - only default args are used
   */
  readonly args?: string[];

  /**
   * If the runner should expect this command to fail
   *
   * @default false
   */
  readonly expectError?: boolean;

  /**
   * This can be used in combination with `expectedError`
   * to validate that a specific message is returned.
   *
   * @default - do not validate message
   */
  readonly expectedMessage?: string;
}

interface CdkCommands {
  /**
   * Options to for the cdk deploy command
   *
   * @default - default deploy options
   */
  readonly deploy?: CdkCommand;

  /**
   * Options to for the cdk synth command
   *
   * @default - default synth options
   */
  readonly synth?: CdkCommand;

  /**
   * Options to for the cdk destroy command
   *
   * @default - default destroy options
   */
  readonly destroy?: CdkCommand;
}

interface Hooks {
  readonly preDeploy?: string[];
  readonly postDeploy?: string[];
  readonly preDestroy?: string[];
  readonly postDestroy?: string[];
}

interface TestCase {
  /**
   * Stacks that should be tested as part of this test case
   * The stackNames will be passed as args to the cdk commands
   * so dependent stacks will be automatically deployed unless
   * `exclusively` is passed
   */
  readonly stacks: string[];

  /**
   * Run update workflow on this test case
   * This should only be set to false to test scenarios
   * that are not possible to test as part of the update workflow
   *
   * @default true
   */
  readonly update?: boolean;

  /**
   * Additional options to use for each CDK command
   *
   * @default - runner default options
   */
  readonly cdkCommandOptions?: CdkCommands;
  
  /**
   * Additional commands to run at predefined points in the test workflow
   *
   * e.g. { postDeploy: ['yarn', 'test'] }
   *
   * @default - no hooks
   */
  readonly hooks?: Hooks;
  
  /**
   * Whether or not to include asset hashes in the diff
   * Asset hashes can introduces a lot of unneccessary noise into tests,
   * but there are some cases where asset hashes _should_ be included. For example
   * any tests involving custom resources or bundling
   * 
   * @default false
   */
  readonly diffAssets?: boolean;
  
  /**
   * List of CloudFormation resource types in this stack that can
   * be destroyed as part of an update without failing the test.
   *
   * This list should only include resources that for this specific
   * integration test we are sure will not cause errors or an outage if
   * destroyed. For example, maybe we know that a new resource will be created
   * first before the old resource is destroyed which prevents any outage.
   *
   * e.g. ['AWS::IAM::Role']
   *
   * @default - do not allow destruction of any resources on update
   */
  readonly allowDestroy?: string[];
  
  /**
   * Limit deployment to these regions
   *
   * @default - can run in any region
   */
  readonly regions?: string[];
}

interface IntegSchema {
  /**
   * Test cases that the runner will execute
   */
  testCases: { [name: string]: TestCase };
}
```

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
	    "args": ["--require-approval", "never", "--json"]
	  },
	  "destroy": {
	    "args": ["--force"]
	  }
	}
  },
  "AmdTest": {
    "stacks": ["Stack2"]
  }
}
```
