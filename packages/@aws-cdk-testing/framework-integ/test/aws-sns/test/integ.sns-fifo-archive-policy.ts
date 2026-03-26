import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import * as integ from '@aws-cdk/integ-tests-alpha';

class SNSFifoArchivePolicyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const topic = new Topic(this, 'MyTopic', {
      fifo: true,
      messageRetentionPeriodInDays: 12,
    });

    // SNS does not allow deleting a topic with an ArchivePolicy.
    // This custom resource clears the ArchivePolicy on stack deletion.
    // It depends on the topic so during deletion it runs BEFORE the topic is deleted.
    const clearArchive = new AwsCustomResource(this, 'ClearArchivePolicy', {
      onDelete: {
        service: 'SNS',
        action: 'setTopicAttributes',
        parameters: {
          TopicArn: topic.topicArn,
          AttributeName: 'ArchivePolicy',
          AttributeValue: '{}',
        },
        physicalResourceId: PhysicalResourceId.of('ClearArchivePolicy'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    clearArchive.node.addDependency(topic);
  }
}

const app = new App({ context: { '@aws-cdk/core:disableGitSource': true } });

const stack = new SNSFifoArchivePolicyStack(app, 'SNSFifoArchivePolicyStack');

new integ.IntegTest(app, 'SqsTest', {
  testCases: [stack],
});

app.synth();
