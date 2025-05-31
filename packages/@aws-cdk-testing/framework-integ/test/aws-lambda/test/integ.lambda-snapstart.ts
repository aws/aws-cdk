import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';
import { Code, Function, Runtime, SnapStartConf } from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-runtime-management');

new Function(stack, 'JavaSnapstartLambda', {
  code: Code.fromAsset(path.join(__dirname, 'handler-snapstart.zip')),
  handler: 'Handler',
  runtime: Runtime.JAVA_11,
  snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
});

new Function(stack, 'Python312SnapstartLambda', {
  code: Code.fromInline('pass'),
  handler: 'Handler',
  runtime: Runtime.PYTHON_3_12,
  snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
});

new Function(stack, 'Python313SnapstartLambda', {
  code: Code.fromInline('pass'),
  handler: 'Handler',
  runtime: Runtime.PYTHON_3_13,
  snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
});

new Function(stack, 'DotnetSnapstartLambda', {
  code: Code.fromAsset('dotnet-handler'),
  handler: 'Handler',
  runtime: Runtime.DOTNET_8,
  snapStart: SnapStartConf.ON_PUBLISHED_VERSIONS,
});

new integ.IntegTest(app, 'lambda-runtime-management', {
  testCases: [stack],
});
