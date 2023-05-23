import { Queue, IQueue } from 'aws-cdk-lib/aws-sqs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { App, Stack, StackProps, NestedStack } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

// GIVEN
const app = new App({
  treeMetadata: false,
});

class ProducerStack extends Stack {
  public readonly queue: IQueue;
  public readonly nestedQueue: IQueue;
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        region: 'us-east-1',
      },
      crossRegionReferences: true,
    });
    const nested = new NestedStack(this, 'IntegNested');
    this.queue = new Queue(this, 'IntegQueue');
    this.nestedQueue = new Queue(nested, 'NestedIntegQueue');
  }
}

interface ConsumerStackProps extends StackProps {
  readonly queues: IQueue[];
  readonly region: string;
}
class ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: ConsumerStackProps) {
    super(scope, id, {
      ...props,
      env: {
        region: props.region,
      },
      crossRegionReferences: true,
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

class TestCase extends Construct {
  public readonly testCases: Stack[] = [];
  public readonly producer: ProducerStack;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.producer = new ProducerStack(app, 'cross-region-producer');
    this.testCases.push(new ConsumerStack(app, 'cross-region-consumer', {
      queues: [this.producer.queue, this.producer.nestedQueue],
      region: 'us-east-2',
    }));
    this.testCases.push(new ConsumerStack(app, 'cross-region-consumer2', {
      queues: [this.producer.queue, this.producer.nestedQueue],
      region: 'us-west-2',
    }));
  }
}
const testCase1 = new TestCase(app, 'TestCase1');

// THEN
const integ = new IntegTest(app, 'cross-region-references', {
  testCases: testCase1.testCases,
  stackUpdateWorkflow: false,
});

/**
 * Test that if the references are still in use, deleting the producer
 * stack will fail
 *
 * When the test cleans up it will delete the consumer then the producer, which should
 * test that the parameters are cleaned up correctly.
 */

integ.assertions.awsApiCall('CloudFormation', 'deleteStack', {
  StackName: testCase1.producer.stackName,
}).next(
  integ.assertions.awsApiCall('CloudFormation', 'describeStacks', {
    StackName: testCase1.producer.stackName,
  }).expect(ExpectedResult.objectLike({
    Stacks: Match.arrayWith([
      Match.objectLike({
        StackName: testCase1.producer.stackName,
        StackStatus: 'DELETE_FAILED',
      }),
    ]),
  })).waitForAssertions(),
);
