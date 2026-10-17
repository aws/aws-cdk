import * as iot from '@aws-cdk/aws-iot-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration, Size } from 'aws-cdk-lib';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  public readonly topicRuleName: string;

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

    const topicRuleWithBatch = new iot.TopicRule(this, 'TopicRuleWithBatch', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT topic(2) as device_id FROM 'device/+/batch'",
      ),
    });

    topicRuleWithBatch.addAction(
      new actions.HttpsAction('https://example.com/batch', {
        batchConfig: {
          maxBatchOpenDuration: Duration.millis(100),
          maxBatchSize: 5,
          maxBatchSizeBytes: Size.kibibytes(1),
        },
      }),
    );

    this.topicRuleName = topicRuleWithBatch.topicRuleName;
  }
}

const stack = new TestStack(app, 'IoTHttpsActionTestStack');
const integ = new IntegTest(app, 'IoTHttpsAction', {
  testCases: [stack],
});

integ.assertions.awsApiCall('IoT', 'getTopicRule', {
  ruleName: stack.topicRuleName,
}).expect(
  ExpectedResult.objectLike({
    rule: {
      actions: [
        {
          http: {
            url: 'https://example.com/batch',
            enableBatching: true,
            batchConfig: {
              maxBatchOpenMs: 100,
              maxBatchSize: 5,
              maxBatchSizeBytes: 1024,
            },
          },
        },
      ],
    },
  }),
);
