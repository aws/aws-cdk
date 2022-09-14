import { Queue, IQueue } from '@aws-cdk/aws-sqs';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { App, Stack, StackProps, NestedStack } from '@aws-cdk/core';
import { ENABLE_CROSS_REGION_REFERENCES } from '@aws-cdk/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';

// GIVEN
const app = new App({
  treeMetadata: false,
});
app.node.setContext(ENABLE_CROSS_REGION_REFERENCES, true);

class ProducerStack extends Stack {
  public readonly queue: IQueue;
  public readonly nestedQueue: IQueue;
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        region: 'us-east-1',
        account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
      },
    });
    const nested = new NestedStack(this, 'IntegNested');
    this.queue = new Queue(this, 'IntegQueue');
    this.nestedQueue = new Queue(nested, 'NestedIntegQueue');
  }
}

interface ConsumerStackProps extends StackProps {
  readonly queues: IQueue[];
}
class ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: ConsumerStackProps) {
    super(scope, id, {
      ...props,
      env: {
        region: 'us-east-2',
        account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
      },
    });

    const nested = new NestedStack(this, 'IntegNested');
    props.queues.forEach((queue, i) => {
      new StringParameter(this, 'IntegParameter'+i, {
        parameterName: 'integ-parameter'+i,
        stringValue: queue.queueName,
      });
      new StringParameter(nested, 'IntegNestedParameter'+i, {
        parameterName: 'integ-nested-parameter'+i,
        stringValue: queue.queueName,
      });
    });
  }
}
const producer = new ProducerStack(app, 'cross-region-producer');
const testCase = new ConsumerStack(app, 'cross-region-consumer', {
  queues: [producer.queue, producer.nestedQueue],
});

// THEN
new IntegTest(app, 'cross-region-references', {
  testCases: [testCase],
  stackUpdateWorkflow: false,
});
