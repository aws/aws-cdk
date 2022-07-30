import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Resource, Duration, Token, Annotations, RemovalPolicy, IResource, Stack, Lazy, FeatureFlags, ArnFormat } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { IClusterEngine } from './cluster-engine';
import { DatabaseSecret } from './database-secret';
import { Endpoint } from './endpoint';
import { IParameterGroup } from './parameter-group';
import { DATA_API_ACTIONS } from './perms';
import { applyDefaultRotationOptions, defaultDeletionProtection, renderCredentials } from './private/util';
import { Credentials, RotationMultiUserOptions, RotationSingleUserOptions, SnapshotCredentials } from './props';
import { CfnDBCluster, CfnDBClusterProps } from './rds.generated';
import { ISubnetGroup, SubnetGroup } from './subnet-group';

/**
  * Interface representing a serverless database cluster.
  *
 */
export interface IServerlessCluster extends IResource, ec2.IConnectable, secretsmanager.ISecretAttachmentTarget {
  /**
   * Identifier of the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * The ARN of the cluster
   */
  readonly clusterArn: string;

  /**
   * The endpoint to use for read/write operations
   * @attribute EndpointAddress,EndpointPort
   */
  readonly clusterEndpoint: Endpoint;

  /**
   * Endpoint to use for load-balanced read-only operations.
   * @attribute ReadEndpointAddress
   */
  readonly clusterReadEndpoint: Endpoint;

  /**
   * Grant the given identity to access to the Data API.
   *
   * @param grantee The principal to grant access to
   */
  grantDataApiAccess(grantee: iam.IGrantable): iam.Grant
}
/**
 *  Common Properties to configure new Aurora Serverless Cluster or Aurora Serverless Cluster from snapshot
 */
interface ServerlessClusterNewProps {
  /**
   * What kind of database to start
   */
  readonly engine: IClusterEngine;

  /**
   * An optional identifier for the cluster
   *
   * @default - A name is automatically generated.
   */
  readonly clusterIdentifier?: string;

  /**
   * The number of days during which automatic DB snapshots are retained.
   * Automatic backup retention cannot be disabled on serverless clusters.
   * Must be a value from 1 day to 35 days.
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
   * @default - true if removalPolicy is RETAIN, false otherwise
   */
  readonly deletionProtection?: boolean;

  /**
   * Whether to enable the Data API.
   *
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html
    *
   * @default false
   */
  readonly enableDataApi?: boolean;

  /**
   * The VPC that this Aurora Serverless cluster has been created in.
   *
   * @default - the default VPC in the account and region will be used
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the instances within the VPC.
   * If provided, the `vpc` property must also be specified.
   *
   * @default - the VPC default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Scaling configuration of an Aurora Serverless database cluster.
   *
   * @default - Serverless cluster is automatically paused after 5 minutes of being idle.
   *   minimum capacity: 2 ACU
   *   maximum capacity: 16 ACU
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
   * @default - a new security group is created if `vpc` was provided.
   *   If the `vpc` property was not provided, no VPC security groups will be associated with the DB cluster.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Additional parameters to pass to the database engine
   *
   * @default - no parameter group.
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * Existing subnet group for the cluster.
   *
   * @default - a new subnet group is created if `vpc` was provided.
   *   If the `vpc` property was not provided, no subnet group will be associated with the DB cluster
   */
  readonly subnetGroup?: ISubnetGroup;

  /**
   * Whether to copy tags to the snapshot when a snapshot is created.
   *
   * @default - true
   */
  readonly copyTagsToSnapshot?: boolean;
}

/**
 * Properties that describe an existing cluster instance
 *
 */
export interface ServerlessClusterAttributes {
  /**
   * Identifier for the cluster
   */
  readonly clusterIdentifier: string;

  /**
   * The database port
   *
   * @default - none
   */
  readonly port?: number;

