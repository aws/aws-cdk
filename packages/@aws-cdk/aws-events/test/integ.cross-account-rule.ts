/// !cdk-integ *
import { App, Arn, CfnResource, Stack } from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { Rule, IRuleTarget } from '../lib';

/**
 * Basic idea for this test is to create an EventBridge that "connects"
 *  an SQS queue in one account to another account. Nothing is sent on the
 *  queue, it's just used to set up the condition where aws-events creates
 *  a support stack.
 */

const app = new App();

const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || process.env.CDK_DEFAULT_CROSS_ACCOUNT;
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

const fromCrossAccountStack = new Stack(app, 'FromCrossAccountRuleStack', {
  env: {
    account: crossAccount,
    region,
  },
});

const toCrossAccountStack = new Stack(app, 'ToCrossAccountRuleStack', {
  env: {
    account,
    region,
  },
});
const queueName = 'IntegTestCrossEnvRule';

const queue = new CfnResource(toCrossAccountStack, 'Queue', {
  type: 'AWS::SQS::Queue',
  properties: {
    QueueName: queueName,
    ReceiveMessageWaitTimeSeconds: 20,
  },
});

const target: IRuleTarget = {
  bind: () => ({
    id: 'SQS',
    arn: Arn.format({
      resource: queueName,
      service: 'sqs',
    }, toCrossAccountStack),
    targetResource: queue,
  }),
};

new Rule(fromCrossAccountStack, 'MyRule', {
  eventPattern: {
    detail: {
      foo: ['bar'],
    },
    detailType: ['cdk-integ-custom-rule'],
    source: ['cdk-integ'],
  },
  targets: [target],
});

toCrossAccountStack.addDependency(fromCrossAccountStack);

const integ = new IntegTest(app, 'CrossAccountDeploy', {
  testCases: [
    toCrossAccountStack,
  ],
});

// We are using the default event bus.
const eventVerification = integ.assertions.awsApiCall('EventBridge', 'describeEventBus');

integ.node.addDependency(toCrossAccountStack);

eventVerification.provider.addPolicyStatementFromSdkCall('events', 'DescribeEventBus');

eventVerification.assertAtPath('Policy.Statement.0', ExpectedResult.objectLike({
  Sid: 'Allow-account-',
}));

app.synth();
