/// !cdk-integ *
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type * as log from 'aws-cdk-lib/aws-logs';
import { App, CustomResource, Duration, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import { Provider } from 'aws-cdk-lib/custom-resources';

const SECRET_VALUE = 'secret-value';

class TestStack extends Stack {
  public readonly entrypointLogGroup: log.ILogGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'my-handler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
      exports.handler = async (event, context) => {
        return {
          PhysicalResourceId: '1234',
          NoEcho: true,
          Data: {
            mySecret: '${SECRET_VALUE}',
          },
        };
      };`),
    });

    const provider = new Provider(this, 'my-provider', {
      onEventHandler: handler,
      // the framework Lambdas log at FATAL by default; this test reads their INFO logs
      frameworkLambdaLoggingLevel: lambda.ApplicationLogLevel.INFO,
    });

    this.entrypointLogGroup = (provider.node.findChild('framework-onEvent') as lambda.Function).logGroup;

    new CustomResource(this, 'my-cr', {
      serviceToken: provider.serviceToken,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new TestStack(app, 'integ-provider-no-echo');

const test = new integ.IntegTest(app, 'IntegProviderFrameworkNoEchoTest', {
  testCases: [stack],
});

// When `NoEcho` is used, the framework's log lines say 'redacted' and never contain
// the secret. A checker function reads every event in the log group (a single
// FilterLogEvents call can return an empty page with a nextToken) and reports both.
const checker = new lambda.Function(stack, 'LogChecker', {
  runtime: lambda.Runtime.NODEJS_22_X,
  handler: 'index.handler',
  timeout: Duration.minutes(1),
  environment: {
    LOG_GROUP: stack.entrypointLogGroup.logGroupName,
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
        let page;
        try {
          page = await client.send(new FilterLogEventsCommand({ logGroupName: process.env.LOG_GROUP, nextToken }));
        } catch (e) {
          if (e.name === 'ResourceNotFoundException') { return 'no-log-group'; }
          throw e;
        }
        for (const event of page.events ?? []) {
          if (event.message.includes('redacted')) { redacted = true; }
          if (event.message.includes(process.env.SECRET)) { secret = true; }
        }
        nextToken = page.nextToken;
      } while (nextToken);
      return (redacted ? 'redacted' : 'no-redacted-line') + '/' + (secret ? 'secret-logged' : 'no-secret');
    };`),
});
checker.addToRolePolicy(new iam.PolicyStatement({
  actions: ['logs:FilterLogEvents'],
  resources: [stack.entrypointLogGroup.logGroupArn],
}));

// log events reach CloudWatch a few seconds after they are written
test.assertions.invokeFunction({ functionName: checker.functionName })
  .expect(integ.ExpectedResult.objectLike({ Payload: '"redacted/no-secret"' }))
  .waitForAssertions({ totalTimeout: Duration.minutes(5), interval: Duration.seconds(30) });
