import { App, Duration, Size, Stack, StackProps } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new synthetics.Canary(this, 'CleanupCanary', {
      canaryName: 'cleanup',
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
      }),
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
      provisionedResourceCleanup: true,
    });

    new synthetics.Canary(this, 'NormalCanary', {
      canaryName: 'normal',
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_7_0,
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
      }),
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
      provisionedResourceCleanup: false,
    });
  }
}

const app = new App();

new IntegTest(app, 'SyntheticsCanaryProvisionedResourceCleanup', {
  testCases: [new TestStack(app, 'SyntheticsCanaryProvisionedResourceCleanupStack')],
});
