import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './kinesis.generated';

/**
 * A reference to a stream. The easiest way to instantiate is to call
 * `stream.export()`. Then, the consumer can use `Stream.import(this, ref)` and
 * get a `Stream`.
 */
export interface StreamRefProps {
  /**
   * The ARN of the stream.
   */
  streamArn: string;

  /**
   * The KMS key securing the contents of the stream if encryption is enabled.
   */
  encryptionKey?: kms.EncryptionKeyRefProps;
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
 *   StreamRef.import(this, 'MyImportedStream', { streamArn: ... });
 *
 * You can also export a stream and import it into another stack:
 *
 *   const ref = myStream.export();
 *   StreamRef.import(this, 'MyImportedStream', ref);
 *
 */
export abstract class StreamRef extends cdk.Construct implements logs.ILogSubscriptionDestination {
  /**
   * Creates a Stream construct that represents an external stream.
   *
   * @param parent The parent creating construct (usually `this`).
   * @param name The construct's name.
   * @param ref A StreamRefProps object. Can be obtained from a call to
   * `stream.export()`.
   */
  public static import(parent: cdk.Construct, name: string, props: StreamRefProps): StreamRef {
    return new ImportedStreamRef(parent, name, props);
  }

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
  public abstract readonly encryptionKey?: kms.EncryptionKeyRef;

  /**
   * The role that can be used by CloudWatch logs to write to this stream
   */
  private cloudWatchLogsRole?: iam.Role;

  /**
   * Exports this stream from the stack.
   */
  public export(): StreamRefProps {
    return {
      streamArn: new cdk.Output(this, 'StreamArn', { value: this.streamArn }).makeImportValue().toString(),
      encryptionKey: this.encryptionKey ? this.encryptionKey.export() : undefined,
    };
  }

  /**
   * Grant write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  public grantRead(identity?: iam.IIdentityResource) {
    if (!identity) {
      return;
    }
    this.grant(
      identity,
      {
        streamActions: [
          'kinesis:DescribeStream',
          'kinesis:GetRecords',
          'kinesis:GetShardIterator'
        ],
        keyActions: [
          'kms:Decrypt'
        ]
      }
    );
  }

  /**
   * Grant read permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
   * contents of the stream will also be granted.
   */
  public grantWrite(identity?: iam.IIdentityResource) {
    if (!identity) {
      return;
    }

    this.grant(
      identity,
      {
        streamActions: [
          'kinesis:DescribeStream',
          'kinesis:PutRecord',
          'kinesis:PutRecords'
        ],
        keyActions: [
          'kms:GenerateDataKey',
          'kms:Encrypt'
        ]
      }
    );
  }

  /**
   * Grants read/write permissions for this stream and its contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to use the key for
   * encrypt/decrypt will also be granted.
   */
  public grantReadWrite(identity?: iam.IIdentityResource) {
    if (!identity) {
      return;
    }
    this.grant(
      identity,
      {
        streamActions: [
          'kinesis:DescribeStream',
          'kinesis:GetRecords',
          'kinesis:GetShardIterator',
          'kinesis:PutRecord',
          'kinesis:PutRecords'
        ],
        keyActions: [
          'kms:Decrypt',
          'kms:GenerateDataKey',
          'kms:Encrypt'
        ]
      }
    );
  }

