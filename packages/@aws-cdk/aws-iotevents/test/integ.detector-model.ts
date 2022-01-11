import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new iotevents.Input(this, 'MyInput', {
      inputName: 'test_input',
      attributeJsonPaths: ['payload.temperature'],
    });
  }
}

new TestStack(app, 'test-stack');
app.synth();
