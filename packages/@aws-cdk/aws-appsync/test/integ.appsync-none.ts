import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as appsync from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'NoneAPI', {
  name: 'NoneAPI',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.none.graphql')),
});

api.addNoneDataSource('NoneDS', {
  name: cdk.Lazy.string({ produce(): string { return 'NoneDS'; } }),
});

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();