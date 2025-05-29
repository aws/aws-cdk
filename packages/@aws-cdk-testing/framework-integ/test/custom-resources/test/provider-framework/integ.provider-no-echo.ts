/// !cdk-integ *
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as log from 'aws-cdk-lib/aws-logs';
import { App, CustomResource, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { Provider } from 'aws-cdk-lib/custom-resources';

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
            mySecret: 'secret-value',
          },
        };
      };`),
    });

    const provider = new Provider(this, 'my-provider', {
      onEventHandler: handler,
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

// When `NoEcho` is used, cloudwatch log statements should contain 'redacted' keywords in the messages
const keyword = 'redacted';
const logEvents = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: stack.entrypointLogGroup.logGroupName,
  filterPattern: keyword,
  limit: 1,
});

logEvents.assertAtPath('events.0.message', integ.ExpectedResult.stringLikeRegexp(keyword));
