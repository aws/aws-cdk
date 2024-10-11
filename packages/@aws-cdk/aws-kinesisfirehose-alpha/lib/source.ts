import { Construct } from 'constructs';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';

/**
 * A Kinesis Data Firehose delivery stream source configuration.
 *
 * @internal
 */
export interface SourceConfig {
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
 * Implementers will provide the necessary configurations for the delivery stream.
 */
export interface ISource {
  /**
   * Binds this source to the Kinesis Data Firehose delivery stream.
   *
   * Implementers should use this method to bind resources to the stack and initialize values using the provided stream.
   *
   * @internal
   */
  _bind(scope: Construct, roleArn?: string): SourceConfig;

  /**
   * Grant read permissions for this source resource and its contents to an IAM
   * principal (the delivery stream).
   *
   * If an encryption key is used, permission to ues the key to decrypt the
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

// /**
//  * A Kinesis Data Firehose delivery stream source using Amazon MSK (Managed Streaming for Kafka).
//  */
// export class MSKSource implements ISource {

//   /**
//      * Creates a new MSKSource.
//     */
//   constructor(
//     private readonly mskCluster: msk.Cluster,
//     private readonly topicName: string,
//     private readonly authenticationConfiguration: CfnDeliveryStream.AuthenticationConfigurationProperty,
//     private readonly readFromTimestamp?: string,
//   ) {
//     if (!Token.isUnresolved(this.mskCluster.clusterArn)) {
//       const arnPattern = /^arn:.*/;

//       if (!arnPattern.test(this.mskCluster.clusterArn)) {
//         throw new Error(`Invalid ARN: "${this.mskCluster.clusterArn}". An ARN must start with 'arn:' and follow the format 'arn:partition:service:region:account-id:resource'.`);
//       }
//       if (this.mskCluster.clusterArn.length > 512) {
//         throw new Error('MSKClusterArn must be at most 512 characters long');
//       }
//     }

//     // Pattern: [a-zA-Z0-9\._\-]+ (alphanumeric characters, dots, underscores, and hyphens)
//     if (!Token.isUnresolved(this.topicName)) {
//       const pattern = /^[a-zA-Z0-9._-]+$/;

//       if (!pattern.test(topicName)) {
//         throw new Error(`Invalid topicName: "${topicName}". The input must only contain alphanumeric characters, dots (.), underscores (_), or hyphens (-).`);
//       }
//       if (this.topicName.length < 1 || this.topicName.length > 255) {
//         throw new Error('TopicName must be between 1 and 255 characters long');
//       }
//     }
//   }
//   grantRead(grantee: iam.IGrantable): iam.Grant {
//     throw new Error('Method not implemented.');
//   }
//   /**
//    * Binds the MSK cluster as a source for the Kinesis Data Firehose delivery stream.
//    *
//    * @returns The configuration needed to use this MSK cluster as the delivery stream source.
//    * @internal
//    */
//   _bind(_scope: Construct): SourceConfig {
//     return {
//       mskSourceConfigurationProperty: {
//         mskClusterArn: this.mskCluster.clusterArn,
//         topicName: this.topicName,
//         authenticationConfiguration: this.authenticationConfiguration,
//         readFromTimestamp: this.readFromTimestamp,
//       },
//     };
//   }
// }
