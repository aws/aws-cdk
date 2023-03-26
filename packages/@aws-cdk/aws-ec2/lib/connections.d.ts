import { IPeer } from './peer';
import { Port } from './port';
import { ISecurityGroup } from './security-group';
/**
 * The goal of this module is to make possible to write statements like this:
 *
 *  ```ts
 *  database.connections.allowFrom(fleet);
 *  fleet.connections.allowTo(database);
 *  rdgw.connections.allowFromCidrIp('0.3.1.5/86');
 *  rgdw.connections.allowTrafficTo(fleet, new AllPorts());
 *  ```
 *
 * The insight here is that some connecting peers have information on what ports should
 * be involved in the connection, and some don't.
 */
/**
 * An object that has a Connections object
 */
export interface IConnectable {
    /**
     * The network connections associated with this resource.
     */
    readonly connections: Connections;
}
/**
 * Properties to intialize a new Connections object
 */
export interface ConnectionsProps {
    /**
     * Class that represents the rule by which others can connect to this connectable
     *
     * This object is required, but will be derived from securityGroup if that is passed.
     *
     * @default Derived from securityGroup if set.
     */
    readonly peer?: IPeer;
    /**
     * What securityGroup(s) this object is managing connections for
     *
     * @default No security groups
     */
    readonly securityGroups?: ISecurityGroup[];
    /**
     * Default port range for initiating connections to and from this object
     *
     * @default - No default port
     */
    readonly defaultPort?: Port;
}
/**
 * Manage the allowed network connections for constructs with Security Groups.
 *
 * Security Groups can be thought of as a firewall for network-connected
 * devices. This class makes it easy to allow network connections to and
 * from security groups, and between security groups individually. When
 * establishing connectivity between security groups, it will automatically
 * add rules in both security groups
 *
 * This object can manage one or more security groups.
 */
export declare class Connections implements IConnectable {
    readonly connections: Connections;
    /**
     * The default port configured for this connection peer, if available
     */
    readonly defaultPort?: Port;
    /**
     * Underlying securityGroup for this Connections object, if present
     *
     * May be empty if this Connections object is not managing a SecurityGroup,
     * but simply representing a Connectable peer.
     */
    private readonly _securityGroups;
    /**
     * The rule that defines how to represent this peer in a security group
     */
    private readonly _securityGroupRules;
    /**
     * When doing bidirectional grants between Connections, make sure we don't recursive infinitely
     */
    private skip;
    /**
     * When doing bidirectional grants between Security Groups in different stacks, put the rule on the other SG
     */
    private remoteRule;
    constructor(props?: ConnectionsProps);
    get securityGroups(): ISecurityGroup[];
    /**
     * Add a security group to the list of security groups managed by this object
     */
    addSecurityGroup(...securityGroups: ISecurityGroup[]): void;
    /**
     * Allow connections to the peer on the given port
     */
    allowTo(other: IConnectable, portRange: Port, description?: string): void;
    /**
     * Allow connections from the peer on the given port
     */
    allowFrom(other: IConnectable, portRange: Port, description?: string): void;
    /**
     * Allow hosts inside the security group to connect to each other on the given port
     */
    allowInternally(portRange: Port, description?: string): void;
    /**
     * Allow to all IPv4 ranges
     */
    allowToAnyIpv4(portRange: Port, description?: string): void;
    /**
     * Allow from any IPv4 ranges
     */
    allowFromAnyIpv4(portRange: Port, description?: string): void;
    /**
     * Allow connections from the peer on our default port
     *
     * Even if the peer has a default port, we will always use our default port.
     */
    allowDefaultPortFrom(other: IConnectable, description?: string): void;
    /**
     * Allow hosts inside the security group to connect to each other
     */
    allowDefaultPortInternally(description?: string): void;
    /**
     * Allow default connections from all IPv4 ranges
     */
    allowDefaultPortFromAnyIpv4(description?: string): void;
    /**
     * Allow connections to the security group on their default port
     */
    allowToDefaultPort(other: IConnectable, description?: string): void;
    /**
     * Allow connections from the peer on our default port
     *
     * Even if the peer has a default port, we will always use our default port.
     */
    allowDefaultPortTo(other: IConnectable, description?: string): void;
}
