/// !cdk-integ *
import { App, Arn, CfnResource, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Rule, IRuleTarget } from 'aws-cdk-lib/aws-events';

/**
 * Basic idea for this test is to create an EventBridge that "connects"
 *  an SQS queue in one account to another account. Nothing is sent on the
 *  queue, it's just used to set up the condition where aws-events creates
 *  a support stack.
 */

const app = new App();

const account = process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;

// As the integ-runner doesnt provide a default cross account, we make our own.
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '987654321';
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

const fromCrossAccountStack = new Stack(app, 'FromCrossAccountRuleStack', {
  env: {
    account: crossAccount,
    region,
  },
});

/**
 * To make this testable, we need to have the stack that stores the event bridge be in
 *  the same account that the IntegTest stack is deployed into. Otherwise, we have no
 *  access to the IAM policy that the EventBusPolicy-account-region support stack creates.
 */
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

// We are using the default event bus, don't need to define any parameters for this call.
const eventVerification = integ.assertions.awsApiCall('EventBridge', 'describeEventBus');

integ.node.addDependency(toCrossAccountStack);

eventVerification.provider.addPolicyStatementFromSdkCall('events', 'DescribeEventBus');

// IAM policy will be created by the support stack, assert that everything created as expected.
eventVerification.assertAtPath('Policy', ExpectedResult.objectLike({
  Statement: Match.arrayWith(
    [Match.objectLike({
      Sid: Match.stringLikeRegexp(`Allow-account-${crossAccount}`),
      Principal: {
        AWS: `arn:aws:iam::${crossAccount}:root`,
      },
      Resource: Match.stringLikeRegexp(`arn:aws:events:us-east-1:${account}`),
    })],
  ),
}));
