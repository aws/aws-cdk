import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Duration, IResource, Names, RemovalPolicy, Resource, SecretValue, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DatabaseSecret } from './database-secret';
import { Endpoint } from './endpoint';
import { ClusterParameterGroup, IClusterParameterGroup } from './parameter-group';
import { CfnCluster } from './redshift.generated';
import { ClusterSubnetGroup, IClusterSubnetGroup } from './subnet-group';

/**
 * Possible Node Types to use in the cluster
 * used for defining {@link ClusterProps.nodeType}.
 */
export enum NodeType {
  /**
   * ds2.xlarge
   */
  DS2_XLARGE = 'ds2.xlarge',
  /**
   * ds2.8xlarge
   */
  DS2_8XLARGE = 'ds2.8xlarge',
  /**
   * dc1.large
   */
  DC1_LARGE = 'dc1.large',
  /**
   * dc1.8xlarge
   */
  DC1_8XLARGE = 'dc1.8xlarge',
  /**
   * dc2.large
   */
  DC2_LARGE = 'dc2.large',
  /**
   * dc2.8xlarge
   */
  DC2_8XLARGE = 'dc2.8xlarge',
  /**
   * ra3.xlplus
   */
  RA3_XLPLUS = 'ra3.xlplus',
  /**
   * ra3.4xlarge
   */
  RA3_4XLARGE = 'ra3.4xlarge',
  /**
   * ra3.16xlarge
   */
  RA3_16XLARGE = 'ra3.16xlarge',
}

/**
 * What cluster type to use.
 * Used by {@link ClusterProps.clusterType}
 */
export enum ClusterType {
  /**
   * single-node cluster, the {@link ClusterProps.numberOfNodes} parameter is not required
   */
  SINGLE_NODE = 'single-node',
  /**
   * multi-node cluster, set the amount of nodes using {@link ClusterProps.numberOfNodes} parameter
   */
  MULTI_NODE = 'multi-node',
}

/**
 * Username and password combination
 */
export interface Login {
  /**
   * Username
   */
  readonly masterUsername: string;

  /**
   * Password
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default a Secrets Manager generated password
   */
  readonly masterPassword?: SecretValue;

  /**
   * KMS encryption key to encrypt the generated secret.
   *
   * @default default master key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Options to add the multi user rotation
 */
export interface RotationMultiUserOptions {
  /**
   * The secret to rotate. It must be a JSON string with the following format:
   * ```
   * {
   *   "engine": <required: database engine>,
   *   "host": <required: instance host name>,
   *   "username": <required: username>,
   *   "password": <required: password>,
   *   "dbname": <optional: database name>,
   *   "port": <optional: if not specified, default port will be used>,
   *   "masterarn": <required: the arn of the master secret which will be used to create users/change passwords>
   * }
   * ```
   */
  readonly secret: secretsmanager.ISecret;

  /**
   * Specifies the number of days after the previous rotation before
   * Secrets Manager triggers the next automatic rotation.
   *
   * @default Duration.days(30)
   */
  readonly automaticallyAfter?: Duration;
}

/**
 * Create a Redshift Cluster with a given number of nodes.
 * Implemented by {@link Cluster} via {@link ClusterBase}.
 */
export interface ICluster extends IResource, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
  /**
   * Name of the cluster
   *
   * @attribute ClusterName
   */
  readonly clusterName: string;

  /**
   * The endpoint to use for read/write operations
   *
   * @attribute EndpointAddress,EndpointPort
   */
  readonly clusterEndpoint: Endpoint;
}

/**
 * Properties that describe an existing cluster instance
 */
export interface ClusterAttributes {
  /**
   * The security groups of the redshift cluster
   *
   * @default no security groups will be attached to the import
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Identifier for the cluster
   */
  readonly clusterName: string;

  /**
   * Cluster endpoint address
   */
  readonly clusterEndpointAddress: string;

  /**
   * Cluster endpoint port
   */
  readonly clusterEndpointPort: number;

}

/**
 * Properties for a new database cluster
 */
export interface ClusterProps {

