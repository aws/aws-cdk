import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { CfnStream } from './kinesis.generated';

export interface IStream extends cdk.IConstruct, logs.ILogSubscriptionDestination {
  /**
   * The ARN of the stream.
   */
  readonly streamArn: string;

  /**
   * The name of the stream
   */
  readonly streamName: string;

  /**
   * Optional KMS encryption key associated with this stream.
   */
  readonly encryptionKey?: kms.IEncryptionKey;

  /**
   * Exports this stream from the stack.
   */
  export(): StreamImportProps;

  /**
   * Grant read permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  grantRead(identity: iam.IPrincipal): iam.Grant;

  /**
   * Grant write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to encrypt the
   * contents of the stream will also be granted.
   */
  grantWrite(identity: iam.IPrincipal): iam.Grant;

  /**
   * Grants read/write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to use the key for
   * encrypt/decrypt will also be granted.
   */
  grantReadWrite(identity: iam.IPrincipal): iam.Grant;
}

/**
 * A reference to a stream. The easiest way to instantiate is to call
 * `stream.export()`. Then, the consumer can use `Stream.import(this, ref)` and
 * get a `Stream`.
 */
export interface StreamImportProps {
  /**
   * The ARN of the stream.
   */
  readonly streamArn: string;

  /**
   * The KMS key securing the contents of the stream if encryption is enabled.
   */
  readonly encryptionKey?: kms.EncryptionKeyImportProps;
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
export abstract class StreamBase extends cdk.Construct implements IStream {
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
  public abstract readonly encryptionKey?: kms.IEncryptionKey;

  /**
   * The role that can be used by CloudWatch logs to write to this stream
   */
  private cloudWatchLogsRole?: iam.Role;

  public abstract export(): StreamImportProps;

