import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
    });

    const firstState = new iotevents.State({
      stateName: 'firstState',
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
    });
    const secondState = new iotevents.State({
      stateName: 'secondState',
    });

    // 1st => 2nd
    firstState.transitionTo({
      eventName: 'firstToSecond',
      nextState: secondState,
      condition: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('12'),
      ),
    });
    // 2st => 1st
    secondState.transitionTo({
      eventName: 'secondToFirst',
      nextState: firstState,
      condition: iotevents.Expression.eq(
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        iotevents.Expression.fromString('21'),
      ),
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorModelName: 'test-detector-model',
      description: 'test-detector-model-description',
      evaluationMethod: iotevents.EventEvaluation.SERIAL,
      detectorKey: 'payload.deviceId',
      initialState: firstState,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'detector-model-test-stack');
app.synth();
