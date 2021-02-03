import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { Aws, CfnCondition, Duration, Fn, IResolvable, IResource, Resource, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStream } from './kinesis.generated';

const READ_OPERATIONS = [
  'kinesis:DescribeStreamSummary',
  'kinesis:GetRecords',
  'kinesis:GetShardIterator',
  'kinesis:ListShards',
  'kinesis:SubscribeToShard',
];

const WRITE_OPERATIONS = [
  'kinesis:ListShards',
  'kinesis:PutRecord',
  'kinesis:PutRecords',
];

/**
 * A Kinesis Stream
 */
export interface IStream extends IResource {
  /**
   * The ARN of the stream.
   *
   * @attribute
   */
  readonly streamArn: string;

  /**
   * The name of the stream
   *
   * @attribute
   */
  readonly streamName: string;

  /**
   * Optional KMS encryption key associated with this stream.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Grant read permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to encrypt the
   * contents of the stream will also be granted.
   */
  grantWrite(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants read/write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to use the key for
   * encrypt/decrypt will also be granted.
   */
  grantReadWrite(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the indicated permissions on this stream to the provided IAM principal.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
}

/**
 * A reference to a stream. The easiest way to instantiate is to call
 * `stream.export()`. Then, the consumer can use `Stream.import(this, ref)` and
 * get a `Stream`.
 */
export interface StreamAttributes {
  /**
   * The ARN of the stream.
   */
  readonly streamArn: string;

  /**
   * The KMS key securing the contents of the stream if encryption is enabled.
   *
   * @default - No encryption
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Represents a Kinesis Stream.
 */
abstract class StreamBase extends Resource implements IStream {
  /**
   * The ARN of the stream.
   */
  public abstract readonly streamArn: string;

  /**
   * The name of the stream
   */
  public abstract readonly streamName: string;

  /**
   * Optional KMS encryption key associated with this stream.
   */
  public abstract readonly encryptionKey?: kms.IKey;

  /**
   * Grant write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  public grantRead(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, ...READ_OPERATIONS);

    if (this.encryptionKey) {
      this.encryptionKey.grantDecrypt(grantee);
    }

    return ret;
  }

  /**
   * Grant read permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  public grantWrite(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, ...WRITE_OPERATIONS);
    this.encryptionKey?.grantEncrypt(grantee);

    return ret;
  }

  /**
   * Grants read/write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to use the key for
   * encrypt/decrypt will also be granted.
   */
  public grantReadWrite(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, ...Array.from(new Set([...READ_OPERATIONS, ...WRITE_OPERATIONS])));
    this.encryptionKey?.grantEncryptDecrypt(grantee);

    return ret;
  }

  /**
   * Grant the indicated permissions on this stream to the given IAM principal (Role/Group/User).
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.streamArn],
      scope: this,
    });
  }
}

/**
 * Properties for a Kinesis Stream
 */
export interface StreamProps {
  /**
   * Enforces a particular physical stream name.
   * @default <generated>
   */
  readonly streamName?: string;

  /**
   * The number of hours for the data records that are stored in shards to remain accessible.
   * @default Duration.hours(24)
   */
  readonly retentionPeriod?: Duration;

  /**
   * The number of shards for the stream.
   * @default 1
   */
  readonly shardCount?: number;

  /**
   * The kind of server-side encryption to apply to this stream.
   *
   * If you choose KMS, you can specify a KMS key via `encryptionKey`. If
   * encryption key is not specified, a key will automatically be created.
   *
   * @default - StreamEncryption.KMS if encrypted Streams are supported in the region
   *   or StreamEncryption.UNENCRYPTED otherwise.
   *   StreamEncryption.KMS if an encryption key is supplied through the encryptionKey property
   */
  readonly encryption?: StreamEncryption;

  /**
   * External KMS key to use for stream encryption.
   *
   * The 'encryption' property must be set to "Kms".
   *
   * @default - Kinesis Data Streams master key ('/alias/aws/kinesis').
   *   If encryption is set to StreamEncryption.KMS and this property is undefined, a new KMS key
   *   will be created and associated with this stream.
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A Kinesis stream. Can be encrypted with a KMS key.
 */
export class Stream extends StreamBase {

  /**
   * Import an existing Kinesis Stream provided an ARN
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name
   * @param streamArn Stream ARN (i.e. arn:aws:kinesis:<region>:<account-id>:stream/Foo)
   */
  public static fromStreamArn(scope: Construct, id: string, streamArn: string): IStream {
    return Stream.fromStreamAttributes(scope, id, { streamArn });
  }

  /**
   * Creates a Stream construct that represents an external stream.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs Stream import properties
   */
  public static fromStreamAttributes(scope: Construct, id: string, attrs: StreamAttributes): IStream {
    class Import extends StreamBase {
      public readonly streamArn = attrs.streamArn;
      public readonly streamName = Stack.of(scope).parseArn(attrs.streamArn).resourceName!;
      public readonly encryptionKey = attrs.encryptionKey;
    }

    return new Import(scope, id);
  }

  public readonly streamArn: string;
  public readonly streamName: string;
  public readonly encryptionKey?: kms.IKey;

  private readonly stream: CfnStream;

  constructor(scope: Construct, id: string, props: StreamProps = {}) {
    super(scope, id, {
      physicalName: props.streamName,
    });

    const shardCount = props.shardCount || 1;
    const retentionPeriodHours = props.retentionPeriod?.toHours() ?? 24;
    if (!Token.isUnresolved(retentionPeriodHours)) {
      if (retentionPeriodHours < 24 || retentionPeriodHours > 8760) {
        throw new Error(`retentionPeriod must be between 24 and 8760 hours. Received ${retentionPeriodHours}`);
      }
    }

    const { streamEncryption, encryptionKey } = this.parseEncryption(props);

    this.stream = new CfnStream(this, 'Resource', {
      name: this.physicalName,
      retentionPeriodHours,
      shardCount,
      streamEncryption,
    });

    this.streamArn = this.getResourceArnAttribute(this.stream.attrArn, {
      service: 'kinesis',
      resource: 'stream',
      resourceName: this.physicalName,
    });
    this.streamName = this.getResourceNameAttribute(this.stream.ref);

    this.encryptionKey = encryptionKey;
  }

  /**
   * Set up key properties and return the Stream encryption property from the
   * user's configuration.
   */
  private parseEncryption(props: StreamProps): {
    streamEncryption?: CfnStream.StreamEncryptionProperty | IResolvable
    encryptionKey?: kms.IKey
  } {

    // if encryption properties are not set, default to KMS in regions where KMS is available
    if (!props.encryption && !props.encryptionKey) {

      const conditionName = 'AwsCdkKinesisEncryptedStreamsUnsupportedRegions';
      const existing = Stack.of(this).node.tryFindChild(conditionName);

      // create a single condition for the Stack
      if (!existing) {
        new CfnCondition(Stack.of(this), conditionName, {
          expression: Fn.conditionOr(
            Fn.conditionEquals(Aws.REGION, 'cn-north-1'),
            Fn.conditionEquals(Aws.REGION, 'cn-northwest-1'),
          ),
        });
      }

      return {
        streamEncryption: Fn.conditionIf(conditionName,
          Aws.NO_VALUE,
          { EncryptionType: 'KMS', KeyId: 'alias/aws/kinesis' }),
      };
    }

    // default based on whether encryption key is specified
    const encryptionType = props.encryption ??
      (props.encryptionKey ? StreamEncryption.KMS : StreamEncryption.UNENCRYPTED);

    // if encryption key is set, encryption must be set to KMS.
    if (encryptionType !== StreamEncryption.KMS && props.encryptionKey) {
      throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
    }

    if (encryptionType === StreamEncryption.UNENCRYPTED) {
      return { };
    }

    if (encryptionType === StreamEncryption.MANAGED) {
      const encryption = { encryptionType: 'KMS', keyId: 'alias/aws/kinesis' };
      return { streamEncryption: encryption };
    }

    if (encryptionType === StreamEncryption.KMS) {
      const encryptionKey = props.encryptionKey || new kms.Key(this, 'Key', {
        description: `Created by ${this.node.path}`,
      });

      const streamEncryption: CfnStream.StreamEncryptionProperty = {
        encryptionType: 'KMS',
        keyId: encryptionKey.keyArn,
      };
      return { encryptionKey, streamEncryption };
    }

    throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
  }
}

/**
 * What kind of server-side encryption to apply to this stream
 */
export enum StreamEncryption {
  /**
   * Records in the stream are not encrypted.
   */
  UNENCRYPTED = 'NONE',

  /**
   * Server-side encryption with a KMS key managed by the user.
   * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
   */
  KMS = 'KMS',

  /**
   * Server-side encryption with a master key managed by Amazon Kinesis
   */
  MANAGED = 'MANAGED'
}
