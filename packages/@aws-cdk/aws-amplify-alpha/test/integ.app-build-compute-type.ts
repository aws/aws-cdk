import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as amplify from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new amplify.App(this, 'AppStandard', {
      buildComputeType: amplify.BuildComputeType.STANDARD_8GB,
    });

    new amplify.App(this, 'AppLarge', {
      buildComputeType: amplify.BuildComputeType.LARGE_16GB,
    });

    new amplify.App(this, 'AppXLarge', {
      buildComputeType: amplify.BuildComputeType.XLARGE_72GB,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app-build-compute-type');

new IntegTest(app, 'cdk-amplify-app-build-compute-type-integ', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
