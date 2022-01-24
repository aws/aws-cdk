import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.temperature'],
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
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorModelName: 'test-detector-model',
      initialState: onlineState,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'detector-model-test-stack');
app.synth();
