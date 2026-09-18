import { App, Stack, Size } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'LambdaEphemeralStorageValidationStack');

// A valid ephemeral storage size (within 512-10240 MiB range).
// This validates that the out-of-range check passes for valid inputs
// after the error message fix was applied.
new lambda.Function(stack, 'LambdaWithEphemeralStorage', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async () => {};'),
  ephemeralStorageSize: Size.mebibytes(1024),
});

new IntegTest(app, 'LambdaEphemeralStorageValidationTest', {
  testCases: [stack],
});

app.synth();
