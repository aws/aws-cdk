import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { AwsCliLayer } from '../lib';

/**
 * Test verifies that AWS CLI is invoked successfully inside Lambda runtime.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'lambda-layer-awscli-integ-stack');

const layer = new AwsCliLayer(stack, 'AwsCliLayer');

function getHandlerName(runtime: lambda.Runtime): string {
  switch (runtime.family) {
    case lambda.RuntimeFamily.GO:
      return 'main';
    case lambda.RuntimeFamily.JAVA:
      return 'software.amazon.awscdk.lambdalayerawsclitest.Handler';
    case lambda.RuntimeFamily.PYTHON:
      return 'index.handler';
    default:
      throw new Error(`Lambda handler name was not specified for lambda-awscli-layer integration test for runtime '${runtime.name}'.`);
  }
}

for (const architecture of AwsCliLayer.COMPATIBLE_ARCHITECTURES) {
  for (const runtime of AwsCliLayer.COMPATIBLE_RUNTIMES) {
    // Using Custom Resource to trigger Lambda during CloudFormation stack creation.
    const provider = new cr.Provider(stack, `Provider${architecture.name}${runtime.name}`, {
      onEventHandler: new lambda.Function(stack, `Lambda${architecture.name}${runtime.name}`, {
        code: lambda.Code.fromAsset(path.join(__dirname, 'integ.awscli-layer.handler', runtime.name)),
        handler: getHandlerName(runtime),
        architecture,
        runtime,
        layers: [layer],
        logRetention: logs.RetentionDays.ONE_DAY,
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
      }),
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    new cdk.CustomResource(stack, `CustomResource${architecture.name}${runtime.name}`, {
      serviceToken: provider.serviceToken,
    });
  }
}

app.synth();
