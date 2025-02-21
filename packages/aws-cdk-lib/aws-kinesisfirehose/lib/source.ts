import { Construct } from 'constructs';
import { CfnDeliveryStream } from './kinesisfirehose.generated';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';

/**
 * A Kinesis Data Firehose delivery stream source configuration.
 */
interface SourceConfig {
  /**
   * Configuration for using a Kinesis Data Stream as a source for the delivery stream.
   *
   * This will be returned by the _bind method depending on what type of Source class is specified.
   *
   * @default - Kinesis Data Stream Source configuration property is not provided.
   */
  readonly kinesisStreamSourceConfiguration?: CfnDeliveryStream.KinesisStreamSourceConfigurationProperty;

  /**
   * Configuration for using an MSK (Managed Streaming for Kafka) cluster as a source for the delivery stream.
   *
   * This will be returned by the _bind method depending on what type of Source class is specified.
   *
   * @default - MSK Source configuration property is not provided.
   */
  readonly mskSourceConfiguration?: CfnDeliveryStream.MSKSourceConfigurationProperty;
}

/**
 * An interface for defining a source that can be used in a Kinesis Data Firehose delivery stream.
 */
export interface ISource {
  /**
   * Binds this source to the Kinesis Data Firehose delivery stream.
   *
   * @internal
   */
  _bind(scope: Construct, roleArn?: string): SourceConfig;

  /**
   * Grant read permissions for this source resource and its contents to an IAM
   * principal (the delivery stream).
   *
   * If an encryption key is used, permission to use the key to decrypt the
   * contents of the stream will also be granted.
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * A Kinesis Data Firehose delivery stream source.
 */
export class KinesisStreamSource implements ISource {
  /**
   * Creates a new KinesisStreamSource.
   */
  constructor(private readonly stream: kinesis.IStream) {}

  grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.stream.grantRead(grantee);
  }

  /**
   * Binds the Kinesis stream as a source for the Kinesis Data Firehose delivery stream.
   *
   * @returns The configuration needed to use this Kinesis stream as the delivery stream source.
   * @internal
   */
  _bind(_scope: Construct, roleArn: string): SourceConfig {
    return {
      kinesisStreamSourceConfiguration: {
        kinesisStreamArn: this.stream.streamArn,
        roleArn: roleArn,
      },
    };
  }
}
