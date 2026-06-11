import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as actions from '../../lib';

test('full stack with lambda invoke action synthesizes correctly', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const input = new iotevents.Input(stack, 'MyInput', {
    inputName: 'test_input',
    attributeJsonPaths: ['payload.deviceId'],
  });
  const func = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = (event) => { console.log(event); };'),
  });

  new iotevents.DetectorModel(stack, 'MyDetectorModel', {
    detectorKey: 'payload.deviceId',
    initialState: new iotevents.State({
      stateName: 'MyState',
      onEnter: [{
        eventName: 'test-event',
        condition: iotevents.Expression.currentInput(input),
        actions: [new actions.LambdaInvokeAction(func)],
      }],
    }),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::IoTEvents::Input', { InputName: 'test_input' });
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: 'nodejs20.x',
  });
  template.hasResourceProperties('AWS::IoTEvents::DetectorModel', {
    DetectorModelDefinition: {
      InitialStateName: 'MyState',
      States: [{
        StateName: 'MyState',
        OnEnter: {
          Events: [{
            EventName: 'test-event',
            Actions: [{ Lambda: { FunctionArn: { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] } } }],
          }],
        },
      }],
    },
    Key: 'payload.deviceId',
  });
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'lambda:InvokeFunction',
          Effect: 'Allow',
          Resource: [
            { 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] },
            { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['MyFunction3BAA72D1', 'Arn'] }, ':*']] },
          ],
        },
      ],
    },
  });
});
