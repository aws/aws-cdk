import { AnyIPv4, IConnectionPeer, IPortRange } from "./connection";
import { ISecurityGroup } from "./security-group";

/**
 * The goal of this module is to make possible to write statements like this:
 *
 *    ```ts
 *    database.connections.allowFrom(fleet);
 *    fleet.connections.allowTo(database);
 *    rdgw.connections.allowFromCidrIp('0.3.1.5/86');
 *    rgdw.connections.allowTrafficTo(fleet, new AllPorts());
 *    ```
 *
 * The insight here is that some connecting peers have information on what ports should
 * be involved in the connection, and some don't.
 *
 * Constructs will make their `connections` property to be equal to an instance of
 * either `Connections` or `ConnectionsWithDefault`.
 */

/**
 * An object that has a Connections object
 */
export interface IConnectable {
    readonly connections: IConnections;
}

/**
 * An object that has a Connections object as well as a default port range.
 */
export interface IDefaultConnectable extends IConnectable {
    readonly defaultPortRange: IPortRange;
}

/**
 * An object that encapsulates connection logic
 *
 * The IConnections object both has knowledge on what peer to use,
 * as well as how to add connection rules.
 */
export interface IConnections {
    /**
     * Access to the peer that we're connecting to
     *
     * It's convenient to put this on the Connections object since
     * all participants in this protocol have one anyway, and the Connections
     * objects have access to it, so they don't need to implement two interfaces.
     */
    readonly connectionPeer: IConnectionPeer;

    /**
     * Allow connections to the peer on the given port
     */
    allowTo(other: IConnectable, portRange: IPortRange, description: string): void;

    /**
     * Allow connections from the peer on the given port
     */
    allowFrom(other: IConnectable, portRange: IPortRange, description: string): void;
}

/**
 * Connections for an object that does not have default ports
 */
export class Connections implements IConnections {
    public readonly connectionPeer: IConnectionPeer;

    constructor(private readonly securityGroup: ISecurityGroup) {
        this.connectionPeer = this.securityGroup;
    }

    /**
     * Allow connections to the peer on their default port
     */
    public allowToDefaultPort(other: IDefaultConnectable, description: string) {
        this.allowTo(other, other.defaultPortRange, description);
    }

    /**
     * Allow connections to the peer on the given port
     */
    public allowTo(other: IConnectable, portRange: IPortRange, description: string) {
        this.securityGroup.addEgressRule(other.connections.connectionPeer, portRange, description);
        other.connections.allowFrom(
            new ConnectionsHolder(new SecurityGrouplessConnections(this.connectionPeer)),
            portRange,
            description);
    }

    /**
     * Allow connections from the peer on the given port
     */
    public allowFrom(other: IConnectable, portRange: IPortRange, description: string) {
        this.securityGroup.addIngressRule(other.connections.connectionPeer, portRange, description);
        other.connections.allowTo(
            new ConnectionsHolder(new SecurityGrouplessConnections(this.connectionPeer)),
            portRange,
            description);
    }

    /**
     * Allow hosts inside the security group to connect to each other on the given port
     */
    public allowInternally(portRange: IPortRange, description: string) {
        this.securityGroup.addIngressRule(this.securityGroup, portRange, description);
    }

    /**
     * Allow to all IPv4 ranges
     */
    public allowToAnyIpv4(portRange: IPortRange, description: string) {
        this.allowTo(new AnyIPv4(), portRange, description);
    }

    /**
     * Allow from any IPv4 ranges
     */
    public allowFromAnyIpv4(portRange: IPortRange, description: string) {
        this.allowFrom(new AnyIPv4(), portRange, description);
    }
}

/**
 * A class to orchestrate connections that already has default ports
 */
export class DefaultConnections extends Connections {
    public readonly defaultPortRange: IPortRange;

    constructor(securityGroup: ISecurityGroup, defaultPortRangeProvider: IDefaultConnectable) {
        // We take a IDefaultConnectable as an argument instead of the port
        // range directly so (a) we force the containing construct to implement
        // IDefaultConnectable and then (b) so they don't have to repeat the information.
        //
        // Slightly risky since this requires that the container initializes in the right order.
        super(securityGroup);
        this.defaultPortRange = defaultPortRangeProvider.defaultPortRange;

        if (this.defaultPortRange == null) {
            throw new Error("Ordering problem: create DefaultConnections() after initializing defaultPortRange");
        }
    }

    /**
     * Allow connections from the peer on our default port
     *
     * Even if the peer has a default port, we will always use our default port.
     */
    public allowDefaultPortFrom(other: IConnectable, description: string) {
        this.allowFrom(other, this.defaultPortRange, description);
    }

    /**
     * Allow hosts inside the security group to connect to each other
     */
    public allowDefaultPortInternally(description: string) {
        this.allowInternally(this.defaultPortRange, description);
    }

    /**
     * Allow default connections from all IPv4 ranges
     */
    public allowDefaultPortFromAnyIpv4(description: string) {
        this.allowFromAnyIpv4(this.defaultPortRange, description);
    }
}

/**
 * This object is used by peers who don't allow reverse connections
 *
 * It still has an associated connection peer, but that peer does not
 * have any security groups to add connections to.
 */
export class SecurityGrouplessConnections implements IConnections {
    constructor(public readonly connectionPeer: IConnectionPeer) {
    }

    public allowTo(_other: IConnectable, _connection: IPortRange, _description: string): void {
        // Nothing to do
    }

    public allowFrom(_other: IConnectable, _connection: IPortRange, _description: string): void {
        // Nothing to do
    }
}

/**
 * Class that implements IConnectable that can be constructed
 *
 * This is simply used to implement IConnectable when we need
 * to make reverse connections.
 */
class ConnectionsHolder implements IConnectable {
    constructor(public readonly connections: IConnections) {
    }
}
