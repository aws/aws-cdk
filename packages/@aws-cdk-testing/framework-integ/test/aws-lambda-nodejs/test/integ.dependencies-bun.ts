import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'TestStack');

const handler = new lambda.NodejsFunction(stack, 'Function', {
  entry: path.join(__dirname, 'integ-handlers/bun/dependencies-bun.ts'),
  runtime: Runtime.NODEJS_22_X,
  bundling: {
    minify: true,
    // Will be installed, not bundled
    // (axios is a package with sub-dependencies,
    // will be used to ensure bun bundling works as expected)
    nodeModules: ['axios'],
    forceDockerBundling: true,
  },

  // To (re-)generate this lockfile:
  // 1. Ensure your local version of bun matches the version in packages/aws-cdk-lib/aws-lambda-nodejs/lib/Dockerfile
  // 2. `cd` to `packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ-handlers/bun`
  // 3. Rename the `_package.json` file to `package.json`
  // 4. Run `bun install`
  depsLockFilePath: path.join(__dirname, 'integ-handlers/bun/bun.lockb'),
});

const integ = new IntegTest(app, 'BunTest', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this will tell the runner to not check in assets.
});

const response = integ.assertions.invokeFunction({
  functionName: handler.functionName,
});
response.expect(ExpectedResult.objectLike({
  // expect invoking without error
  StatusCode: 200,
  ExecutedVersion: '$LATEST',
  Payload: 'null',
}));
