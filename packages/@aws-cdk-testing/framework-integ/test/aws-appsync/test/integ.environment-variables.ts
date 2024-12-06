import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'AppSyncEnvironmentVariables');

const api = new appsync.GraphqlApi(stack, 'Api', {
  name: 'Api',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.js-resolver.graphql')),
  environmentVariables: {
    EnvKey1: 'non-empty-1',
  },
});

api.addEnvironmentVariable('EnvKey2', 'non-empty-2');

new IntegTest(app, 'IntegTestEnvironmentVariables', { testCases: [stack] });

app.synth();
