import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Resource, Construct, Duration, Token, Annotations, RemovalPolicy, CfnDeletionPolicy } from '@aws-cdk/core';
import { IClusterEngine } from '../cluster-engine';
import { IServerlessDatabaseCluster, ServerlessDatabaseClusterAttributes } from '../cluster-ref';
import { DatabaseSecret } from '../database-secret';
import { Endpoint } from '../endpoint';
import { IParameterGroup } from '../parameter-group';
import { Login, RotationMultiUserOptions } from '../props';
import { CfnDBCluster, CfnDBSubnetGroup } from '../rds.generated';

/**
 * Properties to configure a Serverless Cluster
 */
export interface ServerlessClusterBaseProps {

  /**
   * What kind of database to start
   */
  readonly engine: IClusterEngine;

  /**
   * Username and password for the administrative user
   */
  readonly masterUser: Login;

  /**
   * An optional identifier for the cluster
   *
   * @default - A name is automatically generated.
   */
  readonly clusterIdentifier?: string;

  /**
   * The number of days during which automatic DB snapshots are retained. Set
   * to zero to disable backups.
   *
   * @default Duration.days(1)
   */
  readonly backupRetention?: Duration;

  /**
   * Name of a database which is automatically created inside the cluster
   *
   * @default - Database is not created in cluster.
   */
  readonly defaultDatabaseName?: string;

  /**
   * Indicates whether the DB cluster should have deletion protection enabled.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;

  /**
   * Whether to enable the HTTP endpoint for an Aurora Serverless database cluster
    *
   * @default false
   */
  readonly enableHttpEndpoint?: boolean;

  /**
   * The VPC that this Aurora Serverless cluster has been created in.
   *
   * @default - VPC is created with 2 availability zones (AZs)
   */
  readonly vpc: ec2.IVpc;

  /**
   * Where to place the instances within the VPC
   *
   * @default - the VPC default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * What port to listen on
   *
   * @default - The default for the engine is used.
   */
  readonly port?: number;

  /**
   * Scaling configuration
   *
   * @default - None
   */
  readonly scaling?: ServerlessScalingOptions;

  /**
   * The removal policy to apply when the cluster and its instances are removed
   * from the stack or replaced during an update.
   *
   * @default - RemovalPolicy.SNAPSHOT (remove the cluster and instances, but retain a snapshot of the data)
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Security group.
   *
   * @default - a new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The KMS key for storage encryption.
   * If specified, {@link storageEncrypted} will be set to `true`.
   *
   * @default - if storageEncrypted is true then the default master key, no key otherwise
   */
  readonly storageEncryptionKey?: kms.IKey;

  /**
   * Additional parameters to pass to the database engine
   *
   * @default - no parameter group.
   */
  readonly parameterGroup?: IParameterGroup;
}

/**
 * Properties to configure an Aurora Serverless Cluster
 */
export interface ServerlessDatabaseClusterProps extends ServerlessClusterBaseProps {
}

/**
 * Options for configuring scaling on an Aurora Serverless cluster
 */
export interface ServerlessScalingOptions {
  /**
   * Whether to allow automatic pause for the database cluster.
   * A database cluster can be paused only when it is idle (it has no connections).
   *
   * If a DB cluster is paused for more than seven days, the DB cluster might be
   * backed up with a snapshot. In this case, the DB cluster is restored when there
   * is a request to connect to it.
   *
   * @default true
   */
  readonly autoPause?: boolean;

  /**
   * The minimum capacity for an Aurora serverless database cluster.
   *
   * @default - determined by Aurora based on database engine
   */
  readonly minCapacity?: number;

  /**
   * The maximum capacity for an Aurora serverless database cluster.
   *
   * @default - determined by Aurora based on database engine
   */
  readonly maxCapacity?: number;

  /**
   * The time before an Aurora serverless database cluster is paused.
   *
   * @default Duration.minutes(5)
   */
  readonly autoPauseTime?: Duration;
}

/**
 * New or imported Serverless Cluster
 */
abstract class ServerlessClusterBase extends Resource implements IServerlessDatabaseCluster {
  /**
   * Identifier of the cluster
   */
  public abstract readonly clusterIdentifier: string;

  /**
   * The endpoint to use for read/write operations
   */
  public abstract readonly clusterEndpoint: Endpoint;

  /**
   * The endpoint to use for read/write operations
   */
  public abstract readonly clusterReadEndpoint: Endpoint;

  /**
   * Access to the network connections
   */
  public abstract readonly connections: ec2.Connections;

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.clusterIdentifier,
      targetType: secretsmanager.AttachmentTargetType.RDS_DB_CLUSTER,
    };
  }
}

/**
 * Create an Aurora Serverless Cluster
 *
 * @resource AWS::RDS::DBCluster
 */
export class ServerlessDatabaseCluster extends ServerlessClusterBase {

  /**
   * Import an existing DatabaseCluster from properties
   */
  public static fromServerlessDatabaseClusterAttributes(scope: Construct, id: string,
    attrs: ServerlessDatabaseClusterAttributes): IServerlessDatabaseCluster {

    return new ImportedServerlessDatabaseCluster(scope, id, attrs);
  }

  public readonly clusterIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;
  public readonly connections: ec2.Connections;

  /**
   * The secret attached to this cluster
   */
  public readonly secret?: secretsmanager.ISecret;

  private readonly securityGroups: ec2.ISecurityGroup[];
  private readonly subnetGroup: CfnDBSubnetGroup;
  private readonly vpc: ec2.IVpc;
  private readonly vpcSubnets?: ec2.SubnetSelection;

