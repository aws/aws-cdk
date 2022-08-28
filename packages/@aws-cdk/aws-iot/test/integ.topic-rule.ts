import * as cdk from '@aws-cdk/core';
import * as iot from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20151008("SELECT topic(2) as device_id FROM 'device/+/data'"),
      actions: [
        {
          _bind: () => ({
            configuration: {
              http: { url: 'https://example.com' },
            },
          }),
        },
      ],
    });
  }
}

new TestStack(app, 'test-stack');
app.synth();
