import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { CustomResourceConfig } from 'aws-cdk-lib/custom-resources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-dynamodb:retainTableReplica': true,
  },
});
const stack = new cdk.Stack(app, 'MyStack');

new dynamodb.Table(stack, 'Table', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  replicationRegions: [
    'us-east-2',
  ],
});

new lambda.Function(stack, 'nonCrLambda', {
  code: lambda.Code.fromInline('helloWorld'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_20_X,
});

CustomResourceConfig.of(app).addLambdaRuntime(lambda.Runtime.NODEJS_18_X);

new integ.IntegTest(app, 'integ-test-custom-resource-config-lambda-node-runtime', {
  testCases: [stack],
  diffAssets: false,
});
