/// !cdk-integ pragma:ignore-assets
import * as sns from '@aws-cdk/aws-sns';
import { App, Stack } from '@aws-cdk/core';
import * as cfn from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/* eslint-disable cdk/no-core-construct */

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
