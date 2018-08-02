import { AnyIPv4, IConnectionPeer, IPortRange } from "./connection";
import { SecurityGroupId } from "./ec2.generated";
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
 */

/**
 * An object that has a Connections object
 */
export interface IConnectable {
    readonly connections: Connections;
}

/**
 * An object that has a Connections object as well as a default port range.
 */
export interface IDefaultConnectable extends IConnectable {
    readonly defaultPortRange: IPortRange;
}

/**
 * Manage the security group (firewall) for a connectable resource.
 *
 * This object contains method to allow connections between objects
 * that can allow connections.
 *
 * The .allowDefaultPortXxx() methods are only available if the resource
 * this object was created for has the concept of a default port range.
 */
export class Connections {
    public readonly connectionPeer: IConnectionPeer;

    constructor(private readonly securityGroup: ISecurityGroup, private readonly defaultPortRange?: IPortRange) {
        this.connectionPeer = securityGroup;
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
        if (this.securityGroup) {
            this.securityGroup.addEgressRule(other.connections.connectionPeer, portRange, description);
        }
        other.connections.allowFrom(
            new NullConnectable(this.connectionPeer),
            portRange,
            description);
    }

    /**
     * Allow connections from the peer on the given port
     */
    public allowFrom(other: IConnectable, portRange: IPortRange, description: string) {
        if (this.securityGroup) {
            this.securityGroup.addIngressRule(other.connections.connectionPeer, portRange, description);
        }
        other.connections.allowTo(
            new NullConnectable(this.connectionPeer),
            portRange,
            description);
    }

    /**
     * Allow hosts inside the security group to connect to each other on the given port
     */
    public allowInternally(portRange: IPortRange, description: string) {
        if (this.securityGroup) {
            this.securityGroup.addIngressRule(this.securityGroup, portRange, description);
        }
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

    /**
     * Allow connections from the peer on our default port
     *
     * Even if the peer has a default port, we will always use our default port.
     */
    public allowDefaultPortFrom(other: IConnectable, description: string) {
        if (!this.defaultPortRange) {
            throw new Error('Cannot call allowDefaultPortFrom(): resource has no default port');
        }
        this.allowFrom(other, this.defaultPortRange, description);
    }

    /**
     * Allow hosts inside the security group to connect to each other
     */
    public allowDefaultPortInternally(description: string) {
        if (!this.defaultPortRange) {
            throw new Error('Cannot call allowDefaultPortInternally(): resource has no default port');
        }
        this.allowInternally(this.defaultPortRange, description);
    }

    /**
     * Allow default connections from all IPv4 ranges
     */
    public allowDefaultPortFromAnyIpv4(description: string) {
        if (!this.defaultPortRange) {
            throw new Error('Cannot call allowDefaultPortFromAnyIpv4(): resource has no default port');
        }
        this.allowFromAnyIpv4(this.defaultPortRange, description);
    }
}

/**
 * Connectable that represents a peer but doesn't modify any security groups
 */
class NullConnectable implements IConnectable {
    public readonly connections: Connections;

    constructor(connectionPeer: IConnectionPeer) {
        this.connections = new SecurityGrouplessConnections(connectionPeer);
    }
}

/**
 * This object is used by peers who don't allow reverse connections.
 */
export class SecurityGrouplessConnections extends Connections {
    constructor(public readonly connectionPeer: IConnectionPeer) {
        // Because Connections is no longer an interface but a concrete class,
        // we must inherit from it and create it with an instance of ISecurityGroup.
        super(new NullSecurityGroup());
    }

    public allowTo(_other: IConnectable, _connection: IPortRange, _description: string): void {
        // Nothing to do
    }

    public allowFrom(_other: IConnectable, _connection: IPortRange, _description: string): void {
        // Nothing to do
    }
}

/**
 * Instance of ISecurityGroup that's only there for show.
 */
class NullSecurityGroup implements ISecurityGroup {
    public securityGroupId: SecurityGroupId = new SecurityGroupId();
    public canInlineRule: boolean = false;

    public addIngressRule(_peer: IConnectionPeer, _connection: IPortRange, _description: string): void {
        // Nothing
    }

    public addEgressRule(_peer: IConnectionPeer, _connection: IPortRange, _description: string): void {
        // Nothing
    }

    public toIngressRuleJSON() {
        return {};
    }

    public toEgressRuleJSON() {
        return {};
    }
}