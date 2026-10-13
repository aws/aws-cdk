import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  ApplicationLogLevel,
  SystemLogLevel,
  WebFunctionAuthType,
  WebFunctionEndpointType,
  WebFunction,
  WebFunctionCode,
  WebFunctionRuntime,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionAllFieldsStack');

// Customer-managed key for the code S3 bucket (encrypts the code artifact at
// rest). Distinct from `envVarKey` below, which encrypts the revision's
// environment variables on the service side. Kept as separate keys to document
// that they protect different things: this one is bucket-side (customer's data
// store), that one is service-side (Lambda's revision store).
//
// The `kms:Decrypt` grant to the Lambda service principal is added
// automatically by `WebFunctionCode.fromBucket` — the service reads code at
// runtime via the bucket resource policy, and CMK-encrypted buckets require an
// explicit key-policy grant on top of the bucket policy.
const codeKey = new kms.Key(stack, 'CodeBucketKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const codeBucket = new s3.Bucket(stack, 'CodeBucket', {
  versioned: true,
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: codeKey,
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

const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const customRole = new iam.Role(stack, 'CustomRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
  ],
});

// Customer-managed key for the revision's environment variables (encrypts the
// env vars at rest inside the Lambda service). Distinct from `codeKey` above,
// which encrypts the code artifact inside the customer's S3 bucket.
const envVarKey = new kms.Key(stack, 'EnvVarKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const webFunction = new WebFunction(stack, 'AllFields', {
  code: WebFunctionCode.fromBucket(
    codeBucket,
    cdk.Fn.select(0, deployment.objectKeys),
    cdk.Fn.select(0, deployment.objectVersionIds),
  ),
  runtime: WebFunctionRuntime.NODEJS_LATEST,
  timeout: cdk.Duration.seconds(120),
  maxConcurrencyPerEnvironment: 32,
  environment: { MY_VAR: 'my-value' },
  revisionDescription: 'Integration test with all fields',
  authType: WebFunctionAuthType.IAM_AUTH,
  endpointType: WebFunctionEndpointType.HOME_REGION,
  endpointName: 'live',
  endpointDescription: 'Integration test endpoint',
  maxEnvironments: 10,
  rateLimit: 100,
  role: customRole,
  kmsKey: envVarKey,
  applicationLogLevel: ApplicationLogLevel.INFO,
  systemLogLevel: SystemLogLevel.WARN,
  logGroup: logGroup,
});

cdk.Tags.of(webFunction).add('Environment', 'integ-test');
cdk.Tags.of(webFunction).add('Team', 'cdk');

const testCase = new integ.IntegTest(app, 'WebFunctionAllFieldsTest', {
  testCases: [stack],
  diffAssets: false,
});

// Functional smoke test: hit the resolved endpoint domain. The endpoint uses
// IAM_AUTH, so an unsigned request is rejected with 403. Asserting 403 (rather
// than a connection error or 5xx) confirms the endpoint is live, reachable over
// TLS, and enforcing auth — i.e. the resources are wired correctly, not merely
// deployed.
testCase.assertions
  .httpApiCall(`https://${webFunction.domainName}/`)
  .expect(integ.ExpectedResult.objectLike({ status: 403 }));
