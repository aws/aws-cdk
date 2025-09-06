import * as path from 'node:path';
import { App, Duration, Size, Stack, StackProps } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  public canary: synthetics.Canary;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.canary = new synthetics.Canary(this, 'BrowserTypeCanary', {
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_11_0,
      test: synthetics.Test.custom({
        handler: 'canary.handler',
        code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
      }),
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
      maxRetries: 2,
      browserConfigs: [
        synthetics.BrowserType.CHROME,
        synthetics.BrowserType.FIREFOX,
      ],
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryBrowserTypeStack');

new IntegTest(app, 'SyntheticsCanaryBrowserType', {
  testCases: [testStack],
});
