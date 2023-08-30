import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'lambda-permissions');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_16_X,
});

fn.grantInvoke(new iam.AnyPrincipal().inOrganization('o-yyyyyyyyyy'));

fn.grantInvoke(new iam.OrganizationPrincipal('o-xxxxxxxxxx'));
