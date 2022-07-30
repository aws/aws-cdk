import * as iot from '@aws-cdk/aws-iot';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  public readonly detectorModelName: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'logs', { removalPolicy: cdk.RemovalPolicy.DESTROY });
    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT * FROM 'device/+/data'",
      ),
      errorAction: new actions.CloudWatchLogsAction(logGroup),
    });

    const input = new iotevents.Input(this, 'MyInput', {
      attributeJsonPaths: ['payload.deviceId'],
    });

    const detectorModel = new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorKey: 'payload.deviceId',
      initialState: new iotevents.State({
        stateName: 'initialState',
        onEnter: [{
          eventName: 'enter',
          condition: iotevents.Expression.currentInput(input),
        }],
      }),
    });

    topicRule.addAction(
      new actions.IotEventsPutMessageAction(input, {
        batchMode: true,
      }),
    );

    this.detectorModelName = detectorModel.detectorModelName;
  }
}

// App
const app = new cdk.App();
const stack = new TestStack(app, 'iotevents-put-message-action-test-stack');
const integ = new IntegTest(app, 'iotevents', { testCases: [stack] });

// WHEN
const apiCallOfPublish = integ.assertions.awsApiCall('IotData', 'publish', {
  topic: 'device/my-device/data',
  payload: JSON.stringify([
    { payload: { deviceId: '001' } },
    { payload: { deviceId: '002' } },
  ]),
});

const apiCallOfListDetectors = integ.assertions.awsApiCall('IoteventsData', 'listDetectors', {
  detectorModelName: stack.detectorModelName,
});

apiCallOfListDetectors.node.addDependency(apiCallOfPublish);

// THEN
apiCallOfListDetectors.expect(ExpectedResult.objectLike({
  detectorSummaries: [
    ExpectedResult.objectLike({ keyValue: '001' }),
    ExpectedResult.objectLike({ keyValue: '002' }),
  ],
}));

app.synth();
