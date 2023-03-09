import * as sns from '@aws-cdk/aws-sns';
import { App, NestedStack, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

/* eslint-disable @aws-cdk/no-core-construct */

class YourNestedStack extends NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new sns.Topic(this, 'YourResource');
  }
}

class MyNestedStack extends NestedStack {
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
