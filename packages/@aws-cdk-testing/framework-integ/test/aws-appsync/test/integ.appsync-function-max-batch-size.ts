import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-appsync-function-max-batch-size');

const api = new appsync.GraphqlApi(stack, 'LambdaAPI', {
  name: 'LambdaAPI',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.lambda.graphql')),
});

const func = new lambda.Function(stack, 'func', {
  code: lambda.Code.fromAsset(path.join(__dirname, 'verify', 'lambda-tutorial')),
  handler: 'lambda-tutorial.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const lambdaDS = api.addLambdaDataSource('LambdaDS', func);

lambdaDS.createFunction('TestFunction', {
  name: 'test',
  maxBatchSize: 10,
});

new IntegTest(app, 'AppSyncFunctionMaxBatchSize', {
  testCases: [stack],
});

app.synth();
