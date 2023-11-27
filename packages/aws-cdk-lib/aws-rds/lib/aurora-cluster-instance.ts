import { Construct } from 'constructs';
import { CaCertificate } from './ca-certificate';
import { DatabaseCluster } from './cluster';
import { IDatabaseCluster } from './cluster-ref';
import { IParameterGroup, ParameterGroup } from './parameter-group';
import { helperRemovalPolicy } from './private/util';
import { PerformanceInsightRetention } from './props';
import { CfnDBInstance } from './rds.generated';
import { ISubnetGroup } from './subnet-group';
import * as ec2 from '../../aws-ec2';
import { IRole } from '../../aws-iam';
import * as kms from '../../aws-kms';
import { IResource, Resource, Duration, RemovalPolicy, ArnFormat, FeatureFlags } from '../../core';
import { AURORA_CLUSTER_CHANGE_SCOPE_OF_INSTANCE_PARAMETER_GROUP_WITH_EACH_PARAMETERS } from '../../cx-api';

/**
 * Options for binding the instance to the cluster
 */
export interface ClusterInstanceBindOptions {
  /**
   * The interval, in seconds, between points when Amazon RDS collects enhanced
   * monitoring metrics for the DB instances.
   *
   * @default no enhanced monitoring
   */
  readonly monitoringInterval?: Duration;

  /**
   * Role that will be used to manage DB instances monitoring.
   *
   * @default - A role is automatically created for you
   */
  readonly monitoringRole?: IRole;

  /**
   * The removal policy on the cluster
   *
   * @default - RemovalPolicy.DESTROY (cluster snapshot can restore)
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * The promotion tier of the cluster instance
   *
   * This matters more for serverlessV2 instances. If a serverless
   * instance is in tier 0-1 then it will scale with the writer.
   *
   * For provisioned instances this just determines the failover priority.
   * If multiple instances have the same priority then one will be picked at random
   *
   * @default 2
   */
  readonly promotionTier?: number;

  /**
   * Existing subnet group for the cluster.
   * This is only needed when using the isFromLegacyInstanceProps
   *
   * @default - cluster subnet group is used
   */
  readonly subnetGroup?: ISubnetGroup;
}

/**
 * The type of Aurora Cluster Instance. Can be either serverless v2
 * or provisioned
 */
export class ClusterInstanceType {
  /**
   * Aurora Serverless V2 instance type
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html
   */
  public static serverlessV2(): ClusterInstanceType {
    return new ClusterInstanceType('db.serverless', InstanceType.SERVERLESS_V2);
  }

  /**
   * Aurora Provisioned instance type
   */
  public static provisioned(instanceType?: ec2.InstanceType): ClusterInstanceType {
    return new ClusterInstanceType(
      (instanceType ?? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)).toString(),
      InstanceType.PROVISIONED,
    );
  }

  constructor(
    private readonly instanceType: string,
    public readonly type: InstanceType,
  ) { }

  /**
   * String representation of the instance type that can be used in the CloudFormation resource
   */
  public toString(): string {
    return this.instanceType;
  }
}

/**
 * Represents an Aurora cluster instance
 * This can be either a provisioned instance or a serverless v2 instance
 */
export interface IClusterInstance {
  /**
   * Create the database instance within the provided cluster
   */
  bind(scope: Construct, cluster: IDatabaseCluster, options: ClusterInstanceBindOptions): IAuroraClusterInstance;
}

/**
 * Options for creating a provisioned instance
 */
export interface ProvisionedClusterInstanceProps extends ClusterInstanceOptions {
  /**
   * The cluster instance type
   *
   * @default db.t3.medium
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The promotion tier of the cluster instance
   *
   * Can be between 0-15
   *
   * For provisioned instances this just determines the failover priority.
   * If multiple instances have the same priority then one will be picked at random
   *
   * @default 2
   */
  readonly promotionTier?: number;
}

/**
 * Options for creating a serverless v2 instance
 */
export interface ServerlessV2ClusterInstanceProps extends ClusterInstanceOptions {
  /**
   * Only applicable to reader instances.
   *
   * If this is true then the instance will be placed in promotion tier 1, otherwise
   * it will be placed in promotion tier 2.
   *
   * For serverless v2 instances this means:
   * - true: The serverless v2 reader will scale to match the writer instance (provisioned or serverless)
   * - false: The serverless v2 reader will scale with the read workfload on the instance
   *
   * @default false
   */
  readonly scaleWithWriter?: boolean;
}

