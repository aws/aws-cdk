import * as path from 'node:path';
import type { StackProps } from 'aws-cdk-lib/core';
import { App, Duration, Size, Stack } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  public canary: synthetics.Canary;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.canary = new synthetics.Canary(this, 'RetryCanary', {
      canaryName: 'retry',
      runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_5_1,
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
      }),
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
      maxRetries: 2,
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryRetryStack');

new IntegTest(app, 'SyntheticsCanaryRetry', {
  testCases: [testStack],
});
