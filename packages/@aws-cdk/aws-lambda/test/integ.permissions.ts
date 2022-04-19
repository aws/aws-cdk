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

// 3 different ways to configure the same permission
fn.addPermission('org', {
  principal: new iam.OrganizationPrincipal('o-xxxxxxxxxx'),
});

fn.addPermission('other-org', {
  principal: new iam.StarPrincipal(),
  principalOrg: new iam.OrganizationPrincipal('o-zzzzzzzzzz'),
});

fn.grantInvoke(new iam.AnyPrincipal().withConditions({
  StringEquals: {
    'aws:PrincipalOrgID': 'o-yyyyyyyyyy',
  },
}));

