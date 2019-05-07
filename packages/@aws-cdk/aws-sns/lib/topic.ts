import { CfnOutput, Construct } from '@aws-cdk/cdk';
import { CfnTopic } from './sns.generated';
import { ITopic, TopicAttributes, TopicBase } from './topic-base';

/**
 * Properties for a new SNS topic
 */
export interface TopicProps {
  /**
   * A developer-defined string that can be used to identify this SNS topic.
   *
   * @default None
   */
  readonly displayName?: string;

  /**
   * A name for the topic.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique
   * physical ID and uses that ID for the topic name. For more information,
   * see Name Type.
   *
   * @default Generated name
   */
  readonly topicName?: string;
}

/**
 * A new SNS topic
 */
export class Topic extends TopicBase {

  public static fromTopicArn(scope: Construct, id: string, topicArn: string): ITopic {
    // arn:aws:sns:region:account-id:topicname
    return Topic.fromTopicAttributes(scope, id, {
      topicArn,
      topicName: scope.node.stack.parseArn(topicArn).resource
    });
  }

  /**
   * Import a Topic defined elsewhere
   */
  public static fromTopicAttributes(scope: Construct, id: string, attrs: TopicAttributes): ITopic {
    return new ImportedTopic(scope, id, attrs);
  }

  public readonly topicArn: string;
  public readonly topicName: string;

  protected readonly autoCreatePolicy: boolean = true;

  constructor(scope: Construct, id: string, props: TopicProps = {}) {
    super(scope, id);

    const resource = new CfnTopic(this, 'Resource', {
      displayName: props.displayName,
      topicName: props.topicName
    });

    this.topicArn = resource.ref;
    this.topicName = resource.topicName;
  }

  /**
   * Export this Topic
   */
  public export(): TopicAttributes {
    return {
      topicArn: new CfnOutput(this, 'TopicArn', { value: this.topicArn }).makeImportValue().toString(),
      topicName: new CfnOutput(this, 'TopicName', { value: this.topicName }).makeImportValue().toString(),
    };
  }
}

/**
 * An imported topic
 */
class ImportedTopic extends TopicBase {
  public readonly topicArn: string;
  public readonly topicName: string;

  protected autoCreatePolicy: boolean = false;

  constructor(scope: Construct, id: string, private readonly props: TopicAttributes) {
    super(scope, id);
    this.topicArn = props.topicArn;
    this.topicName = props.topicName;
  }

  public export(): TopicAttributes {
    return this.props;
  }
}
