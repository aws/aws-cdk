import { App, Duration, Size, Stack, StackProps } from 'aws-cdk-lib/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as synthetics from 'aws-cdk-lib/aws-synthetics';

class TestStack extends Stack {
  public cleanupCanary: synthetics.Canary;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.cleanupCanary = new synthetics.Canary(this, 'CleanupCanary', {
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
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryProvisionedResourceCleanupStack');

const integ = new IntegTest(app, 'SyntheticsCanaryProvisionedResourceCleanup', {
  testCases: [testStack],
});

const getCleanupCanaryInfo = integ.assertions.awsApiCall('synthetics', 'getCanary', {
  Name: testStack.cleanupCanary.canaryName,
});
const stopCanary = integ.assertions.awsApiCall('synthetics', 'stopCanary', {
  Name: testStack.cleanupCanary.canaryName,
}).waitForAssertions();
const deleteCanary = integ.assertions.awsApiCall('synthetics', 'deleteCanary', {
  Name: testStack.cleanupCanary.canaryName,
}).waitForAssertions();
const getLayer = integ.assertions.awsApiCall('lambda', 'listLayers');
getLayer.expect(ExpectedResult.objectLike({
  // The canary should have been deleted, so it should not have any layers
  Layers: [],
}));

getCleanupCanaryInfo.next(stopCanary).next(deleteCanary).next(getLayer).waitForAssertions();