  /**
   * An optional identifier for the cluster
   *
   * @default - A name is automatically generated.
   */
  readonly clusterName?: string;

  /**
   * Additional parameters to pass to the database engine
   * https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-parameter-groups.html
   *
   * @default - No parameter group.
   */
  readonly parameterGroup?: IClusterParameterGroup;

  /**
   * Number of compute nodes in the cluster. Only specify this property for multi-node clusters.
   *
   * Value must be at least 2 and no more than 100.
   *
   * @default - 2 if `clusterType` is ClusterType.MULTI_NODE, undefined otherwise
   */
  readonly numberOfNodes?: number;

  /**
   * The node type to be provisioned for the cluster.
   *
   * @default {@link NodeType.DC2_LARGE}
   */
  readonly nodeType?: NodeType;

  /**
   * Settings for the individual instances that are launched
   *
   * @default {@link ClusterType.MULTI_NODE}
   */
  readonly clusterType?: ClusterType;

  /**
   * What port to listen on
   *
   * @default - The default for the engine is used.
   */
  readonly port?: number;

  /**
   * Whether to enable encryption of data at rest in the cluster.
   *
   * @default true
   */
  readonly encrypted?: boolean

  /**
   * The KMS key to use for encryption of data at rest.
   *
   * @default - AWS-managed key, if encryption at rest is enabled
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * A preferred maintenance window day/time range. Should be specified as a range ddd:hh24:mi-ddd:hh24:mi (24H Clock UTC).
   *
   * Example: 'Sun:23:45-Mon:00:15'
   *
   * @default - 30-minute window selected at random from an 8-hour block of time for
   * each AWS Region, occurring on a random day of the week.
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_UpgradeDBInstance.Maintenance.html#Concepts.DBMaintenance
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * The VPC to place the cluster in.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Where to place the instances within the VPC
   *
   * @default - private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security group.
   *
   * @default - a new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * A cluster subnet group to use with this cluster.
   *
   * @default - a new subnet group will be created.
   */
  readonly subnetGroup?: IClusterSubnetGroup;

  /**
   * Username and password for the administrative user
   */
  readonly masterUser: Login;

  /**
   * A list of AWS Identity and Access Management (IAM) role that can be used by the cluster to access other AWS services.
   * Specify a maximum of 10 roles.
   *
   * @default - No role is attached to the cluster.
   */
  readonly roles?: iam.IRole[];

  /**
   * Name of a database which is automatically created inside the cluster
   *
   * @default - default_db
   */
  readonly defaultDatabaseName?: string;

  /**
   * Bucket to send logs to.
   * Logging information includes queries and connection attempts, for the specified Amazon Redshift cluster.
   *
   * @default - No Logs
   */
  readonly loggingBucket?: s3.IBucket

  /**
   * Prefix used for logging
   *
   * @default - no prefix
   */
  readonly loggingKeyPrefix?: string

  /**
   * The removal policy to apply when the cluster and its instances are removed
   * from the stack or replaced during an update.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy

  /**
   * Whether to make cluster publicly accessible.
   *
   * @default false
   */
  readonly publiclyAccessible?: boolean

  /**
   * If this flag is set, the cluster resizing type will be set to classic.
   * When resizing a cluster, classic resizing will always provision a new cluster and transfer the data there.
   *
   * Classic resize takes more time to complete, but it can be useful in cases where the change in node count or
   * the node type to migrate to doesn't fall within the bounds for elastic resize.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-operations.html#elastic-resize
   *
   * @default - Elastic resize type
   */
  readonly classicResizing?: boolean

  /**
   * The Elastic IP (EIP) address for the cluster.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/mgmt/managing-clusters-vpc.html
   *
   * @default - No Elastic IP
   */
  readonly elasticIp?: string
}

/**
 * A new or imported clustered database.
 */
abstract class ClusterBase extends Resource implements ICluster {

  /**
   * Name of the cluster
   */
  public abstract readonly clusterName: string;

  /**
   * The endpoint to use for read/write operations
   */
  public abstract readonly clusterEndpoint: Endpoint;