  /**
   * Grant write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  public grantRead(principal: iam.IPrincipal) {
    const ret = this.grant(principal, 'kinesis:DescribeStream', 'kinesis:GetRecords', 'kinesis:GetShardIterator');

    if (this.encryptionKey) {
      this.encryptionKey.grantDecrypt(principal);
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
  public grantWrite(principal: iam.IPrincipal) {
    const ret = this.grant(principal, 'kinesis:DescribeStream', 'kinesis:PutRecord', 'kinesis:PutRecords');

    if (this.encryptionKey) {
      this.encryptionKey.grantEncrypt(principal);
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
  public grantReadWrite(principal: iam.IPrincipal) {
    const ret = this.grant(
        principal,
        'kinesis:DescribeStream',
        'kinesis:GetRecords',
        'kinesis:GetShardIterator',
        'kinesis:PutRecord',
        'kinesis:PutRecords');

    if (this.encryptionKey) {
      this.encryptionKey.grantEncryptDecrypt(principal);
    }

    return ret;
  }

  public logSubscriptionDestination(sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestination {
    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#DestinationKinesisExample
    if (!this.cloudWatchLogsRole) {
      // Create a role to be assumed by CWL that can write to this stream and pass itself.
      this.cloudWatchLogsRole = new iam.Role(this, 'CloudWatchLogsCanPutRecords', {
        assumedBy: new iam.ServicePrincipal(`logs.${this.node.stack.region}.amazonaws.com`)
      });
      this.cloudWatchLogsRole.addToPolicy(new iam.PolicyStatement().addAction('kinesis:PutRecord').addResource(this.streamArn));
      this.cloudWatchLogsRole.addToPolicy(new iam.PolicyStatement().addAction('iam:PassRole').addResource(this.cloudWatchLogsRole.roleArn));
    }

    // We've now made it possible for CloudWatch events to write to us. In case the LogGroup is in a
    // different account, we must add a Destination in between as well.
    const sourceStack = sourceLogGroup.node.stack;
    const thisStack = this.node.stack;

    // Case considered: if both accounts are undefined, we can't make any assumptions. Better
    // to assume we don't need to do anything special.
    const sameAccount = sourceStack.env.account === thisStack.env.account;

    if (!sameAccount) {
      return this.crossAccountLogSubscriptionDestination(sourceLogGroup);
    }

    return { arn: this.streamArn, role: this.cloudWatchLogsRole };
  }

  /**
   * Generate a CloudWatch Logs Destination and return the properties in the form o a subscription destination
   */
  private crossAccountLogSubscriptionDestination(sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestination {
    const sourceLogGroupConstruct: cdk.Construct = sourceLogGroup as any;
    const sourceStack = sourceLogGroupConstruct.node.stack;
    const thisStack = this.node.stack;

    if (!sourceStack.env.account || !thisStack.env.account) {
      throw new Error('SubscriptionFilter stack and Destination stack must either both have accounts defined, or both not have accounts');
    }

    // Take some effort to construct a unique ID for the destination that is unique to the
    // combination of (stream, loggroup).
    const uniqueId =  new cdk.HashedAddressingScheme().allocateAddress([
      sourceLogGroupConstruct.node.path.replace('/', ''),
      sourceStack.env.account!
    ]);

    // The destination lives in the target account
    const dest = new logs.CrossAccountDestination(this, `CWLDestination${uniqueId}`, {
      targetArn: this.streamArn,
      role: this.cloudWatchLogsRole!
    });

    dest.addToPolicy(new iam.PolicyStatement()
      .addAction('logs:PutSubscriptionFilter')
      .addAwsAccountPrincipal(sourceStack.env.account)
      .addAllResources());

    return dest.logSubscriptionDestination(sourceLogGroup);
  }

  private grant(principal: iam.IPrincipal, ...actions: string[]) {
    return iam.Grant.onPrincipal({
      principal,
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
  readonly encryptionKey?: kms.IEncryptionKey;
}

/**
 * A Kinesis stream. Can be encrypted with a KMS key.
 */
export class Stream extends StreamBase {
  /**
   * Creates a Stream construct that represents an external stream.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param ref A `StreamAttributes` object. Can be obtained from a call to
   * `stream.export()`.
   */
  public static import(scope: cdk.Construct, id: string, props: StreamImportProps): IStream {
    return new ImportedStream(scope, id, props);
  }

  public readonly streamArn: string;
  public readonly streamName: string;
  public readonly encryptionKey?: kms.IEncryptionKey;

  private readonly stream: CfnStream;

  constructor(scope: cdk.Construct, id: string, props: StreamProps = {}) {
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
   * Exports this stream from the stack.
   */
  public export(): StreamImportProps {
    return {
      streamArn: new cdk.CfnOutput(this, 'StreamArn', { value: this.streamArn }).makeImportValue().toString(),
      encryptionKey: this.encryptionKey ? this.encryptionKey.export() : undefined,
    };
  }

  /**
   * Set up key properties and return the Stream encryption property from the
   * user's configuration.
   */
  private parseEncryption(props: StreamProps): {
    streamEncryption?: CfnStream.StreamEncryptionProperty,
    encryptionKey?: kms.IEncryptionKey
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
      const encryptionKey = props.encryptionKey || new kms.EncryptionKey(this, 'Key', {
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

class ImportedStream extends StreamBase {
  public readonly streamArn: string;
  public readonly streamName: string;
  public readonly encryptionKey?: kms.IEncryptionKey;

  constructor(scope: cdk.Construct, id: string, private readonly props: StreamImportProps) {
    super(scope, id);

    this.streamArn = props.streamArn;

    // Get the name from the ARN
    this.streamName = this.node.stack.parseArn(props.streamArn).resourceName!;

    if (props.encryptionKey) {
      // TODO: import "scope" should be changed to "this"
      this.encryptionKey = kms.EncryptionKey.import(scope, 'Key', props.encryptionKey);
    } else {
      this.encryptionKey = undefined;
    }
  }

  public export() {
    return this.props;
  }
}
