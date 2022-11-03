import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as iot from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new iot.Thing(this, 'Thing', {
      attributes: {
        attr1: 'attr1-value',
        attr2: 'attr2-value',
        attr3: 'attr3-value',
      },
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'thing-test-stack');

new integ.IntegTest(app, 'Thing', {
  testCases: [testCase],
});

app.synth();
