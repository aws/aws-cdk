import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'GrantExecute');

const user = new iam.User(stack, 'user');
const api = new apigw.RestApi(stack, 'test-api');
const method = api.root.addResource('pets').addMethod('GET');
method.grantExecute(user);

new integ.IntegTest(app, 'GrantExecuteTest', {
  testCases: [stack],
});

app.synth();
