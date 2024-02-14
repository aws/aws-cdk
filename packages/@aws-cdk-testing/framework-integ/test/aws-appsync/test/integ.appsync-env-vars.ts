import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack');

const api = new appsync.GraphqlApi(stack, 'EnvVarTestAPI', {
  name: 'env-var-test-api',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
  authorizationConfig: {
    defaultAuthorization: { authorizationType: appsync.AuthorizationType.IAM },
  },
  environmentVariables: {
    overwrite: 'false',
    purpose: 'testing',
  },
});

const queue = new sqs.Queue(stack, 'Queue');

api.addEnvironmentVariable('after', 'good');
api.addEnvironmentVariable('queue', queue.queueUrl);
api.addEnvironmentVariable('overwrite', 'true');

new IntegTest(app, 'api', {
  testCases: [stack],
});

app.synth();