import sns = require('@aws-cdk/aws-sns');
import { App, Construct, Stack } from '@aws-cdk/core';
import cfn = require('../lib');

class YourNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new sns.Topic(this, 'YourResource');
  }
}

class MyNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new sns.Topic(this, 'MyResource');

    new YourNestedStack(this, 'NestedChild');
  }
}

const app = new App();
const stack = new Stack(app, 'nested-stacks-multi');
new MyNestedStack(stack, 'NestedStack');

app.synth();