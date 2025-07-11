import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-appsync-graphql-field-level-log');

new appsync.GraphqlApi(stack, 'LambdaAPI', {
  name: 'LambdaAPI',
  schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.lambda.graphql')),
  logConfig: {
    fieldLogLevel: appsync.FieldLogLevel.INFO,
  },
});

new IntegTest(app, 'GraphQLFieldLevelLog', {
  testCases: [stack],
});