/**
 * Common options for creating cluster instances (both serverless and provisioned)
 */
export interface ClusterInstanceProps extends ClusterInstanceOptions {
  /**
   * The type of cluster instance to create. Can be either
   * provisioned or serverless v2
   */
  readonly instanceType: ClusterInstanceType;

  /**
   * The promotion tier of the cluster instance
   *
   * This matters more for serverlessV2 instances. If a serverless
   * instance is in tier 0-1 then it will scale with the writer.
   *
   * For provisioned instances this just determines the failover priority.
   * If multiple instances have the same priority then one will be picked at random
   *
   * @default 2
   */
  readonly promotionTier?: number;
}

/**
 * Common options for creating a cluster instance
 */
export interface ClusterInstanceOptions {
  /**
   * The identifier for the database instance
   *
   * @default - CloudFormation generated identifier
   */
  readonly instanceIdentifier?: string;

  /**
   * Whether to enable automatic upgrade of minor version for the DB instance.
   *
   * @default - true
   */
  readonly autoMinorVersionUpgrade?: boolean;

  /**
   * Whether to enable Performance Insights for the DB instance.
   *
   * @default - false, unless ``performanceInsightRetention`` or ``performanceInsightEncryptionKey`` is set.
   */
  readonly enablePerformanceInsights?: boolean;

  /**
   * The amount of time, in days, to retain Performance Insights data.
   *
   * @default 7
   */
  readonly performanceInsightRetention?: PerformanceInsightRetention;

  /**
   * The AWS KMS key for encryption of Performance Insights data.
   *
   * @default - default master key
   */
  readonly performanceInsightEncryptionKey?: kms.IKey;

  /**
   * Indicates whether the DB instance is an internet-facing instance.
   *
   * @default - true if the instance is placed in a public subnet
   */
  readonly publiclyAccessible?: boolean;

  /**
   * The parameters in the DBParameterGroup to create automatically
   *
   * You can only specify parameterGroup or parameters but not both.
   * You need to use a versioned engine to auto-generate a DBParameterGroup.
   *
   * @default - None
   */
  readonly parameters?: { [key: string]: string };

  /**
   * Whether to allow upgrade of major version for the DB instance.
   *
   * @default - false
   */
  readonly allowMajorVersionUpgrade?: boolean;

  /**
   * The DB parameter group to associate with the instance.
   * This is only needed if you need to configure different parameter
   * groups for each individual instance, otherwise you should not
   * provide this and just use the cluster parameter group
   *
   * @default the cluster parameter group is used
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * Only used for migrating existing clusters from using `instanceProps` to `writer` and `readers`
   *
   * @example
   * // existing cluster
   * declare const vpc: ec2.Vpc;
   * const cluster = new rds.DatabaseCluster(this, 'Database', {
   *   engine: rds.DatabaseClusterEngine.auroraMysql({
   *     version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
   *   }),
   *   instances: 2,
   *   instanceProps: {
   *     instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
   *     vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
   *     vpc,
   *   },
   * });
   *
   * // migration
   *
   * const instanceProps = {
   *   instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
   *   isFromLegacyInstanceProps: true,
   * };
   *
   * const myCluster = new rds.DatabaseCluster(this, 'Database', {
   *   engine: rds.DatabaseClusterEngine.auroraMysql({
   *     version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
   *   }),
   *   vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
   *   vpc,
   *   writer: rds.ClusterInstance.provisioned('Instance1', {
   *     instanceType: instanceProps.instanceType,
   *     isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
   *   }),
   *   readers: [
   *     rds.ClusterInstance.provisioned('Instance2', {
   *       instanceType: instanceProps.instanceType,
   *       isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
   *     }),
   *   ],
   * });
   *
   * @default false
   */
  readonly isFromLegacyInstanceProps?: boolean;

  /**
   * The identifier of the CA certificate for this DB cluster's instances.
   *
   * Specifying or updating this property triggers a reboot.
   *
   * For RDS DB engines:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL-certificate-rotation.html
   * For Aurora DB engines:
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.SSL-certificate-rotation.html
   *
   * @default - RDS will choose a certificate authority
   */
  readonly caCertificate?: CaCertificate;
}

