import { Construct } from '@aws-cdk/cdk';
import { DefaultConnections, IConnectable } from '@aws-cdk/ec2';
import { KeyArn } from '@aws-cdk/kms';
import { ClusterIdentifier, DatabaseCluster, DatabaseClusterEngine, Endpoint, InstanceIdentifier, InstanceProps, Login } from '@aws-cdk/rds';

/**
 * Properties for a Neptune Graph Database Cluster
 */
export interface NeptuneDatabaseProps {
    /**
     * How many replicas/instances to create
     *
     * Has to be at least 1. Default is 2.
     *
     * @default 2
     */
    instances?: number;

    /**
     * Settings for the individual instances that are launched
     */
    instanceProps: InstanceProps;

    /**
     * Username and password for the administrative user
     */
    masterUser: Login;

    /**
     * What port to listen on
     *
     * @default 3306
     */
    port?: number;

    /**
     * An optional identifier for the cluster
     *
     * If not given, a name is generated.
     */
    clusterIdentifier?: string;

    /**
     * Base identifier for instances
     *
     * Every replica is named by appending the replica number to this string, 1-based.
     *
     * If not given, the clusterIdentifier is used with the word "Instance" appended.
     *
     * If clusterIdentifier is also not given, the identifier is automatically generated.
     */
    instanceIdentifierBase?: string;

    /**
     * Name of a database which is automatically created inside the cluster
     *
     * If not given, no database is created.
     */
    defaultDatabaseName?: string;

    /**
     * ARN of KMS key if you want to enable storage encryption
     */
    kmsKeyArn?: KeyArn;

    /**
     * A daily time range in 24-hours UTC format in which backups preferably execute.
     *
     * Must be at least 30 minutes long.
     *
     * Example: '01:00-02:00'
     *
     * If not given, an window is randomly.
     */
    preferredMaintenanceWindow?: string;

    // Additional parameters to the database engine go here
}

/**
 * Neptune Graph Database cluster
 *
 * Creates a new Neptune database cluster with a given number of replicas.
 */
export class NeptuneDatabase extends Construct implements IConnectable {
    /**
     * Identifier of the cluster
     */
    public readonly clusterIdentifier: ClusterIdentifier;

    /**
     * Identifiers of the replicas
     */
    public readonly instanceIdentifiers: InstanceIdentifier[] = [];

    /**
     * The endpoint to use for read/write operations
     */
    public readonly clusterEndpoint: Endpoint;

    /**
     * Endpoint to use for load-balanced read-only operations.
     */
    public readonly readerEndpoint: Endpoint;

    /**
     * Endpoints which address each individual replica.
     */
    public readonly instanceEndpoints: Endpoint[] = [];

    public readonly connections: DefaultConnections;

    private readonly cluster: DatabaseCluster;

    constructor(parent: Construct, name: string, props: NeptuneDatabaseProps) {
        super(parent, name);

        this.cluster = new DatabaseCluster(this, 'Cluster', {
            engine: DatabaseClusterEngine.Aurora,
            instances: props.instances,
            instanceProps: props.instanceProps,
            masterUser: props.masterUser,
            port: props.port,
            clusterIdentifier: props.clusterIdentifier,
            instanceIdentifierBase: props.instanceIdentifierBase,
            defaultDatabaseName: props.defaultDatabaseName,
            kmsKeyArn: props.kmsKeyArn,
            parameters: {}, // Additional parameters go here
            preferredMaintenanceWindow: props.preferredMaintenanceWindow,
        });

        this.clusterIdentifier = this.cluster.clusterIdentifier;
        this.instanceIdentifiers = this.cluster.instanceIdentifiers;
        this.clusterEndpoint = this.cluster.clusterEndpoint;
        this.readerEndpoint = this.cluster.readerEndpoint;
        this.connections = this.cluster.connections;
    }
}
