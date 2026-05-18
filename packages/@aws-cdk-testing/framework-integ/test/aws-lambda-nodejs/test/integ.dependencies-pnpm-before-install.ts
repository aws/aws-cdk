import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';

// Regression test for https://github.com/aws/aws-cdk/issues/37898
// CDK wrote pnpm-workspace.yaml AFTER beforeInstall ran, so any allowBuilds
// entries added by beforeInstall were silently overwritten. Verifies that the
// function deploys and runs correctly when beforeInstall writes to
// pnpm-workspace.yaml (which requires the fixed ordering to succeed with pnpm
// strictDepBuilds).

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'TestStack');

const handler = new lambda.NodejsFunction(stack, 'Function', {
  entry: path.join(__dirname, 'integ-handlers/pnpm/dependencies-pnpm-before-install.ts'),
  runtime: Runtime.NODEJS_20_X,
  bundling: {
    minify: true,
    nodeModules: ['delay'],
    forceDockerBundling: true,
    commandHooks: {
      beforeBundling: [],
      afterBundling: [],
      // Write an allowBuilds entry before pnpm install runs.
      // This entry must survive CDK's own pnpm-workspace.yaml write.
      beforeInstall: [`printf "allowBuilds:\\n  delay: true\\n" > {outputDir}/pnpm-workspace.yaml`],
    },
  },
  depsLockFilePath: path.join(__dirname, 'integ-handlers/pnpm/pnpm-lock-before-install.yaml'),
});

const integ = new IntegTest(app, 'PnpmBeforeInstallTest', {
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
