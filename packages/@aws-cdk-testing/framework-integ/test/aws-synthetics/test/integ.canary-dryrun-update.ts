import * as path from 'node:path';
import { App, Duration, Size, Stack, StackProps } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  public canary: synthetics.Canary;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.canary = new synthetics.Canary(this, 'DryRunCanary', {
      canaryName: 'dryrun',
      runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_5_1,
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
      }),
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
      dryRunAndUpdate: true,
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryDryRunAndUpdateStack');

new IntegTest(app, 'SyntheticsCanaryDryRunAndUpdate', {
  testCases: [testStack],
});
