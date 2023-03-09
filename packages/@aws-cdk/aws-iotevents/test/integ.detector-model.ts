import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as iotevents from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
    });

    const onlineState = new iotevents.State({
      stateName: 'online',
      onEnter: [{
        eventName: 'test-event',
        // meaning `condition: 'currentInput("test_input") && $input.test_input.payload.temperature == 31.5'`
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
    const offlineState = new iotevents.State({
      stateName: 'offline',
    });

    // 1st => 2nd
    onlineState.transitionTo(offlineState, {
      when: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('12'),
      ),
    });
    // 2st => 1st
    offlineState.transitionTo(onlineState, {
      when: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('21'),
      ),
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorModelName: 'test-detector-model',
      description: 'test-detector-model-description',
      evaluationMethod: iotevents.EventEvaluation.SERIAL,
      detectorKey: 'payload.deviceId',
      initialState: onlineState,
    });
  }
}

const app = new cdk.App();
new IntegTest(app, 'cdk-integ-detector-model-test-stack', {
  testCases: [new TestStack(app, 'detector-model-test-stack')],
});
