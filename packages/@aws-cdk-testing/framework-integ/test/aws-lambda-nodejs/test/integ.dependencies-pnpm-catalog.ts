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

// `axios` is referenced via the pnpm `catalog:` protocol in the handler's
// package.json. Its version is pinned in the sibling `pnpm-workspace.yaml`
// catalog. The catalog config is copied into the bundling directory
// automatically so `pnpm install` can resolve the `catalog:` specifier.
const handler = new lambda.NodejsFunction(stack, 'Function', {
  entry: path.join(__dirname, 'integ-handlers/pnpm-catalog/dependencies-pnpm-catalog.ts'),
  runtime: Runtime.NODEJS_20_X,
  bundling: {
    minify: true,
    // Will be installed, not bundled
    nodeModules: ['axios'],
    forceDockerBundling: true,
  },
  depsLockFilePath: path.join(__dirname, 'integ-handlers/pnpm-catalog/pnpm-lock.yaml'),
});

const integ = new IntegTest(app, 'PnpmCatalogTest', {
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
