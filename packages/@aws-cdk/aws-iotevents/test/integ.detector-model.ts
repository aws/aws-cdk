import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.temperature'],
    });

    const onlineState = new iotevents.State({
      stateName: 'online',
      onEnterEvents: [{
        eventName: 'test-event',
        condition: `currentInput("${input.inputName}")`,
      }],
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorModelName: 'test-detector-model',
      initialState: onlineState,
    });
  }
}

new TestStack(app, 'test-stack');
app.synth();