  private readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  private readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  constructor(scope:Construct, id: string, props: ServerlessDatabaseClusterProps) {
    super(scope, id);

    this.vpc = props.vpc ?? new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
    this.vpcSubnets = props.vpcSubnets;

    this.singleUserRotationApplication = props.engine.singleUserRotationApplication;
    this.multiUserRotationApplication = props.engine.multiUserRotationApplication;

    const { subnetIds } = this.vpc.selectSubnets(this.vpcSubnets);

    // Cannot test whether the subnets are in different AZs, but at least we can test the amount.
    if (subnetIds.length < 2) {
      Annotations.of(this).addError(`Cluster requires at least 2 subnets, got ${subnetIds.length}`);
    }

    this.subnetGroup = new CfnDBSubnetGroup(this, 'Subnets', {
      dbSubnetGroupDescription: `Subnets for ${id} database`,
      subnetIds,
    });

    if (props.removalPolicy === RemovalPolicy.RETAIN) {
      this.subnetGroup.applyRemovalPolicy(RemovalPolicy.RETAIN);
    }

    this.securityGroups = props.securityGroups ?? [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        description: 'RDS security group',
        vpc: this.vpc,
      }),
    ];

    let secret: DatabaseSecret | undefined;
    if (!props.masterUser.password) {
      secret = new DatabaseSecret(this, 'Secret', {
        username: props.masterUser.username,
        encryptionKey: props.masterUser.encryptionKey,
      });
    }

    // bind the engine to the Cluster
    const clusterEngineBindConfig = props.engine.bindToCluster(this, {
      parameterGroup: props.parameterGroup,
    });
    const clusterParameterGroup = props.parameterGroup ?? clusterEngineBindConfig.parameterGroup;
    const clusterParameterGroupConfig = clusterParameterGroup?.bindToCluster({});

    const cluster = new CfnDBCluster(this, 'Resource', {
      backupRetentionPeriod: props.backupRetention?.toDays(),
      databaseName: props.defaultDatabaseName,
      dbClusterIdentifier: props.clusterIdentifier,
      dbClusterParameterGroupName: clusterParameterGroupConfig?.parameterGroupName,
      dbSubnetGroupName: this.subnetGroup.ref,
      deletionProtection: props.deletionProtection,
      engine: props.engine.engineType,
      engineVersion: props.engine.engineVersion?.fullVersion,
      engineMode: 'serverless',
      enableHttpEndpoint: props.enableHttpEndpoint ?? false,
      kmsKeyId: props.storageEncryptionKey?.keyArn,
      masterUsername: secret ? secret.secretValueFromJson('username').toString() : props.masterUser.username,
      masterUserPassword: secret
        ? secret.secretValueFromJson('password').toString()
        : (props.masterUser.password
          ? props.masterUser.password.toString()
          : undefined),
      vpcSecurityGroupIds: this.securityGroups.map(sg => sg.securityGroupId),
    });

    this.clusterIdentifier = cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);
    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(this.clusterEndpoint.port),
    });

    this.setRemovalPolicy(cluster, props.removalPolicy);

    if (secret) {
      this.secret = secret.attach(this);
    }
  }

  /**
   * Renders the secret attachment target specifications.
   */
  public asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: this.clusterIdentifier,
      targetType: secretsmanager.AttachmentTargetType.RDS_DB_CLUSTER,
    };
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

  private setRemovalPolicy(cluster: CfnDBCluster, removalPolicy?: RemovalPolicy) {
    // if removalPolicy was not specified,
    // leave it as the default, which is Snapshot
    if (removalPolicy) {
      cluster.applyRemovalPolicy(removalPolicy);
    } else {
      // The CFN default makes sense for DeletionPolicy,
      // but doesn't cover UpdateReplacePolicy.
      // Fix that here.
      cluster.cfnOptions.updateReplacePolicy = CfnDeletionPolicy.SNAPSHOT;
    }
  }
}

/**
 * Represents an imported database cluster.
 */
class ImportedServerlessDatabaseCluster extends ServerlessClusterBase implements IServerlessDatabaseCluster {
  public readonly clusterIdentifier: string;
  public readonly connections: ec2.Connections;

  private readonly _clusterEndpoint?: Endpoint;
  private readonly _clusterReadEndpoint?: Endpoint;

  constructor(scope: Construct, id: string, attrs: ServerlessDatabaseClusterAttributes) {
    super(scope, id);

    this.clusterIdentifier = attrs.clusterIdentifier;

    const defaultPort = attrs.port ? ec2.Port.tcp(attrs.port) : undefined;
    this.connections = new ec2.Connections({
      securityGroups: attrs.securityGroups,
      defaultPort,
    });

    this._clusterEndpoint = (attrs.clusterEndpointAddress && attrs.port) ? new Endpoint(attrs.clusterEndpointAddress, attrs.port) : undefined;
    this._clusterReadEndpoint = (attrs.readerEndpointAddress && attrs.port) ? new Endpoint(attrs.readerEndpointAddress, attrs.port) : undefined;
  }

  public get clusterEndpoint() {
    if (!this._clusterEndpoint) {
      throw new Error('Cannot access `clusterEndpoint` of an imported cluster without an endpoint address and port');
    }
    return this._clusterEndpoint;
  }

  public get clusterReadEndpoint() {
    if (!this._clusterReadEndpoint) {
      throw new Error('Cannot access `clusterReadEndpoint` of an imported cluster without a readerEndpointAddress and port');
    }
    return this._clusterReadEndpoint;
  }
}
