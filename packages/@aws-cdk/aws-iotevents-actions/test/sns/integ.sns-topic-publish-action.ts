/**
 * Stack verification steps:
 * * subscribe the topic
 *   * aws sns subscribe --topic-arn "arn:aws:sns:<region>:<account>:<topic-name>" --protocol email --notification-endpoint <email-addr>
 *   * confirm subscription from email
 * * put a message
 *   * aws iotevents-data batch-put-message --messages=messageId=(date | md5),inputName=test_input,payload=(echo '{"payload":{"temperature":31.9,"deviceId":"000"}}' | base64)
 * * verify that an email was sent from the SNS
 */
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId'],
    });
    const topic = new sns.Topic(this, 'MyTopic');

    const state = new iotevents.State({
      stateName: 'MyState',
      onEnter: [{
        eventName: 'test-event',
        condition: iotevents.Expression.currentInput(input),
      }],
      onInput: [{
        eventName: 'test-input-event',
        actions: [new actions.SNSTopicPublishAction(topic)],
      }],
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorKey: 'payload.deviceId',
      initialState: state,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'sns-topic-publish-action-test-stack');
app.synth();
