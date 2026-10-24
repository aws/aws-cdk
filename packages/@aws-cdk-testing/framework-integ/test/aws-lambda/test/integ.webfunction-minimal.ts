import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebFunction, WebFunctionCode, WebFunctionRuntime, WebFunctionAuthType } from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionMinimalStack');

// Versioned S3 bucket for code storage — WebFunction requires versioning to
// pin a specific object version per revision.
const codeBucket = new s3.Bucket(stack, 'CodeBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Deploy the handler code as a single zip object (extract: false) so we can
// read its VersionId back via `objectVersionIds`.
const deployment = new s3deploy.BucketDeployment(stack, 'DeployCode', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'webfunction-handler'))],
  destinationBucket: codeBucket,
  extract: false,
});

const webFunction = new WebFunction(stack, 'MinimalBucket', {
  code: WebFunctionCode.fromBucket(
    codeBucket,
    cdk.Fn.select(0, deployment.objectKeys),
    cdk.Fn.select(0, deployment.objectVersionIds),
  ),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  authType: WebFunctionAuthType.IAM_AUTH,
});

cdk.Tags.of(webFunction).add('App', 'integ-test');

const testCase = new integ.IntegTest(app, 'WebFunctionMinimalTest', {
  testCases: [stack],
  diffAssets: false,
});

// Functional smoke test: hit the resolved endpoint domain. The endpoint uses
// IAM_AUTH, so an unsigned request is rejected with 403. Asserting 403 (rather
// than a connection error or 5xx) confirms the endpoint is live, reachable over
// TLS, and enforcing auth — i.e. the three CFN resources are wired correctly,
// not merely deployed.
testCase.assertions
  .httpApiCall(`https://${webFunction.endpoint.domainName}/`)
  .expect(integ.ExpectedResult.objectLike({ status: 403 }));
