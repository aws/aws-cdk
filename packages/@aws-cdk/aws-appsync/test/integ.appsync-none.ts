/// !cdk-integ *

import * as cdk from '@aws-cdk/core';
import * as appsync from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'NoneAPI', {
  name: 'NoneAPI',
});

api.addNoneDataSource('NoneDS', {
  name: cdk.Lazy.string({ produce(): string { return 'NoneDS'; } }),
});

app.synth();