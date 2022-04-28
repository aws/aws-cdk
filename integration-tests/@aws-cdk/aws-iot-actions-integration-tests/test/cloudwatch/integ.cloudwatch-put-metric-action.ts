import * as iot from '@aws-cdk/aws-iot';
import * as actions from '@aws-cdk/aws-iot-actions';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, namespace, unit, value, timestamp FROM 'device/+/data'"),
    });

    topicRule.addAction(new actions.CloudWatchPutMetricAction({
      metricName: '${topic(2)}',
      metricNamespace: '${namespace}',
      metricUnit: '${unit}',
      metricValue: '${value}',
      metricTimestamp: '${timestamp}',
    }));
  }
}

new TestStack(app, 'test-stack');
app.synth();