/**
 * Create an RDS Aurora Cluster Instance. You can create either provisioned or
 * serverless v2 instances.
 *
 * @example
 *
 * declare const vpc: ec2.Vpc;
 * const myCluster = new rds.DatabaseCluster(this, 'Database', {
 *   engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
 *   writer: rds.ClusterInstance.provisioned('writer', {
 *     instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.XLARGE4),
 *   }),
 *   serverlessV2MinCapacity: 6.5,
 *   serverlessV2MaxCapacity: 64,
 *   readers: [
 *     // will be put in promotion tier 1 and will scale with the writer
 *     rds.ClusterInstance.serverlessV2('reader1', { scaleWithWriter: true }),
 *     // will be put in promotion tier 2 and will not scale with the writer
 *     rds.ClusterInstance.serverlessV2('reader2'),
 *   ],
 *   vpc,
 * });
 */
export class ClusterInstance implements IClusterInstance {
  /**
   * Add a provisioned instance to the cluster
   *
   * @example
   * rds.ClusterInstance.provisioned('ClusterInstance', {
   *   instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.XLARGE4),
   * });
   */
  public static provisioned(id: string, props: ProvisionedClusterInstanceProps = {}): IClusterInstance {
    return new ClusterInstance(id, {
      ...props,
      instanceType: ClusterInstanceType.provisioned(props.instanceType),
    });
  }

  /**
   * Add a serverless v2 instance to the cluster
   *
   * @example
   * rds.ClusterInstance.serverlessV2('ClusterInstance', {
   *   scaleWithWriter: true,
   * });
   */
  public static serverlessV2(id: string, props: ServerlessV2ClusterInstanceProps = {}): IClusterInstance {
    return new ClusterInstance(id, {
      ...props,
      promotionTier: props.scaleWithWriter ? 1 : 2,
      instanceType: ClusterInstanceType.serverlessV2(),
    });
  }

  private constructor(private id: string, private readonly props: ClusterInstanceProps) { }

  /**
   * Add the ClusterInstance to the cluster
   */
  public bind(scope: Construct, cluster: IDatabaseCluster, props: ClusterInstanceBindOptions): IAuroraClusterInstance {
    return new AuroraClusterInstance(scope, this.id, {
      cluster,
      ...this.props,
      ...props,
    });
  }
}

interface AuroraClusterInstanceProps extends ClusterInstanceProps, ClusterInstanceBindOptions {
  readonly cluster: IDatabaseCluster;
}

export enum InstanceType {
  PROVISIONED = 'PROVISIONED',
  SERVERLESS_V2 = 'SERVERLESS_V2',
}

/**
 * An Aurora Cluster Instance
 */
export interface IAuroraClusterInstance extends IResource {
  /**
   * The instance ARN
   */
  readonly dbInstanceArn: string;

  /**
   * The instance resource ID
   */
  readonly dbiResourceId: string;

  /**
   * The instance endpoint address
   */
  readonly dbInstanceEndpointAddress: string;

  /**
   * The instance identifier
   */
  readonly instanceIdentifier: string;

  /**
   * The instance type (provisioned vs serverless v2)
   */
  readonly type: InstanceType;

  /**
   * The instance size if the instance is a provisioned type
   */
  readonly instanceSize?: string;

  /**
   * Te promotion tier the instance was created in
   */
  readonly tier: number;
}

