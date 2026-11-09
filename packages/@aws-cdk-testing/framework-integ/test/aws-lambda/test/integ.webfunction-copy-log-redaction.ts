import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionRuntime } from 'aws-cdk-lib/aws-lambda';

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

const checker = new lambda.Function(stack, 'LogChecker', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: cdk.Duration.minutes(1),
  environment: {
    LOG_GROUP: copyLogGroup.logGroupName,
    SECRET: SECRET_VALUE,
  },
  code: lambda.Code.fromInline(`
    const { CloudWatchLogsClient, FilterLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');
    const client = new CloudWatchLogsClient({});
    exports.handler = async () => {
      let redacted = false;
      let secret = false;
      let nextToken;
      do {
        const page = await client.send(new FilterLogEventsCommand({ logGroupName: process.env.LOG_GROUP, nextToken }));
        for (const event of page.events ?? []) {
          if (event.message.includes('"Configuration": "*****"')) { redacted = true; }
          if (event.message.includes(process.env.SECRET)) { secret = true; }
        }
        nextToken = page.nextToken;
      } while (nextToken);
      return (redacted ? 'redacted' : 'no-redacted-configuration') + '/' + (secret ? 'secret-logged' : 'no-secret');
    };`),
});
checker.addToRolePolicy(new iam.PolicyStatement({
  actions: ['logs:FilterLogEvents'],
  resources: [copyLogGroup.logGroupArn],
}));

const testCase = new integ.IntegTest(app, 'WebFunctionCopyLogRedactionTest', {
  testCases: [stack],
  // the assertion checks the copy handler's behavior, so a change to its code must
  // regenerate (and redeploy) this snapshot
  diffAssets: true,
});

// log events reach CloudWatch a few seconds after they are written
testCase.assertions.invokeFunction({ functionName: checker.functionName })
  .expect(integ.ExpectedResult.objectLike({ Payload: '"redacted/no-secret"' }))
  .waitForAssertions({ totalTimeout: cdk.Duration.minutes(5), interval: cdk.Duration.seconds(30) });
