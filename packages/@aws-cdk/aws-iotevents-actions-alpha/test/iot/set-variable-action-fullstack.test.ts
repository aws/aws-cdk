import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as actions from '../../lib';

test('full stack with set-variable action synthesizes correctly', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const input = new iotevents.Input(stack, 'MyInput', {
    inputName: 'test_input',
    attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
  });

  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    detectorKey: 'payload.deviceId',
    initialState: new iotevents.State({
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
    }),
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::IoTEvents::Input', 1);
  template.resourceCountIs('AWS::IoTEvents::DetectorModel', 1);
  template.hasResourceProperties('AWS::IoTEvents::Input', {
    InputName: 'test_input',
    InputDefinition: {
      Attributes: [
        { JsonPath: 'payload.deviceId' },
        { JsonPath: 'payload.temperature' },
      ],
    },
  });
  template.hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      States: [{
        StateName: 'MyState',
        OnEnter: {
          Events: [{
            EventName: 'enter-event',
            Actions: [{
              SetVariable: {
                VariableName: 'MyVariable',
                Value: {
                  'Fn::Join': ['', [
                    '$input.',
                    { Ref: 'MyInput08947B23' },
                    '.payload.temperature',
                  ]],
                },
              },
            }],
          }],
        },
      }],
    },
    Key: 'payload.deviceId',
  });
});