  public logSubscriptionDestination(sourceLogGroup: logs.LogGroupRef): logs.LogSubscriptionDestination {
    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#DestinationKinesisExample
    if (!this.cloudWatchLogsRole) {
      // Create a role to be assumed by CWL that can write to this stream and pass itself.
      this.cloudWatchLogsRole = new iam.Role(this, 'CloudWatchLogsCanPutRecords', {
        assumedBy: new cdk.ServicePrincipal(new cdk.FnConcat('logs.', new cdk.AwsRegion(), '.amazonaws.com').toString()),
      });
      this.cloudWatchLogsRole.addToPolicy(new cdk.PolicyStatement().addAction('kinesis:PutRecord').addResource(this.streamArn));
      this.cloudWatchLogsRole.addToPolicy(new cdk.PolicyStatement().addAction('iam:PassRole').addResource(this.cloudWatchLogsRole.roleArn));
    }

    // We've now made it possible for CloudWatch events to write to us. In case the LogGroup is in a
    // different account, we must add a Destination in between as well.
    const sourceStack = cdk.Stack.find(sourceLogGroup);
    const thisStack = cdk.Stack.find(this);

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
  private crossAccountLogSubscriptionDestination(sourceLogGroup: logs.LogGroupRef): logs.LogSubscriptionDestination {
    const sourceStack = cdk.Stack.find(sourceLogGroup);
    const thisStack = cdk.Stack.find(this);

    if (!sourceStack.env.account || !thisStack.env.account) {
      throw new Error('SubscriptionFilter stack and Destination stack must either both have accounts defined, or both not have accounts');
    }

    // Take some effort to construct a unique ID for the destination that is unique to the
    // combination of (stream, loggroup).
    const uniqueId =  new cdk.HashedAddressingScheme().allocateAddress([sourceLogGroup.path.replace('/', ''), sourceStack.env.account!]);

    // The destination lives in the target account
    const dest = new logs.CrossAccountDestination(this, `CWLDestination${uniqueId}`, {
      targetArn: this.streamArn,
      role: this.cloudWatchLogsRole!
    });

    dest.addToPolicy(new cdk.PolicyStatement()
      .addAction('logs:PutSubscriptionFilter')
      .addAwsAccountPrincipal(sourceStack.env.account)
      .addAllResources());

    return dest.logSubscriptionDestination(sourceLogGroup);
  }

  private grant(identity: iam.IIdentityResource, actions: { streamActions: string[], keyActions: string[] }) {
    identity.addToPolicy(new cdk.PolicyStatement()
      .addResource(this.streamArn)
      .addActions(...actions.streamActions));

    // grant key permissions if there's an associated key.
    if (this.encryptionKey) {
      identity.addToPolicy(new cdk.PolicyStatement()
        .addResource(this.encryptionKey.keyArn)
        .addActions(...actions.keyActions));
    }
  }
}

export interface StreamProps {
  /**
   * Enforces a particular physical stream name.
   * @default <generated>
   */
  streamName?: string;

  /**
   * The number of hours for the data records that are stored in shards to remain accessible.
   * @default 24
   */
  retentionPeriodHours?: number;

  /**
   * The number of shards for the stream.
   * @default 1
   */
  shardCount?: number;

  /**
   * The kind of server-side encryption to apply to this stream.
   *
   * If you choose KMS, you can specify a KMS key via `encryptionKey`. If
   * encryption key is not specified, a key will automatically be created.
   *
   * @default Unencrypted
   */
  encryption?: StreamEncryption;

  /**
   * External KMS key to use for stream encryption.
   *
   * The 'encryption' property must be set to "Kms".
   *
   * @default If encryption is set to "Kms" and this property is undefined, a
   * new KMS key will be created and associated with this stream.
   */
  encryptionKey?: kms.EncryptionKeyRef;
}

/**
 * A Kinesis stream. Can be encrypted with a KMS key.
 */
export class Stream extends StreamRef {
  public readonly streamArn: string;
  public readonly streamName: string;
  public readonly encryptionKey?: kms.EncryptionKeyRef;

  private readonly stream: cloudformation.StreamResource;

  constructor(parent: cdk.Construct, name: string, props: StreamProps = {}) {
    super(parent, name);

    const shardCount = props.shardCount || 1;
    const retentionPeriodHours = props.retentionPeriodHours || 24;
    if (retentionPeriodHours < 24 && retentionPeriodHours > 168) {
      throw new Error("retentionPeriodHours must be between 24 and 168 hours");
    }

    const { streamEncryption, encryptionKey } = this.parseEncryption(props);

    this.stream = new cloudformation.StreamResource(this, "Resource", {
      streamName: props.streamName,
      retentionPeriodHours,
      shardCount,
      streamEncryption
    });
    this.streamArn = this.stream.streamArn;
    this.streamName = this.stream.streamId;
    this.encryptionKey = encryptionKey;

    if (props.streamName) { this.addMetadata('aws:cdk:hasPhysicalName', props.streamName); }
  }

  /**
   * Set up key properties and return the Stream encryption property from the
   * user's configuration.
   */
  private parseEncryption(props: StreamProps): {
    streamEncryption?: cloudformation.StreamResource.StreamEncryptionProperty,
    encryptionKey?: kms.EncryptionKeyRef
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
        description: `Created by ${this.path}`
      });

      const streamEncryption: cloudformation.StreamResource.StreamEncryptionProperty = {
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

class ImportedStreamRef extends StreamRef {
  public readonly streamArn: string;
  public readonly streamName: string;
  public readonly encryptionKey?: kms.EncryptionKeyRef;

  constructor(parent: cdk.Construct, name: string, props: StreamRefProps) {
    super(parent, name);

    this.streamArn = props.streamArn;

    // Get the name from the ARN
    this.streamName = cdk.ArnUtils.parse(props.streamArn).resourceName!;

    if (props.encryptionKey) {
      this.encryptionKey = kms.EncryptionKeyRef.import(parent, 'Key', props.encryptionKey);
    } else {
      this.encryptionKey = undefined;
    }
  }
}