  /**
   * The security groups of the database cluster
   *
   * @default - no security groups
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Cluster endpoint address
   *
   * @default - no endpoint address
   */
  readonly clusterEndpointAddress?: string;

  /**
   * Reader endpoint address
   *
   * @default - no reader address
   */
  readonly readerEndpointAddress?: string;

  /**
   * The secret attached to the database cluster
   *
   * @default - no secret
   */
  readonly secret?: secretsmanager.ISecret;
}

/**
 * Aurora capacity units (ACUs).
 * Each ACU is a combination of processing and memory capacity.
 *
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.setting-capacity.html
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.how-it-works.html#aurora-serverless.architecture
 *
 */
export enum AuroraCapacityUnit {
  /** 1 Aurora Capacity Unit */
  ACU_1 = 1,
  /** 2 Aurora Capacity Units */
  ACU_2 = 2,
  /** 4 Aurora Capacity Units */
  ACU_4 = 4,
  /** 8 Aurora Capacity Units */
  ACU_8 = 8,
  /** 16 Aurora Capacity Units */
  ACU_16 = 16,
  /** 32 Aurora Capacity Units */
  ACU_32 = 32,
  /** 64 Aurora Capacity Units */
  ACU_64 = 64,
  /** 128 Aurora Capacity Units */
  ACU_128 = 128,
  /** 192 Aurora Capacity Units */
  ACU_192 = 192,
  /** 256 Aurora Capacity Units */
  ACU_256 = 256,
  /** 384 Aurora Capacity Units */
  ACU_384 = 384
}

/**
 * Options for configuring scaling on an Aurora Serverless cluster
 *
 */
export interface ServerlessScalingOptions {
  /**
   * The minimum capacity for an Aurora Serverless database cluster.
   *
   * @default - determined by Aurora based on database engine
   */
  readonly minCapacity?: AuroraCapacityUnit;

  /**
   * The maximum capacity for an Aurora Serverless database cluster.
   *
   * @default - determined by Aurora based on database engine
   */
  readonly maxCapacity?: AuroraCapacityUnit;

  /**
   * The time before an Aurora Serverless database cluster is paused.
   * A database cluster can be paused only when it is idle (it has no connections).
   * Auto pause time must be between 5 minutes and 1 day.
   *
   * If a DB cluster is paused for more than seven days, the DB cluster might be
   * backed up with a snapshot. In this case, the DB cluster is restored when there
   * is a request to connect to it.
   *
   * Set to 0 to disable
   *
   * @default - automatic pause enabled after 5 minutes
   */
  readonly autoPause?: Duration;
}

/**
 * New or imported Serverless Cluster
 */
abstract class ServerlessClusterBase extends Resource implements IServerlessCluster {
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
   * The secret attached to this cluster
   */
  public abstract readonly secret?: secretsmanager.ISecret

  protected abstract enableDataApi?: boolean;

  /**
   * The ARN of the cluster
   */
  public get clusterArn(): string {
    return Stack.of(this).formatArn({
      service: 'rds',
      resource: 'cluster',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      resourceName: this.clusterIdentifier,
    });
  }

  /**
   * Grant the given identity to access to the Data API, including read access to the secret attached to the cluster if present
   *
   * @param grantee The principal to grant access to
   */
  public grantDataApiAccess(grantee: iam.IGrantable): iam.Grant {
    if (this.enableDataApi === false) {
      throw new Error('Cannot grant Data API access when the Data API is disabled');
    }

    this.enableDataApi = true;
    const ret = iam.Grant.addToPrincipal({
      grantee,
      actions: DATA_API_ACTIONS,
      resourceArns: ['*'],
      scope: this,
    });
    this.secret?.grantRead(grantee);
    return ret;
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
}

/**
 * Create an Aurora Serverless Cluster
 *
 * @resource AWS::RDS::DBCluster
 */
abstract class ServerlessClusterNew extends ServerlessClusterBase {
  public readonly connections: ec2.Connections;
  protected readonly newCfnProps: CfnDBClusterProps;
  protected readonly securityGroups: ec2.ISecurityGroup[];
  protected enableDataApi?: boolean;

