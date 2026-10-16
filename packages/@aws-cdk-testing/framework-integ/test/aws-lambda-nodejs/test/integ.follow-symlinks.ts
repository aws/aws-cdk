import * as path from 'path';
import { App, Stack, SymlinkFollowMode } from 'aws-cdk-lib';
import { Code, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App();
const stack = new Stack(app, 'BundledSymlinks');
const layer = new LayerVersion(stack, 'Layer', {
  code: Code.fromAsset(path.join(__dirname, 'integ-handlers/symlink-layer')),
});
const fn = new NodejsFunction(stack, 'Function', {
  entry: path.join(__dirname, 'integ-handlers/read-symlink.cjs'),
  runtime: STANDARD_NODEJS_RUNTIME,
  layers: [layer],
  bundling: {
    followSymlinks: SymlinkFollowMode.NEVER,
    commandHooks: {
      beforeBundling: () => [],
      beforeInstall: () => [],
      afterBundling: (_inputDir, outputDir) => [
        `ln -s /opt/nodejs '${outputDir}/layer'`,
      ],
    },
  },
});

const integ = new IntegTest(app, 'BundledSymlinksTest', { testCases: [stack] });
integ.assertions.invokeFunction({ functionName: fn.functionName })
  .expect(ExpectedResult.objectLike({ StatusCode: 200, Payload: '"hello from layer"' }));
