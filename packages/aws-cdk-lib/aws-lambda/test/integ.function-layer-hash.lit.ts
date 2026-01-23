import * as cdk from '../../core';
import * as lambda from '../lib';
import * as cxapi from '../../cx-api';

/**
 * Integration test to verify that function hash calculation correctly handles
 * imported layers. This test verifies the fix for issue #36713 where adding
 * a layer to one function would incorrectly change the hash of another function
 * when using imported layers with the recognizeLayerVersion feature flag.
 */
const app = new cdk.App({
  context: {
    [cxapi.LAMBDA_RECOGNIZE_LAYER_VERSION]: true,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-function-layer-hash');

/// !show
// Create two imported layers
const layer1 = lambda.LayerVersion.fromLayerVersionArn(
  stack, 'Layer1',
  'arn:aws:lambda:us-east-1:123456789012:layer:my-layer-1:1'
);

const layer2 = lambda.LayerVersion.fromLayerVersionArn(
  stack, 'Layer2',
  'arn:aws:lambda:us-east-1:123456789012:layer:my-layer-2:1'
);

// Function A with layer1
const functionA = new lambda.Function(stack, 'FunctionA', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => { return { statusCode: 200 }; }'),
  layers: [layer1],
});

// Function B with layer2
const functionB = new lambda.Function(stack, 'FunctionB', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => { return { statusCode: 200 }; }'),
  layers: [layer2],
});

// Create versions for both functions to verify hash calculation
// The hash should only include layers attached to each specific function
functionA.currentVersion;
functionB.currentVersion;
/// !hide

app.synth();
