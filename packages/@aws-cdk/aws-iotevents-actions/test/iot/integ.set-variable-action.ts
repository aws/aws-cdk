/**
 * Stack verification steps:
 * * put a message
 *   * aws iotevents-data batch-put-message --messages=messageId=(date | md5),inputName=test_input,payload=(echo '{"payload":{"temperature":31.9,"deviceId":"000"}}' | base64)
 */
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
    });

    const state = new iotevents.State({
      stateName: 'MyState',
      onEnter: [{
        eventName: 'enter-event',
        condition: iotevents.Expression.currentInput(input),
        actions: [
          new actions.SetVariableAction(
            'MyVariable',
            iotevents.Expression.inputAttribute(input, 'payload.temperature'),
          ),
        ],
      }],
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorKey: 'payload.deviceId',
      initialState: state,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'iotevents-set-variable-action-test-stack');
app.synth();