  constructor(scope: Construct, id: string, props: ServerlessClusterNewProps) {
    super(scope, id);

    if (props.vpc === undefined) {
      if (props.vpcSubnets !== undefined) {
        throw new Error('A VPC is required to use vpcSubnets in ServerlessCluster. Please add a VPC or remove vpcSubnets');
      }
      if (props.subnetGroup !== undefined) {
        throw new Error('A VPC is required to use subnetGroup in ServerlessCluster. Please add a VPC or remove subnetGroup');
      }
      if (props.securityGroups !== undefined) {
        throw new Error('A VPC is required to use securityGroups in ServerlessCluster. Please add a VPC or remove securityGroups');
      }
    }

    let subnetGroup: ISubnetGroup | undefined = props.subnetGroup;
    this.securityGroups = props.securityGroups ?? [];
    if (props.vpc !== undefined) {
      const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets);

      // Cannot test whether the subnets are in different AZs, but at least we can test the amount.
      if (subnetIds.length < 2) {
        Annotations.of(this).addError(`Cluster requires at least 2 subnets, got ${subnetIds.length}`);
      }

      subnetGroup = props.subnetGroup ?? new SubnetGroup(this, 'Subnets', {
        description: `Subnets for ${id} database`,
        vpc: props.vpc,
        vpcSubnets: props.vpcSubnets,
        removalPolicy: props.removalPolicy === RemovalPolicy.RETAIN ? props.removalPolicy : undefined,
      });

      this.securityGroups = props.securityGroups ?? [
        new ec2.SecurityGroup(this, 'SecurityGroup', {
          description: 'RDS security group',
          vpc: props.vpc,
        }),
      ];
    }

    if (props.backupRetention) {
      const backupRetentionDays = props.backupRetention.toDays();
      if (backupRetentionDays < 1 || backupRetentionDays > 35) {
        throw new Error(`backup retention period must be between 1 and 35 days. received: ${backupRetentionDays}`);
      }
    }

    // bind the engine to the Cluster
    const clusterEngineBindConfig = props.engine.bindToCluster(this, {
      parameterGroup: props.parameterGroup,
    });
    const clusterParameterGroup = props.parameterGroup ?? clusterEngineBindConfig.parameterGroup;
    const clusterParameterGroupConfig = clusterParameterGroup?.bindToCluster({});


    const clusterIdentifier = FeatureFlags.of(this).isEnabled(cxapi.RDS_LOWERCASE_DB_IDENTIFIER)
      ? props.clusterIdentifier?.toLowerCase()
      : props.clusterIdentifier;

    this.newCfnProps = {
      backupRetentionPeriod: props.backupRetention?.toDays(),
      databaseName: props.defaultDatabaseName,
      dbClusterIdentifier: clusterIdentifier,
      dbClusterParameterGroupName: clusterParameterGroupConfig?.parameterGroupName,
      dbSubnetGroupName: subnetGroup?.subnetGroupName,
      deletionProtection: defaultDeletionProtection(props.deletionProtection, props.removalPolicy),
      engine: props.engine.engineType,
      engineVersion: props.engine.engineVersion?.fullVersion,
      engineMode: 'serverless',
      enableHttpEndpoint: Lazy.any({ produce: () => this.enableDataApi }),
      scalingConfiguration: props.scaling ? this.renderScalingConfiguration(props.scaling) : undefined,
      storageEncrypted: true,
      vpcSecurityGroupIds: this.securityGroups.map(sg => sg.securityGroupId),
      copyTagsToSnapshot: props.copyTagsToSnapshot ?? true,
    };

    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
      defaultPort: ec2.Port.tcp(Lazy.number({ produce: () => this.clusterEndpoint.port })),
    });
  }

  private renderScalingConfiguration(options: ServerlessScalingOptions): CfnDBCluster.ScalingConfigurationProperty {
    const minCapacity = options.minCapacity;
    const maxCapacity = options.maxCapacity;

    if (minCapacity && maxCapacity && minCapacity > maxCapacity) {
      throw new Error('maximum capacity must be greater than or equal to minimum capacity.');
    }

    const secondsToAutoPause = options.autoPause?.toSeconds();
    if (secondsToAutoPause && (secondsToAutoPause < 300 || secondsToAutoPause > 86400)) {
      throw new Error('auto pause time must be between 5 minutes and 1 day.');
    }

    return {
      autoPause: (secondsToAutoPause === 0) ? false : true,
      minCapacity: options.minCapacity,
      maxCapacity: options.maxCapacity,
      secondsUntilAutoPause: (secondsToAutoPause === 0) ? undefined : secondsToAutoPause,
    };
  }
}

