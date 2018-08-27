import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { DBClusterEndpointAddress, DBClusterEndpointPort, DBClusterName, DBInstanceId } from './rds.generated';

/**
 * Create a clustered database with a given number of instances.
 */
export abstract class DatabaseClusterRef extends cdk.Construct implements ec2.IConnectable {
    /**
     * Import an existing DatabaseCluster from properties
     */
    public static import(parent: cdk.Construct, name: string, props: DatabaseClusterRefProps): DatabaseClusterRef {
        return new ImportedDatabaseCluster(parent, name, props);
    }

    /**
     * Access to the network connections
     */
    public abstract readonly connections: ec2.Connections;

    /**
     * Identifier of the cluster
     */
    public abstract readonly clusterIdentifier: DBClusterName;

    /**
     * Identifiers of the replicas
     */
    public abstract readonly instanceIdentifiers: DBInstanceId[] = [];

    /**
     * The endpoint to use for read/write operations
     */
    public abstract readonly clusterEndpoint: Endpoint;

    /**
     * Endpoint to use for load-balanced read-only operations.
     */
    public abstract readonly readerEndpoint: Endpoint;

    /**
     * Endpoints which address each individual replica.
     */
    public abstract readonly instanceEndpoints: Endpoint[] = [];

    /**
     * The security group for this database cluster
     */
    protected abstract readonly securityGroupId: ec2.SecurityGroupId;

    /**
     * Export a Database Cluster for importing in another stack
     */
    public export(): DatabaseClusterRefProps {
        return {
            port: new cdk.Output(this, 'Port', { value: this.clusterEndpoint.port, }).makeImportValue(),
            securityGroupId: new cdk.Output(this, 'SecurityGroupId', { value: this.securityGroupId, }).makeImportValue(),
            clusterIdentifier: new cdk.Output(this, 'ClusterIdentifier', { value: this.clusterIdentifier, }).makeImportValue(),
            instanceIdentifiers: new cdk.StringListOutput(this, 'InstanceIdentifiers', { values: this.instanceIdentifiers }).makeImportValues(),
            clusterEndpointAddress: new cdk.Output(this, 'ClusterEndpointAddress', { value: this.clusterEndpoint.hostname, }).makeImportValue(),
            readerEndpointAddress: new cdk.Output(this, 'ReaderEndpointAddress', { value: this.readerEndpoint.hostname, }).makeImportValue(),
            // tslint:disable-next-line:max-line-length
            instanceEndpointAddresses: new cdk.StringListOutput(this, 'InstanceEndpointAddresses', { values: this.instanceEndpoints.map(e => e.hostname) }).makeImportValues(),
        };
    }
}

/**
 * Properties that describe an existing cluster instance
 */
export interface DatabaseClusterRefProps {
    /**
     * The database port
     */
    port: DBClusterEndpointPort;

    /**
     * The security group for this database cluster
     */
    securityGroupId: ec2.SecurityGroupId;

    /**
     * Identifier for the cluster
     */
    clusterIdentifier: DBClusterName;

    /**
     * Identifier for the instances
     */
    instanceIdentifiers: DBInstanceId[];

    /**
     * Cluster endpoint address
     */
    clusterEndpointAddress: DBClusterEndpointAddress;

    /**
     * Reader endpoint address
     */
    readerEndpointAddress: DBClusterEndpointAddress;

    /**
     * Endpoint addresses of individual instances
     */
    instanceEndpointAddresses: DBClusterEndpointAddress[];
}

/**
 * An imported Database Cluster
 */
class ImportedDatabaseCluster extends DatabaseClusterRef {
    /**
     * Default port to connect to this database
     */
    public readonly defaultPortRange: ec2.IPortRange;

    /**
     * Access to the network connections
     */
    public readonly connections: ec2.Connections;

    /**
     * Identifier of the cluster
     */
    public readonly clusterIdentifier: DBClusterName;

    /**
     * Identifiers of the replicas
     */
    public readonly instanceIdentifiers: DBInstanceId[] = [];

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

    /**
     * Security group identifier of this database
     */
    protected readonly securityGroupId: ec2.SecurityGroupId;

    constructor(parent: cdk.Construct, name: string, props: DatabaseClusterRefProps) {
        super(parent, name);

        this.securityGroupId = props.securityGroupId;
        this.defaultPortRange = new ec2.TcpPortFromAttribute(props.port);
        this.connections = new ec2.Connections({
            securityGroup: ec2.SecurityGroupRef.import(this, 'SecurityGroup', props),
            defaultPortRange: this.defaultPortRange
        });
        this.clusterIdentifier = props.clusterIdentifier;
        this.clusterEndpoint = new Endpoint(props.clusterEndpointAddress, props.port);
        this.readerEndpoint = new Endpoint(props.readerEndpointAddress, props.port);
        this.instanceEndpoints = props.instanceEndpointAddresses.map(a => new Endpoint(a, props.port));
    }
}

/**
 * A complete socket address (hostname + ":" + port)
 */
export class SocketAddress extends cdk.Token { }

/**
 * Connection endpoint of a database cluster or instance
 *
 * Consists of a combination of hostname and port.
 */
export class Endpoint {
    /**
     * The hostname of the endpoint
     */
    public readonly hostname: DBClusterEndpointAddress;

    /**
     * The port of the endpoint
     */
    public readonly port: DBClusterEndpointPort;

    /**
     * The combination of "HOSTNAME:PORT" for this endpoint
     */
    public readonly socketAddress: SocketAddress;

    constructor(address: DBClusterEndpointAddress, port: DBClusterEndpointPort) {
        this.hostname = address;
        this.port = port;
        this.socketAddress = new SocketAddress(new cdk.FnJoin(":", [address, port]));
    }
}
