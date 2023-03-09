import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-permissions');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
});

fn.grantInvoke(new iam.AnyPrincipal().inOrganization('o-yyyyyyyyyy'));

fn.grantInvoke(new iam.OrganizationPrincipal('o-xxxxxxxxxx'));
