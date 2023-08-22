import { Construct } from 'constructs';
import { CfnRealtimeLogConfig } from './cloudfront.generated';
import { Endpoint } from '../';
import { Arn, IResource, Names, Resource, Stack } from '../../core';

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
   *
   * @default - the unique construct ID
   */
  readonly realtimeLogConfigName?: string;
  /**
   * A list of fields that are included in each real-time log record.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html#understand-real-time-log-config-fields
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
 * Base class for RealTimeLogConfig
 */
abstract class RealtimeLogConfigBase extends Resource implements IRealtimeLogConfig {
  public abstract readonly realtimeLogConfigName: string;
  public abstract readonly realtimeLogConfigArn: string;
}

/**
 * Attributes for RealtimeLogConfig
 */
export interface RealtimeLogConfigAttributes {
  /**
   * The ARN of the RealTimeLogConfig.
   *
   * Format: arn:<partition>:cloudfront::<account-id>:realtime-log-config/<realtime-log-config-name-with-path>
   */
  readonly realtimeLogConfigArn: string;
}

/**
 * A Realtime Log Config configuration
 *
 * @resource AWS::CloudFront::RealtimeLogConfig
 */
export class RealtimeLogConfig extends RealtimeLogConfigBase {

  /**
   * Import an existing RealtimeLogConfig from an RealtimeLogConfig name.
   *
   * @param scope construct scope
   * @param id construct id
   * @param realtimeLogConfigName the name of the existing RealtimeLogConfig to import
   */
  public static fromRealtimeLogConfigName(scope: Construct, id: string, realtimeLogConfigName: string): IRealtimeLogConfig {
    const realtimeLogConfigArn = Stack.of(scope).formatArn({
      service: 'cloudfront',
      region: '',
      resource: 'realtime-log-config',
      resourceName: realtimeLogConfigName,
    });
    return RealtimeLogConfig.fromRealtimeLogConfigAttributes(scope, id, { realtimeLogConfigArn });
  }
  /**
   * Import an existing RealtimeLogConfig from an RealtimeLogConfig ARN.
   *
   * If the ARN comes from a Token, the RealtimeLogConfig cannot have a path; if so, any attempt
   * to reference its realtimeLogConfigName will fail.
   *
   * @param scope construct scope
   * @param id construct id
   * @param realtimeLogConfigArn the ARN of the exiting RealtimeLogConfig to import
   */
  public static fromRealtimeLogConfigArn(scope: Construct, id: string, realtimeLogConfigArn: string): IRealtimeLogConfig {
    return RealtimeLogConfig.fromRealtimeLogConfigAttributes(scope, id, { realtimeLogConfigArn });
  }

  /**
   * Import an existing RealtimeLogConfig from given RealtimeLogConfig attributes.
   *
   * If the ARN comes from a Token, the RealtimeLogConfig cannot have a path; if so, any attempt
   * to reference its realtimeLogConfigName will fail.
   *
   * @param scope construct scope
   * @param id construct id
   * @param attrs the attributes of the RealtimeLogConfig to import
   */
  public static fromRealtimeLogConfigAttributes(scope: Construct, id: string, attrs: RealtimeLogConfigAttributes): IRealtimeLogConfig {
    class Import extends RealtimeLogConfigBase {
      public readonly realtimeLogConfigName: string = Arn.extractResourceName(attrs.realtimeLogConfigArn, 'realtime-log-config').split('/').pop()!;
      public readonly realtimeLogConfigArn: string = attrs.realtimeLogConfigArn;

      constructor(s: Construct, i: string) {
        super(s, i);
      }
    }
    return new Import(scope, id);
  }
  public readonly realtimeLogConfigName: string;
  public readonly realtimeLogConfigArn: string;

  constructor(scope: Construct, id: string, props: RealtimeLogConfigProps) {
    super(scope, id, {
      physicalName: props.realtimeLogConfigName,
    });

    this.realtimeLogConfigName = props.realtimeLogConfigName ?? Names.uniqueResourceName(this, {});

    if ((props.samplingRate < 1 || props.samplingRate > 100)) {
      throw new Error(`Sampling rate must be between 1 and 100 (inclusive), received ${props.samplingRate}`);
    }

    const resource = new CfnRealtimeLogConfig(this, 'Resource', {
      endPoints: props.endPoints.map(endpoint => {
        return endpoint._renderEndpoint(this);
      }),
      fields: props.fields,
      name: this.realtimeLogConfigName,
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
