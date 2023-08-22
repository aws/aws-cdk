import { Construct } from 'constructs';
import { CfnRealtimeLogConfig } from './cloudfront.generated';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import { IResource, Names, PhysicalName, Resource } from '../../core';

/**
 * @internal
 */
function singletonKinesisRole(scope: Construct): iam.IRole {
  const id = 'RealtimeLogKinesisRole';
  const existing = scope.node.tryFindChild(id) as iam.IRole;
  if (existing) { return existing; }

  const role = new iam.Role(scope, id, {
    roleName: PhysicalName.GENERATE_IF_NEEDED,
    assumedBy: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
  });

  return role;
}

/**
 * Represents the endpoints available for targetting within a realtime log config resource
 */
export abstract class Endpoint {
  /**
   * Configure a Kinesis Stream Endpoint for Realtime Log Config
   *
   * @default - a role will be created and used across your endpoints
   */
  public static fromKinesisStream(stream: kinesis.IStream, role?: iam.IRole): Endpoint {
    return new (class extends Endpoint {
      public _renderEndpoint(scope: Construct) {
        const cloudfrontRole = role ?? singletonKinesisRole(scope);

        stream.grant(cloudfrontRole,
          'kinesis:DescribeStreamSummary',
          'kinesis:DescribeStream',
          'kinesis:PutRecord',
          'kinesis:PutRecords',
        );

        if (stream.encryptionKey) {
          stream.encryptionKey.grant(cloudfrontRole, 'kms:GenerateDataKey');
        }

        return {
          kinesisStreamConfig: {
            roleArn: cloudfrontRole.roleArn,
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
  public abstract _renderEndpoint(scope: Construct): any;
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
  readonly name?: string;
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

    this.realtimeLogConfigName = props.name || Names.uniqueId(this);

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
