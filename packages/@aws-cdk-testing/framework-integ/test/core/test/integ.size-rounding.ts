import { App, Size, SizeRoundingBehavior, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'size-rounding');
const role = new iam.Role(stack, 'FunctionRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});

new lambda.CfnFunction(stack, 'Function', {
  code: { zipFile: 'exports.handler = async () => "ok";' },
  handler: 'index.handler',
  role: role.roleArn,
  runtime: 'nodejs22.x',
  memorySize: Size.mebibytes(128.66).toMebibytes({ rounding: SizeRoundingBehavior.FLOOR }),
});

new IntegTest(app, 'SizeRounding', {
  testCases: [stack],
});
