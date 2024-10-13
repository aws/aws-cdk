import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iot from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const targetTopic = new sns.Topic(this, 'Topic');

    new iot.AccountAuditConfiguration(this, 'AuditConfiguration', {
      targetTopic,
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'IotAuditConfigurationTestStack');

new integ.IntegTest(app, 'IotAuditConfigurationTest', {
  testCases: [testCase],
});
