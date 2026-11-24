import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, Duration, RemovalPolicy } from 'aws-cdk-lib';

const app = new App();
const stack = new Stack(app, 'aws-cdk-lambda-durable-config');
const keyStack = new Stack(app, 'aws-cdk-lambda-durable-config-key');

const code = lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "Hello World" });');

new lambda.Function(stack, 'DurableFunction', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code,
  durableConfig: { executionTimeout: Duration.hours(1), retentionPeriod: Duration.days(30) },
});

// Without a functionName, the key policy statements use a wildcard function ARN.
const wildcardKey = new kms.Key(stack, 'DurableKey', { removalPolicy: RemovalPolicy.DESTROY });
const wildcardFunction = new lambda.Function(stack, 'DurableFunctionWithCmk', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code,
  durableConfig: { executionTimeout: Duration.hours(1), retentionPeriod: Duration.days(30), kmsKey: wildcardKey },
});

// With a functionName, the statements are scoped to the function.
const scopedKey = new kms.Key(stack, 'ScopedKey', { removalPolicy: RemovalPolicy.DESTROY });
const scopedFunction = new lambda.Function(stack, 'DurableFunctionWithCmkAndName', {
  functionName: `${stack.stackName}-cmk`,
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code,
  durableConfig: { executionTimeout: Duration.hours(1), retentionPeriod: Duration.days(30), kmsKey: scopedKey },
});

// With the key in another stack, the key stack does not reference the function stack or its role.
const crossStackKey = new kms.Key(keyStack, 'CrossStackKey', { removalPolicy: RemovalPolicy.DESTROY });
const crossStackRole = new iam.Role(stack, 'CrossStackRole', {
  roleName: `${stack.stackName}-cross-stack-role`,
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicDurableExecutionRolePolicy')],
});
const crossStackFunction = new lambda.Function(stack, 'DurableFunctionWithCrossStackCmk', {
  functionName: `${stack.stackName}-cross-stack-cmk`,
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  code,
  role: crossStackRole,
  durableConfig: { executionTimeout: Duration.hours(1), retentionPeriod: Duration.days(30), kmsKey: crossStackKey },
});

const integ = new IntegTest(app, 'lambda-durable-config', {
  testCases: [keyStack, stack],
});

for (const [fn, key] of [[wildcardFunction, wildcardKey], [scopedFunction, scopedKey], [crossStackFunction, crossStackKey]] as const) {
  integ.assertions.awsApiCall('Lambda', 'getFunctionConfiguration', { FunctionName: fn.functionName })
    .expect(ExpectedResult.objectLike({ DurableConfig: { KMSKeyArn: key.keyArn } }));
}
