/**
 * Stack verification steps:
 * * put a message
 *   * aws iotevents-data batch-put-message --messages=messageId=(date | md5),inputName=test_input,payload=(echo '{"payload":{"temperature":31.9,"deviceId":"000"}}' | base64)
 * * verify that the lambda logs be put
 */
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const input = new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.deviceId'],
    });
    const func = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = (event) => {
          console.log("It is test for lambda action of AWS IoT Rule.", event);
        };`,
      ),
    });

    const state = new iotevents.State({
      stateName: 'MyState',
      onEnter: [{
        eventName: 'test-event',
        condition: iotevents.Expression.currentInput(input),
        actions: [new actions.LambdaInvokeAction(func)],
      }],
    });

    new iotevents.DetectorModel(this, 'MyDetectorModel', {
      detectorKey: 'payload.deviceId',
      initialState: state,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'lambda-invoke-action-test-stack');
app.synth();
