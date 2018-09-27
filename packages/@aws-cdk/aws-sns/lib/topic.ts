import { Construct,  } from '@aws-cdk/cdk';
import { cloudformation } from './sns.generated';
import { TopicRef } from './topic-ref';

/**
 * Properties for a new SNS topic
 */
export interface TopicProps {
  /**
   * A developer-defined string that can be used to identify this SNS topic.
   *
   * @default None
   */
  displayName?: string;

  /**
   * A name for the topic.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique
   * physical ID and uses that ID for the topic name. For more information,
   * see Name Type.
   *
   * @default Generated name
   */
  topicName?: string;
}

/**
 * A new SNS topic
 */
export class Topic extends TopicRef {
  public readonly topicArn: string;
  public readonly topicName: string;

  protected readonly autoCreatePolicy: boolean = true;

  constructor(parent: Construct, name: string, props: TopicProps = {}) {
    super(parent, name);

    const resource = new cloudformation.TopicResource(this, 'Resource', {
      displayName: props.displayName,
      topicName: props.topicName
    });

    this.topicArn = resource.ref;
    this.topicName = resource.topicName;
  }
}
