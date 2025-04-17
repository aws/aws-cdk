import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iot from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new iot.Logging(this, 'Logging', {
      logLevel: iot.LogLevel.DEBUG,
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'IotLoggingTestStack');
new integ.IntegTest(app, 'IotLoggingTest', {
  testCases: [testCase],
});
