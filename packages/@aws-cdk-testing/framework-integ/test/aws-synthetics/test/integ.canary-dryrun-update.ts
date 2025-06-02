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
      dryRunAndUpdate: true,
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'SyntheticsCanaryDryRunAndUpdateStack');

new IntegTest(app, 'SyntheticsCanaryDryRunAndUpdate', {
  testCases: [testStack],
});