  /**
   * Access to the network connections
   */
  public abstract readonly connections: ec2.Connections;

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.clusterName,
      targetType: secretsmanager.AttachmentTargetType.REDSHIFT_CLUSTER,
    };
  }

}

/**
 * Create a Redshift cluster a given number of nodes.
 *
 * @resource AWS::Redshift::Cluster
 */
export class Cluster extends ClusterBase {
  /**
   * Import an existing DatabaseCluster from properties
   */
  public static fromClusterAttributes(scope: Construct, id: string, attrs: ClusterAttributes): ICluster {
    class Import extends ClusterBase {
      public readonly connections = new ec2.Connections({
        securityGroups: attrs.securityGroups,
        defaultPort: ec2.Port.tcp(attrs.clusterEndpointPort),
      });
      public readonly clusterName = attrs.clusterName;
      public readonly instanceIdentifiers: string[] = [];
      public readonly clusterEndpoint = new Endpoint(attrs.clusterEndpointAddress, attrs.clusterEndpointPort);
    }
    return new Import(scope, id);
  }

  /**
   * Identifier of the cluster
   */
  public readonly clusterName: string;

  /**
   * The endpoint to use for read/write operations
   */
  public readonly clusterEndpoint: Endpoint;

  /**
   * Access to the network connections
   */
  public readonly connections: ec2.Connections;

  /**
   * The secret attached to this cluster
   */
  public readonly secret?: secretsmanager.ISecret;

  private readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  private readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * The VPC where the DB subnet group is created.
   */
  private readonly vpc: ec2.IVpc;

  /**
   * The subnets used by the DB subnet group.
   */
  private readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The underlying CfnCluster
   */
  private readonly cluster: CfnCluster;

  /**
   * The cluster's parameter group
   */
  protected parameterGroup?: IClusterParameterGroup;

