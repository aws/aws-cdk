import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as amplify from '../lib';

class TestStack extends Stack {
  readonly standardApp: amplify.App;
  readonly largeApp: amplify.App;
  readonly xLargeApp: amplify.App;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.standardApp = new amplify.App(this, 'AppStandard', {
      buildComputeType: amplify.BuildComputeType.STANDARD_8GB,
    });

    this.largeApp = new amplify.App(this, 'AppLarge', {
      buildComputeType: amplify.BuildComputeType.LARGE_16GB,
    });

    this.xLargeApp = new amplify.App(this, 'AppXLarge', {
      buildComputeType: amplify.BuildComputeType.XLARGE_72GB,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app-build-compute-type');

const test = new IntegTest(app, 'cdk-amplify-app-build-compute-type-integ', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

test.assertions.awsApiCall('amplify', 'GetAppCommand', {
  appId: stack.standardApp.appId,
})
  .expect(ExpectedResult.objectLike({
    app: {
      jobConfig: {
        buildComputeType: 'STANDARD_8GB',
      },
    },
  }));

test.assertions.awsApiCall('amplify', 'GetAppCommand', {
  appId: stack.largeApp.appId,
})
  .expect(ExpectedResult.objectLike({
    app: {
      jobConfig: {
        buildComputeType: 'LARGE_16GB',
      },
    },
  }));

test.assertions.awsApiCall('amplify', 'GetAppCommand', {
  appId: stack.xLargeApp.appId,
})
  .expect(ExpectedResult.objectLike({
    app: {
      jobConfig: {
        buildComputeType: 'XLARGE_72GB',
      },
    },
  }));
