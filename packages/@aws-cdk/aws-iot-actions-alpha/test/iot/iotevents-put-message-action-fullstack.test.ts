import * as iot from '@aws-cdk/aws-iot-alpha';
import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as actions from '../../lib';

test('full stack with iotevents put message action synthesizes correctly', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const logGroup = new logs.LogGroup(stack, 'logs', { removalPolicy: cdk.RemovalPolicy.DESTROY });
  const topicRule = new iot.TopicRule(stack, 'TopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
    errorAction: new actions.CloudWatchLogsAction(logGroup),
  });

  const input = new iotevents.Input(stack, 'MyInput', {
    attributeJsonPaths: ['payload.deviceId'],
  });

  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
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
    new actions.IotEventsPutMessageAction(input, { batchMode: true }),
  );

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::IoTEvents::Input', 1);
  template.resourceCountIs('AWS::IoTEvents::DetectorModel', 1);
  template.resourceCountIs('AWS::Logs::LogGroup', 1);
  template.hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Sql: "SELECT * FROM 'device/+/data'",
      Actions: [{
        IotEvents: {
          InputName: { Ref: 'MyInput08947B23' },
          BatchMode: true,
          RoleArn: { 'Fn::GetAtt': ['TopicRuleTopicRuleActionRole246C4F77', 'Arn'] },
        },
      }],
      ErrorAction: {
        CloudwatchLogs: {
          LogGroupName: { Ref: 'logs0B6081B1' },
          RoleArn: { 'Fn::GetAtt': ['TopicRuleTopicRuleActionRole246C4F77', 'Arn'] },
        },
      },
    },
  });
});
