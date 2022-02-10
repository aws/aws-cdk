/**
 * Stack verification steps:
 * * put a message
 *   * aws iotevents-data batch-put-message --messages=messageId=(date | md5),inputName=test_input,payload=(echo '{"payload":{"temperature":31.9,"deviceId":"000"}}' | base64)
 * * describe the detector
 *   * aws iotevents-data describe-detector --detector-model-name test-detector-model --key-value=000
 * * verify `stateName` and `variables` of the detector
 */
import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
    });

    const inputted = iotevents.Expression.currentInput(input);
    const temperatureAttr = iotevents.Expression.inputAttribute(input, 'payload.temperature');
    const temperatureEqual = (temperature: string) => iotevents.Expression.eq(
      temperatureAttr,
      iotevents.Expression.fromString(temperature),
    );

    const setTemperatureAction: iotevents.IAction = {
      renderActionConfig: () => ({
        configuration: {
          setVariable: { variableName: 'temperature', value: temperatureAttr.evaluate() },
        },
      }),
    };

    const onlineState = new iotevents.State({
      stateName: 'online',
      onEnter: [{
        eventName: 'test-enter-event',
        // meaning `condition: 'currentInput("test_input") && $input.test_input.payload.temperature == 31.5'`
        condition: iotevents.Expression.and(inputted, temperatureEqual('31.5')),
        actions: [setTemperatureAction],
      }],
      onInput: [{
        eventName: 'test-input-event',
        condition: temperatureEqual('31.6'),
        actions: [setTemperatureAction],
      }],
      onExit: [{
        eventName: 'test-exit-event',
        condition: temperatureEqual('31.7'),
        actions: [setTemperatureAction],
      }],
    });
    const offlineState = new iotevents.State({
      stateName: 'offline',
    });

    onlineState.transitionTo(offlineState, { when: temperatureEqual('12'), executing: [setTemperatureAction] });
    offlineState.transitionTo(onlineState, { when: temperatureEqual('21') });

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
new TestStack(app, 'detector-model-test-stack');
app.synth();
