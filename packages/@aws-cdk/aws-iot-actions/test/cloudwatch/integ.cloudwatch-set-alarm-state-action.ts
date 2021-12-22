import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iot from '@aws-cdk/aws-iot';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const metric = new cloudwatch.Metric({
      namespace: 'MyNamespace',
      metricName: 'MyMetric',
      dimensions: { MyDimension: 'MyDimensionValue' },
    });
    const alarm = new cloudwatch.Alarm(this, 'MyAlarm', {
      metric: metric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });
    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
    });

    topicRule.addAction(new actions.CloudWatchSetAlarmStateAction(alarm, {
      alarmStateToSet: cloudwatch.AlarmState.ALARM,
    }));
  }
}

new TestStack(app, 'test-stack');
app.synth();