/**
 * Properties for a new Aurora Serverless Cluster
 */
export interface ServerlessClusterProps extends ServerlessClusterNewProps {
  /**
   * Credentials for the administrative user
   *
   * @default - A username of 'admin' and SecretsManager-generated password
   */
  readonly credentials?: Credentials;

  /**
   * The KMS key for storage encryption.
   *
   * @default - the default master key will be used for storage encryption
   */
  readonly storageEncryptionKey?: kms.IKey;
}

/**
 * Create an Aurora Serverless Cluster
 *
 * @resource AWS::RDS::DBCluster
 *
 */
export class ServerlessCluster extends ServerlessClusterNew {
  /**
   * Import an existing DatabaseCluster from properties
   */
  public static fromServerlessClusterAttributes(
    scope: Construct, id: string, attrs: ServerlessClusterAttributes,
  ): IServerlessCluster {

    return new ImportedServerlessCluster(scope, id, attrs);
  }

  public readonly clusterIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;

  public readonly secret?: secretsmanager.ISecret;

  private readonly vpc?: ec2.IVpc;
  private readonly vpcSubnets?: ec2.SubnetSelection;

  private readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  private readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  constructor(scope: Construct, id: string, props: ServerlessClusterProps) {
    super(scope, id, props);

    this.vpc = props.vpc;
    this.vpcSubnets = props.vpcSubnets;

    this.singleUserRotationApplication = props.engine.singleUserRotationApplication;
    this.multiUserRotationApplication = props.engine.multiUserRotationApplication;

    this.enableDataApi = props.enableDataApi;

    const credentials = renderCredentials(this, props.engine, props.credentials);
    const secret = credentials.secret;

    const cluster = new CfnDBCluster(this, 'Resource', {
      ...this.newCfnProps,
      masterUsername: credentials.username,
      masterUserPassword: credentials.password?.unsafeUnwrap(),
      kmsKeyId: props.storageEncryptionKey?.keyArn,
    });

    this.clusterIdentifier = cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);

