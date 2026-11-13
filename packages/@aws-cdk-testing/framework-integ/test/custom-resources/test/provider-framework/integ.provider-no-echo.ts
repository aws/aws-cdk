/// !cdk-integ *
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, CustomResource, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { logRedactionChecker } from '../log-redaction-checker';

const SECRET_VALUE = 'secret-value';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new Stack(app, 'integ-provider-no-echo');

// A user onEvent handler that returns NoEcho Data. The provider framework must not
// write the Data to its own logs.
const onEvent = new lambda.Function(stack, 'my-handler', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`
  exports.handler = async () => ({
    PhysicalResourceId: '1234',
    NoEcho: true,
    Data: { mySecret: '${SECRET_VALUE}' },
  });`),
});

// Synchronous: onEvent only.
const syncProvider = new Provider(stack, 'my-provider', {
  onEventHandler: onEvent,
  // the framework Lambdas log at FATAL by default; this test reads their INFO logs
  frameworkLambdaLoggingLevel: lambda.ApplicationLogLevel.INFO,
});
new CustomResource(stack, 'my-cr', { serviceToken: syncProvider.serviceToken });

// Asynchronous: the isComplete request carries the Data returned by onEvent, so the
// framework's isComplete function sees it too. Completes on the first poll.
const asyncProvider = new Provider(stack, 'my-async-provider', {
  onEventHandler: onEvent,
  isCompleteHandler: new lambda.Function(stack, 'my-is-complete', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async () => ({ IsComplete: true });'),
  }),
  queryInterval: Duration.seconds(10),
  frameworkLambdaLoggingLevel: lambda.ApplicationLogLevel.INFO,
});
new CustomResource(stack, 'my-async-cr', { serviceToken: asyncProvider.serviceToken });

const frameworkLogGroup = (provider: Provider, name: string) => (provider.node.findChild(name) as lambda.Function).logGroup;

const test = new integ.IntegTest(app, 'IntegProviderFrameworkNoEchoTest', {
  testCases: [stack],
});

// Every framework function that handled the resources logs its redacted response, and
// none of their log lines contains the secret.
const checker = logRedactionChecker(stack, 'LogChecker', {
  logGroups: [
    frameworkLogGroup(syncProvider, 'framework-onEvent'),
    frameworkLogGroup(asyncProvider, 'framework-onEvent'),
    frameworkLogGroup(asyncProvider, 'framework-isComplete'),
  ],
  marker: '"mySecret": "*****"',
  secret: SECRET_VALUE,
});

// log events reach CloudWatch a few seconds after they are written
test.assertions.invokeFunction({ functionName: checker.functionName })
  .expect(integ.ExpectedResult.objectLike({ Payload: '"marker-found/no-secret"' }))
  .waitForAssertions({ totalTimeout: Duration.minutes(5), interval: Duration.seconds(30) });
