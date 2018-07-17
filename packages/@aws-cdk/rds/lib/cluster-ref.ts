import { Construct, FnJoin, Output, StringListOutput, Token } from '@aws-cdk/cdk';
import { DefaultConnections, IDefaultConnectable, IPortRange, SecurityGroupId, SecurityGroupRef, TcpPortFromAttribute } from '@aws-cdk/ec2';
import { DBClusterEndpointAddress } from './rds.generated';

/**
 * Create a clustered database with a given number of instances.
 */
export abstract class DatabaseClusterRef extends Construct implements IDefaultConnectable {
    /**
     * Import an existing DatabaseCluster from properties
     */
    public static import(parent: Construct, name: string, props: DatabaseClusterRefProps): DatabaseClusterRef {
        return new ImportedDatabaseCluster(parent, name, props);
    }

    /**
     * Default port to connect to this database
     */
    public abstract readonly defaultPortRange: IPortRange;

    /**
     * Access to the network connections
     */
    public abstract readonly connections: DefaultConnections;

    /**
     * Identifier of the cluster
     */
    public abstract readonly clusterIdentifier: ClusterIdentifier;

    /**
     * Identifiers of the replicas
     */
    public abstract readonly instanceIdentifiers: InstanceIdentifier[] = [];

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
    protected abstract readonly securityGroupId: SecurityGroupId;

    /**
     * Export a Database Cluster for importing in another stack
     */
    public export(): DatabaseClusterRefProps {
        return {
            port: new Output(this, 'Port', { value: this.clusterEndpoint.port, }).makeImportValue(),
            securityGroupId: new Output(this, 'SecurityGroupId', { value: this.securityGroupId, }).makeImportValue(),
            clusterIdentifier: new Output(this, 'ClusterIdentifier', { value: this.clusterIdentifier, }).makeImportValue(),
            instanceIdentifiers: new StringListOutput(this, 'InstanceIdentifiers', { values: this.instanceIdentifiers }).makeImportValues(),
            clusterEndpointAddress: new Output(this, 'ClusterEndpointAddress', { value: this.clusterEndpoint.hostname, }).makeImportValue(),
            readerEndpointAddress: new Output(this, 'ReaderEndpointAddress', { value: this.readerEndpoint.hostname, }).makeImportValue(),
            // tslint:disable-next-line:max-line-length
            instanceEndpointAddresses: new StringListOutput(this, 'InstanceEndpointAddresses', { values: this.instanceEndpoints.map(e => e.hostname) }).makeImportValues(),
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
    port: Port;

    /**
     * The security group for this database cluster
     */
    securityGroupId: SecurityGroupId;

    /**
     * Identifier for the cluster
     */
    clusterIdentifier: ClusterIdentifier;

    /**
     * Identifier for the instances
     */
    instanceIdentifiers: InstanceIdentifier[];

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
    public readonly defaultPortRange: IPortRange;

    /**
     * Access to the network connections
     */
    public readonly connections: DefaultConnections;

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

    /**
     * Security group identifier of this database
     */
    protected readonly securityGroupId: SecurityGroupId;

    constructor(parent: Construct, name: string, props: DatabaseClusterRefProps) {
        super(parent, name);

        this.securityGroupId = props.securityGroupId;
        this.defaultPortRange = new TcpPortFromAttribute(props.port);
        this.connections = new DefaultConnections(new SecurityGroupRef(this, 'SecurityGroup', props), this);
        this.clusterIdentifier = props.clusterIdentifier;
        this.clusterEndpoint = new Endpoint(props.clusterEndpointAddress, props.port);
        this.readerEndpoint = new Endpoint(props.readerEndpointAddress, props.port);
        this.instanceEndpoints = props.instanceEndpointAddresses.map(a => new Endpoint(a, props.port));
    }
}

/**
 * Identifier of a cluster
 */
export class ClusterIdentifier extends Token { }

/**
 * Identifier of an instance
 */
export class InstanceIdentifier extends Token { }

/**
 * Port part of an address
 */
export class Port extends Token { }

/**
 * A complete socket address (hostname + ":" + port)
 */
export class SocketAddress extends Token { }

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
    public readonly port: Port;

    /**
     * The combination of "HOSTNAME:PORT" for this endpoint
     */
    public readonly socketAddress: SocketAddress;

    constructor(address: DBClusterEndpointAddress, port: Port) {
        this.hostname = address;
        this.port = port;
        this.socketAddress = new FnJoin(":", address, port);
    }
}
