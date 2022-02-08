import * as iot from '@aws-cdk/aws-iot';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT * FROM 'device/+/data'",
      ),
    });

    topicRule.addAction(
      new actions.IotRepublishMqttAction('${topic()}/republish', {
        qualityOfService: actions.MqttQualityOfService.AT_LEAST_ONCE,
      }),
    );
  }
}

const app = new cdk.App();
new TestStack(app, 'iot-republish-action-test-stack');
app.synth();
