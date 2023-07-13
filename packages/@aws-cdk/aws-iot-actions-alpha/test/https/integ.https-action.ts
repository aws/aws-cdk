import * as iot from '@aws-cdk/aws-iot-alpha';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
      ),
    });

    topicRule.addAction(
      new actions.HttpsAction('https://example.com/endpoint', {
        confirmationUrl: 'https://example.com',
        headers: [
          { key: 'key0', value: 'value0' },
          { key: 'key1', value: 'value1' },
        ],
        auth: { serviceName: 'serviceName', signingRegion: 'us-east-1' },
      }),
    );
  }
}

const stack = new TestStack(app, 'IoTHttpsActionTestStack');
new IntegTest(app, 'IoTHttpsAction', {
  testCases: [stack],
});

app.synth();
