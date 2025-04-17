import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { Stream, StreamConsumer } from 'aws-cdk-lib/aws-kinesis';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

const app = new App();

const stack = new Stack(app, 'StreamResourcesStack', {
  env: {
    account,
    region,
  },
});
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.AccountRootPrincipal(),
});
const stream = new Stream(stack, 'Stream', {
  streamName: 'test-stream',
});
const streamConsumer = new StreamConsumer(stack, 'StreamConsumer', {
  streamConsumerName: 'test-stream-consumer',
  stream: stream,
});

// same account grantReadWrite
stream.grantReadWrite(role);
streamConsumer.grantRead(role);

const crossAccountStack = new Stack(app, 'CrossAccountStack', {
  env: {
    account: crossAccount,
    region,
  },
});
const crossAccountRole = new iam.Role(crossAccountStack, 'CrossAccountRole', {
  roleName: 'stream-cross-account-consumer-role',
  assumedBy: new iam.AccountRootPrincipal(),
});

// cross account grantReadWrite
stream.grantReadWrite(crossAccountRole);
streamConsumer.grantRead(crossAccountRole);

stack.addDependency(crossAccountStack);

new IntegTest(app, 'CrossAccountStreamConsumption', {
  testCases: [crossAccountStack, stack],
});
