#!/usr/bin/env node
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from 'aws-cdk-lib/cx-api';

/**
 * This integration test demonstrates that adding a layer to one function
 * does not affect the version hash of unrelated functions in the same stack.
 *
 * This validates the fix for issue #36713 where fn._layers incorrectly contained
 * ALL layers in the stack, causing unrelated functions' hashes to change.
 */

const app = new cdk.App({
  context: {
    [LAMBDA_RECOGNIZE_LAYER_VERSION]: true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-layer-hash-isolation');

// Create a layer
const layer = new lambda.LayerVersion(stack, 'MyLayer', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'layer-code')),
  compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
  description: 'Test layer for hash isolation',
});

// Create Function 1 without any layers
const fn1 = new lambda.Function(stack, 'Function1', {
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Function 1" });'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
  description: 'Function without layers',
});

// Get Function 1's version
const fn1Version = fn1.currentVersion;

// Create Function 2 with the layer
const fn2 = new lambda.Function(stack, 'Function2', {
  code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Function 2" });'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
  layers: [layer],
  description: 'Function with layer',
});

// Get Function 2's version
const fn2Version = fn2.currentVersion;

// Output version ARNs to verify they are created correctly
new cdk.CfnOutput(stack, 'Function1VersionArn', {
  value: fn1Version.functionArn,
  description: 'Version ARN of Function 1 (no layers)',
});

new cdk.CfnOutput(stack, 'Function2VersionArn', {
  value: fn2Version.functionArn,
  description: 'Version ARN of Function 2 (with layer)',
});

new IntegTest(app, 'LambdaLayerHashIsolation', {
  testCases: [stack],
});

app.synth();
