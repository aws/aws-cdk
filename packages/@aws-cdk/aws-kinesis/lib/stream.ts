import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import logs = require('@aws-cdk/aws-logs');
import { Construct, HashedAddressingScheme, IResource, Resource } from '@aws-cdk/cdk';
import { CfnStream } from './kinesis.generated';

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
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Represents a Kinesis Stream.
 *
 * Streams can be either defined within this stack:
 *
 *   new Stream(this, 'MyStream', { props });
 *
 * Or imported from an existing stream:
 *
 *   Stream.import(this, 'MyImportedStream', { streamArn: ... });
 *
 * You can also export a stream and import it into another stack:
 *
 *   const ref = myStream.export();
 *   Stream.import(this, 'MyImportedStream', ref);
 *
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
   * The role that can be used by CloudWatch logs to write to this stream
   */
  private cloudWatchLogsRole?: iam.Role;

  /**
   * Grant write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  public grantRead(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, 'kinesis:DescribeStream', 'kinesis:GetRecords', 'kinesis:GetShardIterator');

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
    const ret = this.grant(grantee, 'kinesis:DescribeStream', 'kinesis:PutRecord', 'kinesis:PutRecords');

    if (this.encryptionKey) {
      this.encryptionKey.grantEncrypt(grantee);
    }

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
    const ret = this.grant(
        grantee,
        'kinesis:DescribeStream',
        'kinesis:GetRecords',
        'kinesis:GetShardIterator',
        'kinesis:PutRecord',
        'kinesis:PutRecords');

    if (this.encryptionKey) {
      this.encryptionKey.grantEncryptDecrypt(grantee);
    }

    return ret;
  }

  private grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.streamArn],
      scope: this,
    });
  }
}

export interface StreamProps {
  /**
   * Enforces a particular physical stream name.
   * @default <generated>
   */
  readonly streamName?: string;

  /**
   * The number of hours for the data records that are stored in shards to remain accessible.
   * @default 24
   */
  readonly retentionPeriodHours?: number;

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
   * @default Unencrypted
   */
  readonly encryption?: StreamEncryption;

  /**
   * External KMS key to use for stream encryption.
   *
   * The 'encryption' property must be set to "Kms".
   *
   * @default If encryption is set to "Kms" and this property is undefined, a
   * new KMS key will be created and associated with this stream.
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A Kinesis stream. Can be encrypted with a KMS key.
 */
export class Stream extends StreamBase {

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
      public readonly streamName = scope.node.stack.parseArn(attrs.streamArn).resourceName!;
      public readonly encryptionKey = attrs.encryptionKey;
    }

    return new Import(scope, id);
  }

  public readonly streamArn: string;
  public readonly streamName: string;
  public readonly encryptionKey?: kms.IKey;

  private readonly stream: CfnStream;

  constructor(scope: Construct, id: string, props: StreamProps = {}) {
    super(scope, id);

    const shardCount = props.shardCount || 1;
    const retentionPeriodHours = props.retentionPeriodHours || 24;
    if (retentionPeriodHours < 24 && retentionPeriodHours > 168) {
      throw new Error("retentionPeriodHours must be between 24 and 168 hours");
    }

    const { streamEncryption, encryptionKey } = this.parseEncryption(props);

    this.stream = new CfnStream(this, "Resource", {
      name: props.streamName,
      retentionPeriodHours,
      shardCount,
      streamEncryption
    });
    this.streamArn = this.stream.streamArn;
    this.streamName = this.stream.streamId;
    this.encryptionKey = encryptionKey;

    if (props.streamName) { this.node.addMetadata('aws:cdk:hasPhysicalName', props.streamName); }
  }

  /**
   * Set up key properties and return the Stream encryption property from the
   * user's configuration.
   */
  private parseEncryption(props: StreamProps): {
    streamEncryption?: CfnStream.StreamEncryptionProperty,
    encryptionKey?: kms.IKey
  } {

    // default to unencrypted.
    const encryptionType = props.encryption || StreamEncryption.Unencrypted;

    // if encryption key is set, encryption must be set to KMS.
    if (encryptionType !== StreamEncryption.Kms && props.encryptionKey) {
      throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
    }

    if (encryptionType === StreamEncryption.Unencrypted) {
      return { streamEncryption: undefined, encryptionKey: undefined };
    }

    if (encryptionType === StreamEncryption.Kms) {
      const encryptionKey = props.encryptionKey || new kms.Key(this, 'Key', {
        description: `Created by ${this.node.path}`
      });

      const streamEncryption: CfnStream.StreamEncryptionProperty = {
        encryptionType: 'KMS',
        keyId: encryptionKey.keyArn
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
  Unencrypted = 'NONE',

  /**
   * Server-side encryption with a KMS key managed by the user.
   * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
   */
  Kms = 'KMS',
}
