import * as ec2 from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Construct, Duration, IResource, RemovalPolicy, Resource, Token } from '@aws-cdk/core';
import { DatabaseSecret } from './database-secret';
import { Endpoint } from './endpoint';
import { IParameterGroup } from './parameter-group';
import { Login, RotationMultiUserOptions } from './props';
import { CfnCluster, CfnClusterSubnetGroup } from './redshift.generated';

/**
 * Possible Node Types to use in the cluster
 * used for defining {@link ClusterProps.nodeType}.
 */
export enum NodeType {
    DS2_XLARGE = "ds2.xlarge",
    DS2_8XLARGE = "ds2.8xlarge",
    DC1_LARGE = "dc1.large",
    DC1_8XLARGE = "dc1.8xlarge",
    DC2_LARGE = "dc2.large",
    DC2_8XLARGE = "dc2.8xlarge",
    RA3_16XLARGE = "ra3.16xlarge",
}

/**
 * What cluster type to use.
 * Used by {@link ClusterProps.clusterType}
 */
export enum ClusterType {
    SINGLE_NODE = "single-node",
    MULTI_NODE = "multi-node",
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
    readonly clusterIdentifier?: string;

    /**
     * Additional parameters to pass to the database engine
     * https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-parameter-groups.html
     *
     * @default - No parameter group.
     */
    readonly parameterGroup?: IParameterGroup;

    /**
     * Number of compute nodes in the cluster
     *
     * Value must be at least 1 and no more than 100.
     *
     * @default 1
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
     * Whether to enable encryption of data in the cluster
     *
     * @default false
     */
    readonly encrypted?: boolean

    /**
     * The KMS key for storage encryption.
     * will be set to `true`.
     *
     * @default - default master key.
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
     *
     * @default a new Vpc will be created
     */
    readonly vpc: ec2.IVpc;

    /**
     * Where to place the instances within the VPC
     *
     * @default private subnets
     */
    readonly vpcSubnets?: ec2.SubnetSelection;

    /**
     * Security group.
     *
     * @default a new security group is created.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];

    /**
     * Username and password for the administrative user
     */
    readonly masterUser: Login;

    /**
     * A list of AWS Identity and Access Management (IAM) role that can be used by the cluster to access other AWS services.
     * Specify a maximum of 10 roles.
     *
     * @default - A role is automatically created for you
     */
    readonly roles?: IRole[];

    /**
     * Name of a database which is automatically created inside the cluster
     *
     * @default - default_db
     */
    readonly defaultDatabaseName?: string;

    /**
     * Specifies logging information, such as queries and connection attempts, for the specified Amazon Redshift cluster.
     *
     * @default - No Logs
     */
    readonly loggingProperties?: LoggingProperties;

    /**
     * The removal policy to apply when the cluster and its instances are removed
     * from the stack or replaced during an update.
     *
     * @default - RemovalPolicy.RETAIN
     */
    readonly removalPolicy?: RemovalPolicy
}

/**
 * Properties for Redshift Logging
 */
export interface LoggingProperties {
    /**
     * BucketName
     */
    readonly bucketName: string

    /**
     * Prefix
     */
    readonly s3KeyPrefix: string
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
            targetType: secretsmanager.AttachmentTargetType.REDSHIFT_CLUSTER
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
        class Import extends ClusterBase implements ICluster {
            public readonly defaultPort = ec2.Port.tcp(attrs.clusterEndpointPort);
            public readonly connections = new ec2.Connections({
                securityGroups: attrs.securityGroups,
                defaultPort: this.defaultPort
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
     * Security group identifier of this database
     */
    public readonly securityGroupIds: string[];

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

    constructor(scope: Construct, id: string, props: ClusterProps) {
        super(scope, id);

        this.vpc = props.vpc;
        this.vpcSubnets = props.vpcSubnets ? props.vpcSubnets : {
            subnetType: ec2.SubnetType.PRIVATE,
        };

        const { subnetIds } = this.vpc.selectSubnets(this.vpcSubnets);

        const subnetGroup = new CfnClusterSubnetGroup(this, 'Subnets', {
            description: `Subnets for ${id} Redshift cluster`,
            subnetIds,
        });

        subnetGroup.applyRemovalPolicy(props.removalPolicy, {
            applyToUpdateReplacePolicy: true
        });

        const securityGroups = props.securityGroups !== undefined ?
            props.securityGroups : [new ec2.SecurityGroup(this, 'SecurityGroup', {
                description: 'Redshift security group',
                vpc: this.vpc,
                securityGroupName: 'redshift SG'
            })];

        this.securityGroupIds = securityGroups.map(sg => sg.securityGroupId);

        let secret: DatabaseSecret | undefined;
        if (!props.masterUser.masterPassword) {
            secret = new DatabaseSecret(this, 'Secret', {
                username: props.masterUser.masterUsername,
                encryptionKey: props.masterUser.kmsKey
            });
        }

        const clusterType = props.clusterType || ClusterType.MULTI_NODE;
        const nodeCount = props.numberOfNodes ? props.numberOfNodes : (clusterType === ClusterType.MULTI_NODE ? 2 : 1);

        if (clusterType === ClusterType.MULTI_NODE && nodeCount < 2) {
            throw new Error('Number of nodes for cluster type multi-node must be at least 2');
        }

        this.singleUserRotationApplication = secretsmanager.SecretRotationApplication.REDSHIFT_ROTATION_SINGLE_USER;
        this.multiUserRotationApplication = secretsmanager.SecretRotationApplication.REDSHIFT_ROTATION_MULTI_USER;

        const cluster = new CfnCluster(this, 'Resource', {
            // Basic
            allowVersionUpgrade: true,
            automatedSnapshotRetentionPeriod: 1,
            clusterType,
            clusterIdentifier: props.clusterIdentifier,
            clusterSubnetGroupName: subnetGroup.ref,
            vpcSecurityGroupIds: this.securityGroupIds,
            port: props.port,
            clusterParameterGroupName: props.parameterGroup && props.parameterGroup.parameterGroupName,
            // Admin
            masterUsername: secret ? secret.secretValueFromJson('username').toString() : props.masterUser.masterUsername,
            masterUserPassword: secret
                ? secret.secretValueFromJson('password').toString()
                : (props.masterUser.masterPassword
                    ? props.masterUser.masterPassword.toString()
                    : "default"),
            preferredMaintenanceWindow: props.preferredMaintenanceWindow,
            nodeType: props.nodeType || NodeType.DC2_LARGE,
            numberOfNodes: nodeCount,
            loggingProperties: props.loggingProperties,
            iamRoles: props.roles ? props.roles.map(role => role.roleArn) : undefined,
            dbName: props.defaultDatabaseName || "default_db",
            publiclyAccessible: false,
            // Encryption
            kmsKeyId: props.encryptionKey && props.encryptionKey.keyArn,
            encrypted: props.encrypted ? props.encrypted : true,
        });

        cluster.applyRemovalPolicy(props.removalPolicy, {
            applyToUpdateReplacePolicy: true
        });

        this.clusterName = cluster.ref;

        // create a number token that represents the port of the cluster
        const portAttribute = Token.asNumber(cluster.attrEndpointPort);
        this.clusterEndpoint = new Endpoint(cluster.attrEndpointAddress, portAttribute);

        if (secret) {
            this.secret = secret.attach(this);
        }

        const defaultPort = ec2.Port.tcp(this.clusterEndpoint.port);
        this.connections = new ec2.Connections({ securityGroups, defaultPort });
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
}
