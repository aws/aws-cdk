import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-permissions');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

fn.grantInvoke(new iam.AnyPrincipal().inOrganization('o-yyyyyyyyyy'));

fn.grantInvoke(new iam.OrganizationPrincipal('o-xxxxxxxxxx'));

const fnUrl = fn.addFunctionUrl();
const role = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
fnUrl.grantInvokeUrl(role);

fn.grantInvokeCompositePrincipal(new iam.CompositePrincipal(
  new iam.OrganizationPrincipal('o-mmmmmmmmmm'),
  new iam.ServicePrincipal('apigateway.amazonaws.com'),
));

fn.grantInvokeLatestVersion(role);

fn.grantInvokeLatestVersion(new iam.OrganizationPrincipal('o-xxxxxxxxxx2'));

const version1 = new lambda.Version(stack, 'v1', {
  lambda: fn,
});

fn.grantInvokeVersion(role, version1);
