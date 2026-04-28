import * as path from 'path';
import { App, Aspects, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from 'aws-cdk-lib/cx-api';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { Code, Function, FunctionVersionUpgrade, LayerVersion } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create two layers
    const layer1 = new LayerVersion(this, 'Layer1', {
      code: Code.fromAsset(path.join(__dirname, 'layer-code'), { exclude: ['*.ts'] }),
      compatibleRuntimes: [STANDARD_NODEJS_RUNTIME],
      description: 'Layer 1 for function A',
    });

    const layer2 = new LayerVersion(this, 'Layer2', {
      code: Code.fromAsset(path.join(__dirname, 'layer-code'), { exclude: ['*.ts'] }),
      compatibleRuntimes: [STANDARD_NODEJS_RUNTIME],
      description: 'Layer 2 for function B',
    });

    // Function A with layer1
    const functionA = new Function(this, 'FunctionA', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = async () => { return { statusCode: 200 }; }'),
      layers: [layer1],
    });

    // Function B with layer2
    const functionB = new Function(this, 'FunctionB', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = async () => { return { statusCode: 200 }; }'),
      layers: [layer2],
    });

    // Create versions for both functions to verify hash calculation
    // The hash should only include layers attached to each specific function
    functionA.currentVersion;
    functionB.currentVersion;

    // Changes the function description when the feature flag is present
    // to validate the changed function hash.
    Aspects.of(this).add(new FunctionVersionUpgrade(LAMBDA_RECOGNIZE_LAYER_VERSION));
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new IntegTest(app, 'IntegTest', {
  testCases: [
    new TestStack(app, 'aws-lambda-function-layer-hash'),
  ],
});