class AuroraClusterInstance extends Resource implements IAuroraClusterInstance {
  public readonly dbInstanceArn: string;
  public readonly dbiResourceId: string;
  public readonly dbInstanceEndpointAddress: string;
  public readonly instanceIdentifier: string;
  public readonly type: InstanceType;
  public readonly tier: number;
  public readonly instanceSize?: string;
  constructor(scope: Construct, id: string, props: AuroraClusterInstanceProps) {
    super(
      scope,
      props.isFromLegacyInstanceProps ? `${id}Wrapper` : id,
      {
        physicalName: props.instanceIdentifier,
      });
    this.tier = props.promotionTier ?? 2;
    if (this.tier > 15) {
      throw new Error('promotionTier must be between 0-15');
    }

    const isOwnedResource = Resource.isOwnedResource(props.cluster);
    let internetConnected;
    let publiclyAccessible = props.publiclyAccessible;
    if (isOwnedResource) {
      const ownedCluster = props.cluster as DatabaseCluster;
      internetConnected = ownedCluster.vpc.selectSubnets(ownedCluster.vpcSubnets).internetConnectivityEstablished;
      publiclyAccessible = ownedCluster.vpcSubnets && ownedCluster.vpcSubnets.subnetType === ec2.SubnetType.PUBLIC;
    }

    // Get the actual subnet objects so we can depend on internet connectivity.
    const instanceType = (props.instanceType ?? ClusterInstanceType.serverlessV2());
    this.type = instanceType.type;
    this.instanceSize = this.type === InstanceType.PROVISIONED ? props.instanceType?.toString() : undefined;

    // engine is never undefined on a managed resource, i.e. DatabaseCluster
    const engine = props.cluster.engine!;
    const enablePerformanceInsights = props.enablePerformanceInsights
      || props.performanceInsightRetention !== undefined || props.performanceInsightEncryptionKey !== undefined;
    if (enablePerformanceInsights && props.enablePerformanceInsights === false) {
      throw new Error('`enablePerformanceInsights` disabled, but `performanceInsightRetention` or `performanceInsightEncryptionKey` was set');
    }

    const instanceParameterGroup = props.parameterGroup ?? (
      props.parameters
        ? FeatureFlags.of(this).isEnabled(AURORA_CLUSTER_CHANGE_SCOPE_OF_INSTANCE_PARAMETER_GROUP_WITH_EACH_PARAMETERS)
          ? new ParameterGroup(this, 'InstanceParameterGroup', {
            engine: engine,
            parameters: props.parameters,
          })
          : new ParameterGroup(props.cluster, 'InstanceParameterGroup', {
            engine: engine,
            parameters: props.parameters,
          })
        : undefined
    );
    const instanceParameterGroupConfig = instanceParameterGroup?.bindToInstance({});
    const instance = new CfnDBInstance(
      props.isFromLegacyInstanceProps ? scope : this,
      props.isFromLegacyInstanceProps ? id : 'Resource',
      {
      // Link to cluster
        engine: engine.engineType,
        dbClusterIdentifier: props.cluster.clusterIdentifier,
        promotionTier: props.isFromLegacyInstanceProps ? undefined : this.tier,
        dbInstanceIdentifier: this.physicalName,
        // Instance properties
        dbInstanceClass: props.instanceType ? databaseInstanceType(instanceType) : undefined,
        publiclyAccessible,
        enablePerformanceInsights: enablePerformanceInsights || props.enablePerformanceInsights, // fall back to undefined if not set
        performanceInsightsKmsKeyId: props.performanceInsightEncryptionKey?.keyArn,
        performanceInsightsRetentionPeriod: enablePerformanceInsights
          ? (props.performanceInsightRetention || PerformanceInsightRetention.DEFAULT)
          : undefined,
        // only need to supply this when migrating from legacy method.
        // this is not applicable for aurora instances, but if you do provide it and then
        // change it it will cause an instance replacement
        dbSubnetGroupName: props.isFromLegacyInstanceProps ? props.subnetGroup?.subnetGroupName : undefined,
        dbParameterGroupName: instanceParameterGroupConfig?.parameterGroupName,
        monitoringInterval: props.monitoringInterval && props.monitoringInterval.toSeconds(),
        monitoringRoleArn: props.monitoringRole && props.monitoringRole.roleArn,
        autoMinorVersionUpgrade: props.autoMinorVersionUpgrade,
        allowMajorVersionUpgrade: props.allowMajorVersionUpgrade,
        caCertificateIdentifier: props.caCertificate && props.caCertificate.toString(),
      });
    // For instances that are part of a cluster:
    //
    //  Cluster DESTROY or SNAPSHOT -> DESTROY (snapshot is good enough to recreate)
    //  Cluster RETAIN              -> RETAIN (otherwise cluster state will disappear)
    instance.applyRemovalPolicy(helperRemovalPolicy(props.removalPolicy));

    // We must have a dependency on the NAT gateway provider here to create
    // things in the right order.
    if (internetConnected) {
      instance.node.addDependency(internetConnected);
    }

    this.dbInstanceArn = this.getResourceArnAttribute(instance.attrDbInstanceArn, {
      resource: 'db',
      service: 'rds',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      resourceName: this.physicalName,
    });
    this.instanceIdentifier = this.getResourceNameAttribute(instance.ref);
    this.dbiResourceId = instance.attrDbiResourceId;
    this.dbInstanceEndpointAddress = instance.attrEndpointAddress;
  }
}

/**
 * Turn a regular instance type into a database instance type
 */
function databaseInstanceType(instanceType: ClusterInstanceType) {
  const type = instanceType.toString();
  return instanceType.type === InstanceType.SERVERLESS_V2 ? type : 'db.' + type;
}
