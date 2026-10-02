import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as actions from '../../lib';

test('full stack with timer actions synthesizes correctly', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const input = new iotevents.Input(stack, 'MyInput', {
    inputName: 'test_input',
    attributeJsonPaths: ['payload.deviceId'],
  });

  const online = new iotevents.State({
    stateName: 'Online',
    onEnter: [{
      eventName: 'enter-event',
      condition: iotevents.Expression.currentInput(input),
      actions: [new actions.SetTimerAction('MyTimer', actions.TimerDuration.fromDuration(cdk.Duration.seconds(60)))],
    }],
    onInput: [{
      eventName: 'input-event',
      condition: iotevents.Expression.currentInput(input),
      actions: [new actions.ResetTimerAction('MyTimer')],
    }],
    onExit: [{
      eventName: 'exit-event',
      actions: [new actions.ClearTimerAction('MyTimer')],
    }],
  });
  const offline = new iotevents.State({ stateName: 'Offline' });

  online.transitionTo(offline, { when: iotevents.Expression.timeout('MyTimer') });
  offline.transitionTo(online, { when: iotevents.Expression.currentInput(input) });

  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    detectorKey: 'payload.deviceId',
    initialState: online,
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::IoTEvents::Input', 1);
  template.resourceCountIs('AWS::IoTEvents::DetectorModel', 1);
  template.hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      InitialStateName: 'Online',
    },
    Key: 'payload.deviceId',
  });

  // Verify Online state has all 3 timer actions and a transition
  const dm = Object.values(template.toJSON().Resources).find(
    (r: any) => r.Type === 'AWS::IoTEvents::DetectorModel',
  ) as any;
  const states = dm.Properties.DetectorModelDefinition.States;
  const onlineState = states.find((s: any) => s.StateName === 'Online');
  const offlineState = states.find((s: any) => s.StateName === 'Offline');

  expect(onlineState.OnEnter.Events[0].Actions[0].SetTimer).toEqual({ TimerName: 'MyTimer', DurationExpression: '60' });
  expect(onlineState.OnInput.Events[0].Actions[0].ResetTimer).toEqual({ TimerName: 'MyTimer' });
  expect(onlineState.OnExit.Events[0].Actions[0].ClearTimer).toEqual({ TimerName: 'MyTimer' });
  expect(onlineState.OnInput.TransitionEvents[0]).toEqual(expect.objectContaining({ EventName: 'Online_to_Offline', NextState: 'Offline' }));
  expect(offlineState.OnInput.TransitionEvents[0]).toEqual(expect.objectContaining({ EventName: 'Offline_to_Online', NextState: 'Online' }));
});