    cluster.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.SNAPSHOT);

    if (secret) {
      this.secret = secret.attach(this);
    }
  }

  /**
   * Adds the single user rotation of the master password to this cluster.
   */
  public addRotationSingleUser(options: RotationSingleUserOptions = {}): secretsmanager.SecretRotation {
    if (!this.secret) {
      throw new Error('Cannot add single user rotation for a cluster without secret.');
    }

    if (this.vpc === undefined) {
      throw new Error('Cannot add single user rotation for a cluster without VPC.');
    }

    const id = 'RotationSingleUser';
    const existing = this.node.tryFindChild(id);
    if (existing) {
      throw new Error('A single user rotation was already added to this cluster.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      ...applyDefaultRotationOptions(options, this.vpcSubnets),
      secret: this.secret,
      application: this.singleUserRotationApplication,
      vpc: this.vpc,
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

    if (this.vpc === undefined) {
      throw new Error('Cannot add multi user rotation for a cluster without VPC.');
    }

    return new secretsmanager.SecretRotation(this, id, {
      ...applyDefaultRotationOptions(options, this.vpcSubnets),
      secret: options.secret,
      masterSecret: this.secret,
      application: this.multiUserRotationApplication,
      vpc: this.vpc,
      target: this,
    });
  }
}

/**
 * Represents an imported database cluster.
 */
class ImportedServerlessCluster extends ServerlessClusterBase implements IServerlessCluster {
  public readonly clusterIdentifier: string;
  public readonly connections: ec2.Connections;

  public readonly secret?: secretsmanager.ISecret;

  protected readonly enableDataApi = true

  private readonly _clusterEndpoint?: Endpoint;
  private readonly _clusterReadEndpoint?: Endpoint;

  constructor(scope: Construct, id: string, attrs: ServerlessClusterAttributes) {
    super(scope, id);

    this.clusterIdentifier = attrs.clusterIdentifier;

    const defaultPort = attrs.port ? ec2.Port.tcp(attrs.port) : undefined;
    this.connections = new ec2.Connections({
      securityGroups: attrs.securityGroups,
      defaultPort,
    });

    this.secret = attrs.secret;

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

/**
 * Properties for ``ServerlessClusterFromSnapshot``
 */
export interface ServerlessClusterFromSnapshotProps extends ServerlessClusterNewProps {
  /**
   * The identifier for the DB instance snapshot or DB cluster snapshot to restore from.
   * You can use either the name or the Amazon Resource Name (ARN) to specify a DB cluster snapshot.
   * However, you can use only the ARN to specify a DB instance snapshot.
   */
  readonly snapshotIdentifier: string;

  /**
   * Master user credentials.
   *
   * Note - It is not possible to change the master username for a snapshot;
   * however, it is possible to provide (or generate) a new password.
   *
   * @default - The existing username and password from the snapshot will be used.
   */
  readonly credentials?: SnapshotCredentials;
}

/**
 * A Aurora Serverless Cluster restored from a snapshot.
 *
 * @resource AWS::RDS::DBCluster
 */
export class ServerlessClusterFromSnapshot extends ServerlessClusterNew {
  public readonly clusterIdentifier: string;
  public readonly clusterEndpoint: Endpoint;
  public readonly clusterReadEndpoint: Endpoint;
  public readonly secret?: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: ServerlessClusterFromSnapshotProps) {
    super(scope, id, props);

    this.enableDataApi = props.enableDataApi;

    let credentials = props.credentials;
    let secret = credentials?.secret;
    if (!secret && credentials?.generatePassword) {
      if (!credentials.username) {
        throw new Error('`credentials` `username` must be specified when `generatePassword` is set to true');
      }

      secret = new DatabaseSecret(this, 'Secret', {
        username: credentials.username,
        encryptionKey: credentials.encryptionKey,
        excludeCharacters: credentials.excludeCharacters,
        replaceOnPasswordCriteriaChanges: credentials.replaceOnPasswordCriteriaChanges,
        replicaRegions: credentials.replicaRegions,
      });
    }

    const cluster = new CfnDBCluster(this, 'Resource', {
      ...this.newCfnProps,
      snapshotIdentifier: props.snapshotIdentifier,
      masterUserPassword: secret?.secretValueFromJson('password')?.unsafeUnwrap() ?? credentials?.password?.unsafeUnwrap(), // Safe usage
    });

    this.clusterIdentifier = cluster.ref;

    // create a number token that represents the port of the cluster
    const portAttribute = Token.asNumber(cluster.attrEndpointPort);
    this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);
    this.clusterReadEndpoint = new Endpoint(cluster.attrReadEndpointAddress, portAttribute);

    cluster.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.SNAPSHOT);

    if (secret) {
      this.secret = secret.attach(this);
    }
  }
}
