import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { CfnConnection } from './glue.generated';

/**
 * The type of the glue connection
 */
export enum ConnectionType {
  /**
   * Designates a connection to a database through Java Database Connectivity (JDBC).
   */
  JDBC = 'JDBC',

  /**
   * Designates a connection to an Apache Kafka streaming platform.
   */
  KAFKA = 'KAFKA',

  /**
   * Designates a connection to a MongoDB document database.
   */
  MONGODB = 'MONGODB',

  /**
   * Designates a network connection to a data source within an Amazon Virtual Private Cloud environment (Amazon VPC).
   */
  NETWORK = 'NETWORK'
}

/**
 * Interface representing a created or an imported {@link Connection}
 */
export interface IConnection extends cdk.IResource {
  /**
   * The name of the connection
   * @attribute
   */
  readonly connectionName: string;

  /**
   * The ARN of the connection
   * @attribute
   */
  readonly connectionArn: string;
}

/**
 * Attributes for importing {@link Connection}
 */
export interface ConnectionAttributes {
  /**
   * The name of the connection
   */
  readonly connectionName: string;
}

/**
 * Construction properties for {@link Connection}
 */
export interface ConnectionProps {
  /**
   * The name of the connection
   * @default cloudformation generated name
   */
  readonly connectionName?: string;

  /**
   * The description of the connection.
   * @default no description
   */
  readonly description?: string;

  /**
   * The type of the connection
   */
  readonly connectionType: ConnectionType;

  /**
   *  Key-Value pairs that define parameters for the connection.
   *  @default empty properties
   */
  readonly connectionProperties?: { [key: string]: string };

  /**
   * A list of criteria that can be used in selecting this connection.
   * @default no match criteria
   */
  readonly matchCriteria?: string[];

  /**
   * The list of security groups needed to successfully make this connection e.g. to successfully connect to VPC.
   * @default no security group
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The VPC subnet to connect to resources within a VPC. See more at https://docs.aws.amazon.com/glue/latest/dg/start-connecting.html.
   * @default no subnet
   */
  readonly subnet?: ec2.ISubnet;
}

/**
 * An AWS Glue connection to a data source.
 */
export class Connection extends cdk.Resource implements IConnection {

  /**
   * Creates a Connection construct that represents an external connection.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param attrs Import attributes
   */
  public static fromConnectionAttributes(scope: constructs.Construct, id: string, attrs: ConnectionAttributes): IConnection {
    class Import extends cdk.Resource implements IConnection {
      public readonly connectionName = attrs.connectionName;
      public readonly connectionArn = Connection.buildConnectionArn(scope, attrs.connectionName);
    }

    return new Import(scope, id);
  }

  private static buildConnectionArn(scope: constructs.Construct, connectionName: string) : string {
    return cdk.Stack.of(scope).formatArn({
      service: 'glue',
      resource: 'connection',
      resourceName: connectionName,
    });
  }

  /**
   * The ARN of the connection
   */
  public readonly connectionArn: string;

  /**
   * The name of the connection
   */
  public readonly connectionName: string;

  constructor(scope: constructs.Construct, id: string, props: ConnectionProps) {
    super(scope, id, {
      physicalName: props.connectionName,
    });

    const physicalConnectionRequirements = props.subnet || props.securityGroups ? {
      availabilityZone: props.subnet ? props.subnet.availabilityZone : undefined,
      subnetId: props.subnet ? props.subnet.subnetId : undefined,
      securityGroupIdList: props.securityGroups ? props.securityGroups.map(sg => sg.securityGroupId) : undefined,
    } : undefined;

    const connectionResource = new CfnConnection(this, 'Resource', {
      catalogId: cdk.Aws.ACCOUNT_ID,
      connectionInput: {
        connectionProperties: props.connectionProperties,
        connectionType: props.connectionType,
        description: props.description,
        matchCriteria: props.matchCriteria,
        name: props.connectionName,
        physicalConnectionRequirements,
      },
    });

    const resourceName = this.getResourceNameAttribute(connectionResource.ref);
    this.connectionArn = Connection.buildConnectionArn(this, resourceName);
    this.connectionName = resourceName;
  }
}
