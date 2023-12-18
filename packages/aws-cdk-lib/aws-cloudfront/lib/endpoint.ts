import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import { PhysicalName } from '../../core';

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
        const cloudfrontRole = role ?? this.singletonKinesisRole(scope);

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
  private singletonKinesisRole(scope: Construct): iam.IRole {
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
   * @internal
   */
  public abstract _renderEndpoint(scope: Construct): any;
}
