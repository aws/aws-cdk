/// !cdk-integ pragma:ignore-assets
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import * as iot from '../../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      topicRulePayload: {
        sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
      },
    });

    const alarm = new cloudwatch.Alarm(this, 'MyAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'iot-test',
        metricName: 'test',
      }),
      threshold: 0,
      evaluationPeriods: 1,
    });
    topicRule.addAction(new iot.CloudwatchAlarmAction(
      alarm,
      cloudwatch.AlarmState.ALARM,
    ));
  }
}

new TestStack(app, 'test-stack');
app.synth();
