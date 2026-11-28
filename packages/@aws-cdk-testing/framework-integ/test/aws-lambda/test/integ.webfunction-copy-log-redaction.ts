import * as path from 'path';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionRuntime } from 'aws-cdk-lib/aws-lambda';
import { logRedactionChecker } from '../../custom-resources/test/log-redaction-checker';

/**
 * The code copy handler behind `WebFunctionCode.fromAssetToManagedBucket()` receives the
 * revision's configuration, environment variables included, resolved by CloudFormation.
 * An environment variable set from a `NoEcho` parameter therefore reaches the handler in
 * plaintext. The handler redacts `Configuration` from the event it logs; this test reads
 * the handler's whole log group and checks that the logged `Configuration` is `*****` and
 * that the parameter's value appears nowhere.
 */
const SECRET_VALUE = 'webfunction-copy-redaction-secret';

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'WebFunctionCopyLogRedactionStack');

const secret = new cdk.CfnParameter(stack, 'Secret', {
  type: 'String',
  noEcho: true,
  default: SECRET_VALUE,
});

// Owned by the test so the checker can name it.
const copyLogGroup = new logs.LogGroup(stack, 'CopyLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new WebFunction(stack, 'Function', {
  code: WebFunctionCode.fromAssetToManagedBucket(path.join(__dirname, 'webfunction-ok-handler'), {
    copyOptions: { logGroup: copyLogGroup },
  }),
  runtime: WebFunctionRuntime.NODEJS_24_X,
  defaultEndpointAuth: WebFunctionAuthType.IAM_AUTH,
  environment: { SECRET: secret.valueAsString },
});

const checker = logRedactionChecker(stack, 'LogChecker', {
  logGroups: [copyLogGroup],
  marker: '"Configuration": "*****"',
  secret: SECRET_VALUE,
});

const testCase = new integ.IntegTest(app, 'WebFunctionCopyLogRedactionTest', {
  testCases: [stack],
  // the assertion checks the copy handler's behavior, so a change to its code must
  // regenerate (and redeploy) this snapshot
  diffAssets: true,
});

// log events reach CloudWatch a few seconds after they are written
testCase.assertions.invokeFunction({ functionName: checker.functionName })
  .expect(integ.ExpectedResult.objectLike({ Payload: '"marker-found/no-secret"' }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(5), interval: cdk.Duration.seconds(30) });