  /**
   * Identifier of the cluster
   */
  protected clusterIdentifier: string;

  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id);

    this.vpc = props.vpc;
    this.vpcSubnets = props.vpcSubnets ?? {
      subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
    };
    this.parameterGroup = props.parameterGroup;

    const removalPolicy = props.removalPolicy ?? RemovalPolicy.RETAIN;

    const subnetGroup = props.subnetGroup ?? new ClusterSubnetGroup(this, 'Subnets', {
      description: `Subnets for ${id} Redshift cluster`,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      removalPolicy: removalPolicy,
    });

    const securityGroups = props.securityGroups ?? [new ec2.SecurityGroup(this, 'SecurityGroup', {
      description: 'Redshift security group',
      vpc: this.vpc,
    })];

    const securityGroupIds = securityGroups.map(sg => sg.securityGroupId);

    let secret: DatabaseSecret | undefined;
    if (!props.masterUser.masterPassword) {
      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUser.masterUsername,
        encryptionKey: props.masterUser.encryptionKey,
      });
    }

    const clusterType = props.clusterType || ClusterType.MULTI_NODE;
    const nodeCount = this.validateNodeCount(clusterType, props.numberOfNodes);

    if (props.encrypted === false && props.encryptionKey !== undefined) {
      throw new Error('Cannot set property encryptionKey without enabling encryption!');
    }

    this.singleUserRotationApplication = secretsmanager.SecretRotationApplication.REDSHIFT_ROTATION_SINGLE_USER;
    this.multiUserRotationApplication = secretsmanager.SecretRotationApplication.REDSHIFT_ROTATION_MULTI_USER;

    let loggingProperties;
    if (props.loggingBucket) {
      loggingProperties = {
        bucketName: props.loggingBucket.bucketName,
        s3KeyPrefix: props.loggingKeyPrefix,
      };
    }

    this.cluster = new CfnCluster(this, 'Resource', {
      // Basic
      allowVersionUpgrade: true,
      automatedSnapshotRetentionPeriod: 1,
      clusterType,
      clusterIdentifier: props.clusterName,
      clusterSubnetGroupName: subnetGroup.clusterSubnetGroupName,
      vpcSecurityGroupIds: securityGroupIds,
      port: props.port,
      clusterParameterGroupName: props.parameterGroup && props.parameterGroup.clusterParameterGroupName,
      // Admin (unsafeUnwrap here is safe)
      masterUsername: secret?.secretValueFromJson('username').unsafeUnwrap() ?? props.masterUser.masterUsername,
      masterUserPassword: secret?.secretValueFromJson('password').unsafeUnwrap()
        ?? props.masterUser.masterPassword?.unsafeUnwrap()
        ?? 'default',
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      nodeType: props.nodeType || NodeType.DC2_LARGE,
      numberOfNodes: nodeCount,
      loggingProperties,
      iamRoles: props?.roles?.map(role => role.roleArn),
      dbName: props.defaultDatabaseName || 'default_db',
      publiclyAccessible: props.publiclyAccessible || false,
      // Encryption
      kmsKeyId: props.encryptionKey?.keyId,
      encrypted: props.encrypted ?? true,
      classic: props.classicResizing,
      elasticIp: props.elasticIp,
    });

    this.cluster.applyRemovalPolicy(removalPolicy, {
      applyToUpdateReplacePolicy: true,
    });

    this.clusterName = this.cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(this.cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(this.cluster.attrEndpointAddress, portAttribute);

    if (secret) {
      this.secret = secret.attach(this);
    }

    const defaultPort = ec2.Port.tcp(this.clusterEndpoint.port);
    this.connections = new ec2.Connections({ securityGroups, defaultPort });
    this.clusterIdentifier = props.clusterName ?? Names.uniqueResourceName(this, {});
  }

  /**
   * Adds the single user rotation of the master password to this cluster.
   *
   * @param [automaticallyAfter=Duration.days(30)] Specifies the number of days after the previous rotation
   * before Secrets Manager triggers the next automatic rotation.
   */
  public addRotationSingleUser(automaticallyAfter?: Duration): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add single user rotation for a cluster without secret.');
    }

    const id = 'RotationSingleUser';
    const existing = this.node.tryFindChild(id);
    if (existing) {
      throw new Error('A single user rotation was already added to this cluster.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      secret: this.secret,
      automaticallyAfter,
      application: this.singleUserRotationApplication,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      target: this,
    });
  }

  /**
   * Adds the multi user rotation to this cluster.
   */
  public addRotationMultiUser(id: string, options: RotationMultiUserOptions): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add multi user rotation for a cluster without secret.');
    }
    return new secretsmanager.SecretRotation(this, id, {
      secret: options.secret,
      masterSecret: this.secret,
      automaticallyAfter: options.automaticallyAfter,
      application: this.multiUserRotationApplication,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      target: this,
    });
  }

  private validateNodeCount(clusterType: ClusterType, numberOfNodes?: number): number | undefined {
    if (clusterType === ClusterType.SINGLE_NODE) {
      // This property must not be set for single-node clusters; be generous and treat a value of 1 node as undefined.
      if (numberOfNodes !== undefined && numberOfNodes !== 1) {
        throw new Error('Number of nodes must be not be supplied or be 1 for cluster type single-node');
      }
      return undefined;
    } else {
      if (Token.isUnresolved(numberOfNodes)) {
        return numberOfNodes;
      }
      const nodeCount = numberOfNodes ?? 2;
      if (nodeCount < 2 || nodeCount > 100) {
        throw new Error('Number of nodes for cluster type multi-node must be at least 2 and no more than 100');
      }
      return nodeCount;
    }
  }

  /**
   * Adds a parameter to the Clusters' parameter group
   *
   * @param name the parameter name
   * @param value the parameter name
   */
  public addToParameterGroup(name: string, value: string): void {
    if (!this.parameterGroup) {
      const param: { [name: string]: string } = {};
      param[name] = value;
      this.parameterGroup = new ClusterParameterGroup(this, 'ParameterGroup', {
        description: `Parameter Group for the ${this.clusterIdentifier} Redshift cluster`,
        parameters: param,
      });
      this.cluster.clusterParameterGroupName = this.parameterGroup.clusterParameterGroupName;
    } else {
      this.parameterGroup.addParameter(name, value);
    }
  }
}
