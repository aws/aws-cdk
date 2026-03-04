import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iotevents from '../lib';

test('full stack with detector model synthesizes correctly', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const input = new iotevents.Input(stack, 'MyInput', {
    inputName: 'test_input',
    attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
  });

  const onlineState = new iotevents.State({
    stateName: 'online',
    onEnter: [{
      eventName: 'test-event',
      condition: iotevents.Expression.and(
        iotevents.Expression.currentInput(input),
        iotevents.Expression.eq(
          iotevents.Expression.inputAttribute(input, 'payload.temperature'),
          iotevents.Expression.fromString('31.5'),
        ),
      ),
    }],
    onInput: [{
      eventName: 'test-input-event',
      condition: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('31.6'),
      ),
    }],
    onExit: [{
      eventName: 'test-exit-event',
      condition: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('31.7'),
      ),
    }],
  });
  const offlineState = new iotevents.State({ stateName: 'offline' });

  onlineState.transitionTo(offlineState, {
    when: iotevents.Expression.eq(
      iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      iotevents.Expression.fromString('12'),
    ),
  });
  offlineState.transitionTo(onlineState, {
    when: iotevents.Expression.eq(
      iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      iotevents.Expression.fromString('21'),
    ),
  });

  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    detectorModelName: 'test-detector-model',
    description: 'test-detector-model-description',
    evaluationMethod: iotevents.EventEvaluation.SERIAL,
    detectorKey: 'payload.deviceId',
    initialState: onlineState,
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::IoTEvents::Input', 1);
  template.resourceCountIs('AWS::IoTEvents::DetectorModel', 1);
  template.hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelName: 'test-detector-model',
    DetectorModelDescription: 'test-detector-model-description',
    EvaluationMethod: 'SERIAL',
    Key: 'payload.deviceId',
    DetectorModelDefinition: {
      InitialStateName: 'online',
    },
  });

  // Verify states, events, and transitions
  const dm = Object.values(template.toJSON().Resources).find(
    (r: any) => r.Type === 'AWS::IoTEvents::DetectorModel',
  ) as any;
  const states = dm.Properties.DetectorModelDefinition.States;
  const online = states.find((s: any) => s.StateName === 'online');
  const offline = states.find((s: any) => s.StateName === 'offline');

  expect(online.OnEnter.Events[0].EventName).toBe('test-event');
  expect(online.OnInput.Events[0].EventName).toBe('test-input-event');
  expect(online.OnExit.Events[0].EventName).toBe('test-exit-event');
  expect(online.OnInput.TransitionEvents[0]).toEqual(expect.objectContaining({ EventName: 'online_to_offline', NextState: 'offline' }));
  expect(offline.OnInput.TransitionEvents[0]).toEqual(expect.objectContaining({ EventName: 'offline_to_online', NextState: 'online' }));
});
