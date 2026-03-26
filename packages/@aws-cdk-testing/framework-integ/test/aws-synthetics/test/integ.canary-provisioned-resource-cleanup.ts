import type { StackProps } from 'aws-cdk-lib/core';
import { App, Duration, Size, Stack } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new synthetics.Canary(this, 'CleanupCanary', {
      canaryName: 'cleanup',
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_9_1,
      test: synthetics.Test.custom({
        handler: 'index.handler',
        code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\\'hello world\\');
          };`),
      }),
      memory: Size.mebibytes(2048),
      timeout: Duration.minutes(4),
      provisionedResourceCleanup: true,
    });
  }
}

const app = new App({ context: { '@aws-cdk/core:disableGitSource': true } });
const testStack = new TestStack(app, 'SyntheticsCanaryProvisionedResourceCleanupStack');

new IntegTest(app, 'SyntheticsCanaryProvisionedResourceCleanup', {
  testCases: [testStack],
});
