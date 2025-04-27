import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';

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
