import { Construct } from 'constructs';
import { CfnTopic, ICfnTopic } from './sns.generated';
import { ITopic, TopicBase } from './topic-base';
import { IKey } from '../../aws-kms';
import { ArnFormat, Names, Stack } from '../../core';

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

  /**
   * A KMS Key, either managed by this CDK app, or imported.
   *
   * @default None
   */
  readonly masterKey?: IKey;

  /**
   * Enables content-based deduplication for FIFO topics.
   *
   * @default None
   */
  readonly contentBasedDeduplication?: boolean;

  /**
   * Set to true to create a FIFO topic.
   *
   * @default None
   */
  readonly fifo?: boolean;
}

/**
 * A new SNS topic
 */
export class Topic extends TopicBase {
  /**
   * Import an existing SNS topic provided an ARN
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param topicArn topic ARN (i.e. arn:aws:sns:us-east-2:444455556666:MyTopic)
   */
  public static fromTopicArn(scope: Construct, id: string, topicArn: string): ITopic {
    class Import extends TopicBase {
      public readonly attrTopicArn = topicArn;
      public readonly topicArn = this.attrTopicArn;
      public readonly topicName = Stack.of(scope).splitArn(topicArn, ArnFormat.NO_RESOURCE_NAME).resource;
      public readonly fifo = this.topicName.endsWith('.fifo');
      public readonly contentBasedDeduplication = false;
      protected autoCreatePolicy: boolean = false;
    }

    return new Import(scope, id, {
      environmentFromArn: topicArn,
    });
  }

  /**
   * Create a mutable `ITopic` out of a `ICfnTopic`.
   */
  public static fromCfnTopic(cfnTopic: ICfnTopic): ITopic {
    function isITopic(x: any): x is ITopic {
      return (<ITopic>x).grantPublish !== undefined;
    }

    // if cfnTopic is already an ITopic, just return itself
    if (isITopic(cfnTopic)) { return cfnTopic; }

    // use a "weird" id that has a higher chance of being unique
    const id = '@FromCfnTopic';

    // if fromCfnTopic() was already called on this cfnTopic, return the same L2
    const existing = cfnTopic.node.tryFindChild(id);
    if (existing) { return <ITopic>existing; }

    // if cfnTopic is not a CfnResource, and thus not a CfnTopic, then we are in a scenario
    // where cfnTopic is an ICfnTopic but NOT a CfnTopic, which is likely an error.
    if (!CfnTopic.isCfnResource(cfnTopic)) {
      throw new Error('Encountered an "ICfnTopic" that is not an "ITopic" or "CfnTopic". If you have a legitimate reason for this, please open an issue at https://github.com/aws/aws-cdk/issues');
    }

    const _cfnTopic = cfnTopic as CfnTopic;

    return new class extends TopicBase {
      public readonly attrTopicArn = cfnTopic.attrTopicArn;
      public readonly topicArn = this.attrTopicArn;
      public readonly topicName = Stack.of(cfnTopic).splitArn(this.attrTopicArn, ArnFormat.NO_RESOURCE_NAME).resource;
      public readonly fifo = this.topicName.endsWith('.fifo');
      public readonly contentBasedDeduplication = false;
      protected autoCreatePolicy: boolean = false;

      constructor() {
        super(_cfnTopic, id);

        this.node.defaultChild = _cfnTopic;
      }
    }();
  }

  public readonly topicArn: string;
  public readonly attrTopicArn: string;
  public readonly topicName: string;
  public readonly contentBasedDeduplication: boolean;
  public readonly fifo: boolean;

  protected readonly autoCreatePolicy: boolean = true;

  constructor(scope: Construct, id: string, props: TopicProps = {}) {
    super(scope, id, {
      physicalName: props.topicName,
    });

    if (props.contentBasedDeduplication && !props.fifo) {
      throw new Error('Content based deduplication can only be enabled for FIFO SNS topics.');
    }

    let cfnTopicName: string;
    if (props.fifo && props.topicName && !props.topicName.endsWith('.fifo')) {
      cfnTopicName = this.physicalName + '.fifo';
    } else if (props.fifo && !props.topicName) {
      // Max lenght allowed by CloudFormation is 256, we subtract 5 to allow for ".fifo" suffix
      const prefixName = Names.uniqueResourceName(this, {
        maxLength: 256 - 5,
        separator: '-',
      });
      cfnTopicName = `${prefixName}.fifo`;
    } else {
      cfnTopicName = this.physicalName;
    }

    const resource = new CfnTopic(this, 'Resource', {
      displayName: props.displayName,
      topicName: cfnTopicName,
      kmsMasterKeyId: props.masterKey && props.masterKey.keyArn,
      contentBasedDeduplication: props.contentBasedDeduplication,
      fifoTopic: props.fifo,
    });

    this.attrTopicArn = this.getResourceArnAttribute(resource.ref, {
      service: 'sns',
      resource: this.physicalName,
    });
    this.topicArn = this.attrTopicArn;
    this.topicName = this.getResourceNameAttribute(resource.attrTopicName);
    this.fifo = props.fifo || false;
    this.contentBasedDeduplication = props.contentBasedDeduplication || false;
  }
}
