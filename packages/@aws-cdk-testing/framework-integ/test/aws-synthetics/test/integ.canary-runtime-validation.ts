import * as path from 'node:path';
import { App, Duration, Size, Stack, StackProps } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  public puppeteer11RootCanary: synthetics.Canary;
  public puppeteer11NodeModulesCanary: synthetics.Canary;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Test puppeteer 11.0+ with root-level files only
    this.puppeteer11RootCanary = new synthetics.Canary(this, 'Puppeteer11RootCanary', {
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_11_0,
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries-runtime-validation', 'root-only')),
      }),
      memory: Size.mebibytes(1024),
      timeout: Duration.minutes(2),
    });

    // Test puppeteer 11.0+ also supports nodejs/node_modules structure
    this.puppeteer11NodeModulesCanary = new synthetics.Canary(this, 'Puppeteer11NodeModulesCanary', {
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_11_0,
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
      }),
      memory: Size.mebibytes(1024),
      timeout: Duration.minutes(2),
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryRuntimeValidationStack');

new IntegTest(app, 'SyntheticsCanaryRuntimeValidation', {
  testCases: [testStack],
});
