import { Construct } from 'constructs';
import { CfnStreamConsumer } from './kinesis.generated';
import { ResourcePolicy } from './resource-policy';
import { IStream, Stream } from './stream';
import * as iam from '../../aws-iam';
import { ArnFormat, IResource, Resource, Stack } from '../../core';

const READ_OPERATIONS = [
  'kinesis:DescribeStreamConsumer',
  'kinesis:SubscribeToShard',
];

/**
 * A Kinesis Stream Consumer
 */
export interface IStreamConsumer extends IResource {
  /**
   * The ARN of the stream consumer.
   *
   * @attribute
   */
  readonly streamConsumerArn: string;

  /**
   * The name of the stream consumer.
   *
   * @attribute
   */
  readonly streamConsumerName: string;

  /**
   * The stream associated with this consumer.
   *
   * @attribute
   */
  readonly stream: IStream;

  /**
   * Adds a statement to the IAM resource policy associated with this stream consumer.
   *
   * If this stream consumer was created in this stack (`new StreamConsumer`), a resource policy
   * will be automatically created upon the first call to `addToResourcePolicy`. If
   * the stream consumer is imported (`StreamConsumer.from`), then this is a no-op.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  /**
   * Grant read permissions for this stream consumer and its associated stream to an IAM
   * principal (Role/Group/User).
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the indicated permissions on this stream consumer to the provided IAM principal.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
}

abstract class StreamConsumerBase extends Resource implements IStreamConsumer {
  /**
   * The ARN of the stream consumer.
   */
  public abstract readonly streamConsumerArn: string;

  /**
   * The name of the stream consumer.
   */
  public abstract readonly streamConsumerName: string;

  /**
   * The Kinesis data stream this consumer is associated with.
   */
  public abstract readonly stream: IStream;

  /**
   * Indicates if a resource policy should automatically be created upon
   * the first call to `addToResourcePolicy`.
   *
   * Set by subclasses.
   */
  protected abstract readonly autoCreatePolicy: boolean;

  private resourcePolicy?: ResourcePolicy;

  /**
   * Adds a statement to the IAM resource policy associated with this stream consumer.
   *
   * If this stream consumer was created in this stack (`new StreamConsumer`), a resource policy
   * will be automatically created upon the first call to `addToResourcePolicy`. If
   * the stream is imported (`StreamConsumer.from`), then this is a no-op.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this.resourcePolicy && this.autoCreatePolicy) {
      this.resourcePolicy = new ResourcePolicy(this, 'Policy', { streamConsumer: this });
    }

    if (this.resourcePolicy) {
      this.resourcePolicy.document.addStatements(statement);
      return { statementAdded: true, policyDependable: this.resourcePolicy };
    }
    return { statementAdded: false };
  }

  /**
   * Grant read permissions for this stream consumer and its associated stream to an IAM
   * principal (Role/Group/User).
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    this.stream.grantRead(grantee);
    return this.grant(grantee, ...READ_OPERATIONS);
  }

  /**
   * Grant the indicated permissions on this stream consumer to the given IAM principal (Role/Group/User).
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions,
      resourceArns: [this.streamConsumerArn],
      resource: this,
    });
  }
}

/**
 * A reference to a StreamConsumer, which can be imported using `StreamConsumer.fromStreamConsumerAttributes`.
 */
export interface StreamConsumerAttributes {
  /**
   * The Amazon Resource Name (ARN) of the stream consumer.
   */
  readonly streamConsumerArn: string;
}

/**
 * Properties for a Kinesis Stream Consumer.
 */
export interface StreamConsumerProps {
  /**
   * The name of the stream consumer.
   */
  readonly streamConsumerName: string;

  /**
   * The Kinesis data stream to associate this consumer with.
   */
  readonly stream: IStream;
}

/**
 * A Kinesis Stream Consumer
 */
export class StreamConsumer extends StreamConsumerBase {
  /**
   * Imports an existing Kinesis Stream Consumer by its arn.
   *
   * @param scope the Construct scope.
   * @param id the ID of the construct.
   * @param streamConsumerArn the arn of the existing stream consumer.
   */
  public static fromStreamConsumerArn(scope: Construct, id: string, streamConsumerArn: string): IStreamConsumer {
    return StreamConsumer.fromStreamConsumerAttributes(scope, id, { streamConsumerArn });
  }

  /**
   * Imports an existing Kinesis Stream Consumer by its attributes.
   *
   * @param scope the Construct scope.
   * @param id the ID of the construct.
   * @param attrs the attributes of the existing stream consumer.
   */
  public static fromStreamConsumerAttributes(scope: Construct, id: string, attrs: StreamConsumerAttributes): IStreamConsumer {
    const parsedArn = Stack.of(scope).splitArn(attrs.streamConsumerArn, ArnFormat.SLASH_RESOURCE_NAME);
    const [streamName, _consumer, consumerNameTimestamp] = parsedArn.resourceName!.split('/');
    const [consumerName, _creationTimestamp] = consumerNameTimestamp.split(':');
    const streamArn = Stack.of(scope).formatArn({
      ...parsedArn,
      resourceName: streamName,
    });

    class Import extends StreamConsumerBase {
      public readonly streamConsumerArn = attrs.streamConsumerArn;
      public readonly streamConsumerName = consumerName;
      public readonly stream = Stream.fromStreamArn(scope, `${id}ImportedStream`, streamArn);

      protected readonly autoCreatePolicy = false;
    }

    return new Import(scope, id);
  }

  /**
   * The Amazon Resource Name (ARN) of the stream consumer.
   */
  public readonly streamConsumerArn: string;

  /**
   * The name of the stream consumer.
   */
  public readonly streamConsumerName: string;

  /**
   * The Kinesis data stream this consumer is associated with.
   */
  public readonly stream: IStream;

  protected readonly autoCreatePolicy = true;

  constructor(scope: Construct, id: string, props: StreamConsumerProps) {
    super(scope, id, {
      physicalName: props.streamConsumerName,
    });

    const streamConsumer = new CfnStreamConsumer(this, 'Resource', {
      consumerName: props.streamConsumerName,
      streamArn: props.stream.streamArn,
    });

    this.streamConsumerArn = this.getResourceArnAttribute(streamConsumer.attrConsumerArn, {
      service: 'kinesis',
      resource: 'stream',
      // use '*' in place of the consumer creation timestamp for cross environment references
      resourceName: `${props.stream.streamName}/consumer/${this.physicalName}:*`,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    this.streamConsumerName = this.getResourceNameAttribute(streamConsumer.attrConsumerName);
    this.stream = props.stream;
  }
}
