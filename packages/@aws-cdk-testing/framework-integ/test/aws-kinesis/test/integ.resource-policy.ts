import { App, CfnResource, Stack } from 'aws-cdk-lib';
import { Stream, StreamConsumer } from 'aws-cdk-lib/aws-kinesis';
import { AccountPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'kinesis-resource-policy');

const stream = new Stream(stack, 'MyStream');

const streamConsumer = new StreamConsumer(stack, 'StreamConsumer', {
  streamConsumerName: 'stream-consumer',
  stream: stream,
});

// The AWS::Kinesis::StreamConsumer resource may signal CREATE_COMPLETE before
// the consumer reaches ACTIVE status. The resource policy requires the consumer
// to be ACTIVE. This custom resource waits for the consumer to become ACTIVE.
const waitForConsumerActive = new AwsCustomResource(stack, 'WaitForConsumerActive', {
  onCreate: {
    service: 'Kinesis',
    action: 'DescribeStreamConsumer',
    parameters: {
      ConsumerARN: streamConsumer.streamConsumerArn,
    },
    physicalResourceId: PhysicalResourceId.of('WaitForConsumerActive'),
  },
  policy: AwsCustomResourcePolicy.fromStatements([
    new PolicyStatement({
      actions: ['kinesis:DescribeStreamConsumer'],
      resources: ['*'],
    }),
  ]),
});

// Add L1 dependency only on the CfnStreamConsumer, not the full L2 construct
// tree (which would include the Policy child and cause a circular dependency).
const cfnConsumer = streamConsumer.node.defaultChild as CfnResource;
const cfnWaiter = waitForConsumerActive.node.findChild('Resource').node.defaultChild as CfnResource;
cfnWaiter.addDependency(cfnConsumer);

stream.addToResourcePolicy(new PolicyStatement({
  resources: [stream.streamArn],
  actions: [
    'kinesis:DescribeStreamSummary',
    'kinesis:GetRecords',
  ],
  principals: [new AccountPrincipal(stack.account)],
}));

streamConsumer.addToResourcePolicy(new PolicyStatement({
  resources: [streamConsumer.streamConsumerArn],
  actions: [
    'kinesis:DescribeStreamConsumer',
    'kinesis:SubscribeToShard',
  ],
  principals: [new AccountPrincipal(stack.account)],
}));

// Ensure the consumer resource policy is created after the consumer is ACTIVE.
// Use L1 dependency to avoid pulling in the full construct tree.
const cfnConsumerPolicy = streamConsumer.node.findChild('Policy').node.findChild('Resource') as CfnResource;
cfnConsumerPolicy.addDependency(cfnWaiter);

new IntegTest(app, 'integ-kinesis-resource-policy', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
