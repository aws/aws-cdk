import { Construct } from 'constructs';
import { CfnRealtimeLogConfig } from './cloudfront.generated';
import { IResource, Resource } from '../../core';

/**
 * Endpoint data streams types.
 */
export enum DataStreamType {
  KINESIS = 'Kinesis'
}

/**
 * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
 */
export interface KinesisStreamConfig {
  /**
   * The Amazon Resource Name (ARN) of an AWS Identity and Access Management (IAM) role that CloudFront can use to send real-time log data to your Kinesis data stream.
   */
  readonly roleArn: string;
  /**
   * The Amazon Resource Name (ARN) of the Kinesis data stream where you are sending real-time log data.
   */
  readonly streamArn: string;
}

/**
 * Contains information about the Amazon Kinesis data stream where you are sending real-time log data in a real-time log configuration.
 */
export interface EndPoint {
  /**
   * Contains information about the Amazon Kinesis data stream where you are sending real-time log data.
   */
  readonly kinesisStreamConfig: KinesisStreamConfig,
  /**
   * The type of data stream where you are sending real-time log data.
   */
  readonly streamType: DataStreamType;
}

/**
 * Represents Realtime Log Configuration
 */
export interface IRealtimeLogConfig extends IResource {
  /**
   * The name of the realtime log config.
   */
  readonly realtimeLogConfigName: string;
  /**
   * The arn of the realtime log config.
   */
  readonly realtimeLogConfigArn: string;
}

export interface RealtimeLogConfigProps {
  /**
   * The unique name of this real-time log configuration.
   */
  readonly name: string;
  /**
   * A list of fields that are included in each real-time log record.
   */
  readonly fields: string[];
  /**
   * The sampling rate for this real-time log configuration.
   */
  readonly samplingRate: number;
  /**
   * Contains information about the Amazon Kinesis data stream where you are sending real-time log data for this real-time log configuration.
   */
  readonly endPoints: EndPoint[];
}

export class RealtimeLogConfig extends Resource implements IRealtimeLogConfig {
  public readonly realtimeLogConfigName: string;
  public readonly realtimeLogConfigArn: string;

  constructor(scope: Construct, id: string, props: RealtimeLogConfigProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    if ((props.samplingRate < 1 || props.samplingRate > 100)) {
      throw new Error(`Sampling rate must be between 1 and 100 (inclusive), received ${props.samplingRate}`);
    }

    const resource: CfnRealtimeLogConfig = new CfnRealtimeLogConfig(this, 'Resource', {
      endPoints: props.endPoints,
      fields: props.fields,
      name: this.physicalName,
      samplingRate: props.samplingRate,
    });

    this.realtimeLogConfigName = resource.ref;
    this.realtimeLogConfigArn = resource.attrArn;
  }
}
