/**
 * Stack verification steps:
 * * put a message
 *   * aws iotevents-data batch-put-message --region=us-east-1 --messages=messageId=(date | md5),inputName=test_input,payload=(echo '{"payload":{"deviceId":"000"}}' | base64)
 */
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as actions from '../../lib';

/**
 * This example will creates the detector model for Device HeartBeat Monitoring.
 *
 * @see https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-examples-dhb.html
 */
class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId'],
    });

    const online = new iotevents.State({
      stateName: 'Online',
      onEnter: [{
        eventName: 'enter-event',
        condition: iotevents.Expression.currentInput(input),
        actions: [
          new actions.SetTimerAction('MyTimer', {
            duration: cdk.Duration.seconds(60),
          }),
        ],
      }],
      onInput: [{
        eventName: 'input-event',
        condition: iotevents.Expression.currentInput(input),
        actions: [
          new actions.ResetTimerAction('MyTimer'),
        ],
      }],
      onExit: [{
        eventName: 'exit-event',
        actions: [
          new actions.ClearTimerAction('MyTimer'),
        ],
      }],
    });
    const offline = new iotevents.State({ stateName: 'Offline' });

    online.transitionTo(offline, { when: iotevents.Expression.timeout('MyTimer') });
    offline.transitionTo(online, { when: iotevents.Expression.currentInput(input) });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorKey: 'payload.deviceId',
      initialState: online,
    });
  }
}

// GIVEN
const app = new cdk.App();
const stack = new TestStack(app, 'iotevents-timer-actions-test-stack');
new IntegTest(app, 'TimerActions', { testCases: [stack] });
app.synth();
