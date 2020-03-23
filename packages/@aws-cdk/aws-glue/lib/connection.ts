import ec2 = require('@aws-cdk/aws-ec2');
import { Aws, Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnConnection } from './glue.generated';

/**
 * Types of glue input connections
 */
export enum ConnectionInputTypes {
  /**
   * The type of the connection. Currently, only JDBC is supported;
   * SFTP is not supported.
   */
  JDBC = 'JDBC',
}

export interface IConnection extends IResource {
  /**
   * The name of the connection
   */
  readonly connectionName: string;
}

export interface ConnectionAttributes {
  /** The name of the connection */
  readonly connectionName: string;
}

export interface ConnectionProps {
  /**
   * The name of the connection
   * @default no name
   */
  readonly connectionName?: string;

  /**
   *  Key-Value pairs that define parameters for the connection.
   */
  readonly connectionProperties: { [key: string]: string };

  /**
   * The type of the connection. Currently, only JDBC is supported; SFTP is not supported.
   * @default JDBC
   */
  readonly connectionType?: ConnectionInputTypes;

  /**
   * The description of the connection.
   * @default no description
   */
  readonly description?: string;

  /**
   * A list of criteria that can be used in selecting this connection.
   * @default no match criteria
   */
  readonly matchCriteria?: string[];

  /**
   * The connection's Availability Zone. This field is redundant because the specified
   * subnet implies the Availability Zone to be used. Currently the field must be populated,
   * but it will be deprecated in the future.
   * @default no availability zone set
   */
  readonly availabilityZone?: string;

  /**
   * The security group ID list used by the connection.
   * @default no security group ids
   */
  readonly securityGroupIds?: ec2.ISecurityGroup[];

  /**
   * The vpc used by the connection
   */
  readonly vpc?: ec2.Vpc;

  /**
   * The subnets used by the connection
   * @default no subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
}

/**
 * Specifies an AWS Glue connection to a data source.
 */
export class Connection extends Resource implements IConnection {
  /** The name of the connection */
  public readonly connectionName: string;

  constructor(scope: Construct, id: string, props: ConnectionProps) {
    super(scope, id);

    const subnetId = props.vpcSubnets && props.vpc ? props.vpc.selectSubnets(props.vpcSubnets).subnetIds[0] : undefined;

    const connectionResource = new CfnConnection(this, 'Resource', {
      catalogId: Aws.ACCOUNT_ID,
      connectionInput: {
        connectionProperties: props.connectionProperties,
        connectionType: props.connectionType || ConnectionInputTypes.JDBC,
        description: props.description,
        matchCriteria: props.matchCriteria,
        name: props.connectionName,
        physicalConnectionRequirements: {
          availabilityZone: props.availabilityZone,
          securityGroupIdList: props.securityGroupIds ? props.securityGroupIds.map(sg => sg.securityGroupId) : undefined,
          subnetId
        }
      }
    });

    this.connectionName = this.getResourceNameAttribute(connectionResource.ref);
  }
}
