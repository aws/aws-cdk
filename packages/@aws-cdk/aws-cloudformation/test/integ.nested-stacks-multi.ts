/// !cdk-integ pragma:ignore-assets
import * as sns from '@aws-cdk/aws-sns';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cfn from '../lib';

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
