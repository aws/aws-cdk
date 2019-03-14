import { CfnOutput, Construct } from '@aws-cdk/cdk';
import { CfnTopic } from './sns.generated';
import { ITopic, TopicBase, TopicImportProps } from './topic-base';

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
export class Topic extends TopicBase {
  /**
   * Import a Topic defined elsewhere
   */
  public static import(scope: Construct, id: string, props: TopicImportProps): ITopic {
    return new ImportedTopic(scope, id, props);
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
  public export(): TopicImportProps {
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

  constructor(scope: Construct, id: string, private readonly props: TopicImportProps) {
    super(scope, id);
    this.topicArn = props.topicArn;
    this.topicName = props.topicName;
  }

  public export(): TopicImportProps {
    return this.props;
  }
}
