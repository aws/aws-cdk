import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeliveryStream } from './kinesisfirehose.generated';

/**
 * A Kinesis Data Firehose delivery stream destination configuration.
 */
export interface DestinationConfig {
  /**
   * S3 destination configuration properties.
   *
   * @default - S3 destination is not configured.
   */
  readonly extendedS3DestinationConfiguration?: CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty;


  /**
   * Redshift destination configuration properties.
   *
   * @default - Redshift destination is not configured.
   */
  readonly redshiftDestinationConfiguration?: CfnDeliveryStream.RedshiftDestinationConfigurationProperty;

  /**
   * Any resources that were created by the destination when binding it to the stack that must be deployed before the delivery stream is deployed.
   *
   * @default []
   */
  readonly dependables?: cdk.IDependable[];
}

/**
 * Options when binding a destination to a delivery stream.
 */
export interface DestinationBindOptions {
  /**
   * Network connections for the Kinesis Data Firehose service.
   */
  readonly connections: ec2.Connections;
}

/**
 * A Kinesis Data Firehose delivery stream destination.
 */
export interface IDestination {
  /**
   * Binds this destination to the Kinesis Data Firehose delivery stream.
   *
   * Implementers should use this method to bind resources to the stack and initialize values using the provided stream.
   */
  bind(scope: Construct, options: DestinationBindOptions): DestinationConfig;
}
