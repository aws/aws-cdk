import { Construct } from 'constructs';
import { CfnRealtimeLogConfig } from './cloudfront.generated';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import { IResource, Resource } from '../../core';

/**
 * Represents the endpoints available for targetting within a realtime log config resource
 */
export abstract class Endpoint {
  public static fromKinesisStream(stream: kinesis.IStream, role: iam.IRole): Endpoint {
    return new (class extends Endpoint {
      public _renderEndpoint() {
        return {
          kinesisStreamConfig: {
            roleArn: role.roleArn,
            streamArn: stream.streamArn,
          },
          streamType: 'Kinesis',
        };
      }
    });
  }

  private constructor() {}

  /**
  * @internal
  */
  public abstract _renderEndpoint(): any;
}

/**
 * Represents Realtime Log Configuration
 */
export interface IRealtimeLogConfig extends IResource {
  /**
   * The name of the realtime log config.
   * @attribute
   */
  readonly realtimeLogConfigName: string;
  /**
   * The arn of the realtime log config.
   * @attribute
   */
  readonly realtimeLogConfigArn: string;
}

/**
 * Properties for defining a RealtimeLogConfig resource.
 */
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
  readonly endPoints: Endpoint[];
}

/**
 * A Realtime Log Config configuration
 *
 * @resource AWS::CloudFront::RealtimeLogConfig
 */
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

    const resource = new CfnRealtimeLogConfig(this, 'Resource', {
      endPoints: props.endPoints.map(endpoint => {
        return endpoint._renderEndpoint();
      }),
      fields: props.fields,
      name: this.physicalName,
      samplingRate: props.samplingRate,
    });

    this.realtimeLogConfigArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'cloudfront',
      resource: 'realtime-log-config',
      resourceName: this.physicalName,
    });

    this.realtimeLogConfigName = this.getResourceNameAttribute(resource.ref);
  }
}
