import type { Construct } from 'constructs';
import { CfnStreamConsumer } from './kinesis.generated';
import { ResourcePolicy } from './resource-policy';
import type { IStream } from './stream';
import { Stream } from './stream';
import * as iam from '../../aws-iam';
import type { IResource } from '../../core';
import { ArnFormat, Resource, Stack } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IStreamConsumerRef, StreamConsumerReference } from '../../interfaces/generated/aws-kinesis-interfaces.generated';

const READ_OPERATIONS = [
  'kinesis:DescribeStreamConsumer',
  'kinesis:SubscribeToShard',
];

/**
 * A Kinesis Stream Consumer
 */
export interface IStreamConsumer extends IResource, IStreamConsumerRef {
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
   * A reference to this stream consumer.
   */
  public get streamConsumerRef(): StreamConsumerReference {
    return {
      consumerArn: this.streamConsumerArn,
    };
  }

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
   *
   * [disable-awslint:no-grants]
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    this.stream.grantRead(grantee);
    return this.grant(grantee, ...READ_OPERATIONS);
  }

  /**
   * Grant the indicated permissions on this stream consumer to the given IAM principal (Role/Group/User).
   *
   * [disable-awslint:no-grants]
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
@propertyInjectable
export class StreamConsumer extends StreamConsumerBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-kinesis.StreamConsumer';

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

  private readonly streamConsumer: CfnStreamConsumer;

  /**
   * The Kinesis data stream this consumer is associated with.
   */
  public readonly stream: IStream;

  protected readonly autoCreatePolicy = true;

  /**
   * The Amazon Resource Name (ARN) of the stream consumer.
   */
  @memoizedGetter
  public get streamConsumerArn(): string {
    return this.getResourceArnAttribute(this.streamConsumer.attrConsumerArn, {
      service: 'kinesis',
      resource: 'stream',
      // use '*' in place of the consumer creation timestamp for cross environment references
      resourceName: `${this.stream.streamName}/consumer/${this.physicalName}:*`,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * The name of the stream consumer.
   */
  @memoizedGetter
  public get streamConsumerName(): string {
    return this.getResourceNameAttribute(this.streamConsumer.attrConsumerName);
  }

  constructor(scope: Construct, id: string, props: StreamConsumerProps) {
    super(scope, id, {
      physicalName: props.streamConsumerName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.streamConsumer = new CfnStreamConsumer(this, 'Resource', {
      consumerName: props.streamConsumerName,
      streamArn: props.stream.streamArn,
    });

    this.stream = props.stream;
  }
}
