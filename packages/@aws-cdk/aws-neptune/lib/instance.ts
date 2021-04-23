import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDatabaseCluster } from './cluster';
import { Endpoint } from './endpoint';
import { CfnDBInstance } from './neptune.generated';
import { IParameterGroup } from './parameter-group';

/**
 * Possible Instances Types to use in Neptune cluster
 * used for defining {@link DatabaseInstanceProps.instanceType}.
 */
export enum InstanceType {
  /**
   * db.r5.large
   */
  R5_LARGE = 'db.r5.large',
  /**
   * db.r5.xlarge
   */
  R5_XLARGE = 'db.r5.xlarge',
  /**
   * db.r5.2xlarge
   */
  R5_2XLARGE = 'db.r5.2xlarge',
  /**
   * db.r5.4xlarge
   */
  R5_4XLARGE = 'db.r5.4xlarge',
  /**
   * db.r5.8xlarge
   */
  R5_8XLARGE = 'db.r5.8xlarge',
  /**
   * db.r5.12xlarge
   */
  R5_12XLARGE = 'db.r5.12xlarge',
  /**
   * db.r5.24xlarge
   */
  R5_24XLARGE = 'db.r5.24xlarge',
  /**
   * db.r4.large
   */
  R4_LARGE = 'db.r4.large',
  /**
   * db.r4.xlarge
   */
  R4_XLARGE = 'db.r4.xlarge',
  /**
   * db.r4.2xlarge
   */
  R4_2XLARGE = 'db.r4.2xlarge',
  /**
   * db.r4.4xlarge
   */
  R4_4XLARGE = 'db.r4.4xlarge',
  /**
   * db.r4.8xlarge
   */
  R4_8XLARGE = 'db.r4.8xlarge',
  /**
   * db.t3.medium
   */
  T3_MEDIUM = 'db.t3.medium'
}

/**
 * A database instance
 */
export interface IDatabaseInstance extends cdk.IResource {
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The instance endpoint.
   */
  readonly instanceEndpoint: Endpoint;

  /**
   * The instance endpoint address.
   *
   * @attribute Endpoint
   */
  readonly dbInstanceEndpointAddress: string;

  /**
   * The instance endpoint port.
   *
   * @attribute Port
   */
  readonly dbInstanceEndpointPort: string;
}

/**
 * Properties that describe an existing instance
 */
export interface DatabaseInstanceAttributes {
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The endpoint address.
   */
  readonly instanceEndpointAddress: string;

  /**
   * The database port.
   */
  readonly port: number;
}

/**
 * Construction properties for a DatabaseInstanceNew
 */
export interface DatabaseInstanceProps {
  /**
   * The Neptune database cluster the instance should launch into.
   */
  readonly cluster: IDatabaseCluster;

  /**
   * What type of instance to start for the replicas
   */
  readonly instanceType: InstanceType;

  /**
   * The name of the Availability Zone where the DB instance will be located.
   *
   * @default - no preference
   */
  readonly availabilityZone?: string;

  /**
   * A name for the DB instance. If you specify a name, AWS CloudFormation
   * converts it to lowercase.
   *
   * @default - a CloudFormation generated name
   */
  readonly dbInstanceName?: string;

  /**
   * The DB parameter group to associate with the instance.
   *
   * @default no parameter group
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * The CloudFormation policy to apply when the instance is removed from the
   * stack or replaced during an update.
   *
   * @default RemovalPolicy.Retain
   */
  readonly removalPolicy?: cdk.RemovalPolicy
}

/**
 * A database instance
 *
 * @resource AWS::Neptune::DBInstance
 */
export class DatabaseInstance extends cdk.Resource implements IDatabaseInstance {

  /**
   * Import an existing database instance.
   */
  public static fromDatabaseInstanceAttributes(scope: Construct, id: string, attrs: DatabaseInstanceAttributes): IDatabaseInstance {
    class Import extends cdk.Resource implements IDatabaseInstance {
      public readonly defaultPort = ec2.Port.tcp(attrs.port);
      public readonly instanceIdentifier = attrs.instanceIdentifier;
      public readonly dbInstanceEndpointAddress = attrs.instanceEndpointAddress;
      public readonly dbInstanceEndpointPort = attrs.port.toString();
      public readonly instanceEndpoint = new Endpoint(attrs.instanceEndpointAddress, attrs.port);
    }

    return new Import(scope, id);
  }


  /**
   * The instance's database cluster
   */
  public readonly cluster: IDatabaseCluster;

  /**
   * @inheritdoc
   */
  public readonly instanceIdentifier: string;

  /**
   * @inheritdoc
   */
  public readonly instanceEndpoint: Endpoint;

  /**
   * @inheritdoc
   */
  public readonly dbInstanceEndpointAddress: string;

  /**
   * @inheritdoc
   */
  public readonly dbInstanceEndpointPort: string;

  constructor(scope: Construct, id: string, props: DatabaseInstanceProps) {
    super(scope, id);

    const instance = new CfnDBInstance(this, 'Resource', {
      dbClusterIdentifier: props.cluster.clusterIdentifier,
      dbInstanceClass: props.instanceType,
      availabilityZone: props.availabilityZone,
      dbInstanceIdentifier: props.dbInstanceName,
      dbParameterGroupName: props.parameterGroup?.parameterGroupName,
    });

    this.cluster = props.cluster;
    this.instanceIdentifier = instance.ref;
    this.dbInstanceEndpointAddress = instance.attrEndpoint;
    this.dbInstanceEndpointPort = instance.attrPort;

    // create a number token that represents the port of the instance
    const portAttribute = cdk.Token.asNumber(instance.attrPort);
    this.instanceEndpoint = new Endpoint(instance.attrEndpoint, portAttribute);

    instance.applyRemovalPolicy(props.removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });
  }
}
