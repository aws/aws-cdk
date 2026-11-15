import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebFunction, WebFunctionCode, WebFunctionRuntime, WebFunctionAuthType } from 'aws-cdk-lib/aws-lambda';

/**
 * Deploys WebFunctions whose code comes from a local asset rather than a bucket the caller
 * populated themselves.
 *
 * Contrast with `integ.webfunction-minimal`, where using `fromBucket` means the template has to
 * carry a `BucketDeployment` plus an `AwsCustomResource` doing `headObject` just to learn the
 * object version. Here each factory call is a single line: CDK stages the asset, copies it into
 * a compliant bucket, and pins the version that copy wrote.
 *
 * Three functions are deployed to cover behaviour that only shows up on a real deployment:
 *
 * - `Automatic` / `AutomaticSecond` share one CDK-created bucket, each with its own copy custom
 *   resource writing a distinct key. This is the part unit tests cannot prove: that two copies
 *   into a single bucket really do produce two independently pinned object versions.
 * - `Specific` copies into a bucket the caller owns.
 */
const ASSET_PATH = path.join(__dirname, 'webfunction-staged-code');

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionStagedAssetStack');

// Code staged into a bucket CDK creates and configures (versioning, AES256, Lambda read policy).
const automatic = new WebFunction(stack, 'Automatic', {
  code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
});

// A second function in the same stack: reuses the bucket above, gets its own copy and version.
const automaticSecond = new WebFunction(stack, 'AutomaticSecond', {
  code: WebFunctionCode.fromAssetToManagedBucket(ASSET_PATH),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
});

// Code staged into a bucket the caller owns. The caller is responsible for the bucket meeting
// WebFunction's requirements; CDK validates what it can see at synthesis.
const callerBucket = new s3.Bucket(stack, 'CallerCodeBucket', {
  versioned: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const specific = new WebFunction(stack, 'Specific', {
  code: WebFunctionCode.fromAssetToProvidedBucket(callerBucket, ASSET_PATH, {
    keyPrefix: 'webfunctions/',
  }),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
});

const testCase = new integ.IntegTest(app, 'WebFunctionStagedAssetTest', {
  testCases: [stack],
  diffAssets: false,
});

// Each endpoint uses IAM_AUTH, so an unsigned request is rejected with 403. Asserting 403 —
// rather than a connection error or 5xx — confirms the endpoint is live, reachable over TLS,
// and enforcing auth. It does not exercise the code: the signature check rejects the request
// before anything is invoked. The read grant on the copied object is exercised earlier, when
// the service reads the object to create each revision — a broken grant fails the deployment.
for (const fn of [automatic, automaticSecond, specific]) {
  testCase.assertions
    .httpApiCall(`https://${fn.endpoint.domainName}/`)
    .expect(integ.ExpectedResult.objectLike({ status: 403 }));
}
