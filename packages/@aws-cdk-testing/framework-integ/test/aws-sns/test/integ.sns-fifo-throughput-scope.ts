import { App, Stack, StackProps } from 'aws-cdk-lib';
import { FifoThroughputScope, Topic } from 'aws-cdk-lib/aws-sns';

import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class SNSInteg extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new Topic(this, 'MessageGroupScopeTopic', {
      fifo: true,
      fifoThroughputScope: FifoThroughputScope.MESSAGE_GROUP,
    });

    new Topic(this, 'TopicScopeTopic', {
      fifo: true,
      fifoThroughputScope: FifoThroughputScope.TOPIC,
    });
  }
}

const app = new App();

const stack = new SNSInteg(app, 'sns-fifo-throughput-scope');

new IntegTest(app, 'sns-fifo-throughput-scope-test', {
  testCases: [stack],
});
