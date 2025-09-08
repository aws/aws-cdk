import { Construct } from 'constructs';
import { IDatabaseProxy } from './proxy';
import { CfnDBProxyEndpoint } from './rds.generated';
import * as ec2 from '../../aws-ec2';
import { IResource, Names, Resource, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * A DB proxy endpoint.
 */
export interface IDatabaseProxyEndpoint extends IResource {
  /**
   * DB Proxy Endpoint Name
   *
   * @attribute
   */
  readonly dbProxyEndpointName: string;

  /**
   * DB Proxy Endpoint ARN
   *
   * @attribute
   */
  readonly dbProxyEndpointArn: string;

  /**
   * Endpoint
   *
   * @attribute
   */
  readonly endpoint: string;
}

/**
 * Options for a new DatabaseProxyEndpoint
 */
export interface DatabaseProxyEndpointOptions {
  /**
   * The name of the DB proxy endpoint
   *
   * @default - a CDK generated name
   */
  readonly dbProxyEndpointName?: string;

  /**
   * The VPC of the DB proxy endpoint.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The VPC security groups to associate with the new proxy endpoint.
   *
   * @default - Default security group for the VPC
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The subnets of DB proxy endpoint.
   *
   * @default - the VPC default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * A value that indicates whether the DB proxy endpoint can be used for read/write or read-only operations.
   *
   * @default - ProxyEndpointTargetRole.READ_WRITE
   */
  readonly targetRole?: ProxyEndpointTargetRole;
}

/**
 * Construction properties for a DatabaseProxyEndpoint
 */
export interface DatabaseProxyEndpointProps extends DatabaseProxyEndpointOptions {
  /**
   * The DB proxy associated with the DB proxy endpoint.
   */
  readonly dbProxy: IDatabaseProxy;
}

/**
 * Properties that describe an existing DB Proxy Endpoint
 */
export interface DatabaseProxyEndpointAttributes {
  /**
   * DB Proxy Endpoint Name
   */
  readonly dbProxyEndpointName: string;

  /**
   * DB Proxy Endpoint ARN
   */
  readonly dbProxyEndpointArn: string;

  /**
   * The endpoint that you can use to connect to the DB proxy
   */
  readonly endpoint: string;
}

/**
 * A value that indicates whether the DB proxy endpoint can be used for read/write or read-only operations.
 */
export enum ProxyEndpointTargetRole {
  /**
   * The proxy endpoint can be used for both read and write operations.
   */
  READ_WRITE = 'READ_WRITE',

  /**
   * The proxy endpoint can be used only for read operations.
   */
  READ_ONLY = 'READ_ONLY',
}

/**
 * Represents an RDS Database Proxy Endpoint.
 */
abstract class DatabaseProxyEndpointBase extends Resource implements IDatabaseProxyEndpoint {
  public abstract readonly dbProxyEndpointName: string;
  public abstract readonly dbProxyEndpointArn: string;
  public abstract readonly endpoint: string;
}

/**
 * RDS Database Proxy Endpoint
 *
 * @resource AWS::RDS::DBProxyEndpoint
 */
@propertyInjectable
export class DatabaseProxyEndpoint extends DatabaseProxyEndpointBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-rds.DatabaseProxyEndpoint';

  /**
   * Import an existing database proxy endpoint.
   */
  public static fromDatabaseProxyEndpointAttributes(
    scope: Construct,
    id: string,
    attrs: DatabaseProxyEndpointAttributes,
  ): IDatabaseProxyEndpoint {
    class Import extends DatabaseProxyEndpointBase {
      public readonly dbProxyEndpointName = attrs.dbProxyEndpointName;
      public readonly dbProxyEndpointArn = attrs.dbProxyEndpointArn;
      public readonly endpoint = attrs.endpoint;
    }
    return new Import(scope, id);
  }

  /**
   * DB Proxy Endpoint Name
   *
   * @attribute
   */
  public readonly dbProxyEndpointName: string;

  /**
   * DB Proxy Endpoint ARN
   *
   * @attribute
   */
  public readonly dbProxyEndpointArn: string;

  /**
   * The endpoint that you can use to connect to the DB proxy
   *
   * @attribute
   */
  public readonly endpoint: string;

  constructor(scope: Construct, id: string, props: DatabaseProxyEndpointProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const physicalName = props.dbProxyEndpointName || Names.uniqueResourceName(this, { maxLength: 60 });

    const vpcSubnetIds = props.vpc.selectSubnets(props.vpcSubnets).subnetIds;
    if (vpcSubnetIds.length < 2) {
      throw new ValidationError(`\`subnets\` requires at least 2 subnets, got ${vpcSubnetIds.length}`, this);
    }

    if (props.securityGroups && props.securityGroups.length == 0) {
      throw new ValidationError('\`securityGroups\` must be undefined or a non-empty array.', this);
    }

    const resource = new CfnDBProxyEndpoint(this, 'Resource', {
      dbProxyEndpointName: physicalName,
      dbProxyName: props.dbProxy.dbProxyName,
      vpcSubnetIds,
      vpcSecurityGroupIds: props.securityGroups?.map(e => e.securityGroupId),
      targetRole: props.targetRole,
    });

    this.dbProxyEndpointName = resource.dbProxyEndpointName;
    this.dbProxyEndpointArn = resource.attrDbProxyEndpointArn;
    this.endpoint = resource.attrEndpoint;
  }
}
