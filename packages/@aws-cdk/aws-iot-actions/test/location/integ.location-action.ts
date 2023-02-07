import * as iot from '@aws-cdk/aws-iot';
import { CfnTracker } from '@aws-cdk/aws-location';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as actions from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-location-action-stack');

const topicRule = new iot.TopicRule(stack, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT * FROM 'device/+/data'",
  ),
});

const tracker = new CfnTracker(stack, 'MyTracker', {
  trackerName: 'myTracker',
});

topicRule.addAction(new actions.LocationAction(tracker, {
  deviceId: '${deviceId}',
  latitude: '${latitude}',
  longitude: '${longitude}',
  timestamp: {
    unit: actions.LocationTimestampUnit.SECONDS,
    value: '${ts}',
  },
}));

new integ.IntegTest(app, 'location-integtest', {
  testCases: [stack],
});

app.synth();
