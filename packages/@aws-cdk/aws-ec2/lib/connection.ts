import { Token } from "@aws-cdk/cdk";
import { Connections, IConnectable, SecurityGrouplessConnections } from "./connections";

/**
 * Interface for classes that provide the peer-specification parts of a security group rule
 */
export interface IConnectionPeer {
    /**
     * Whether the rule can be inlined into a SecurityGroup or not
     */
    readonly canInlineRule: boolean;

    /**
     * Produce the ingress rule JSON for the given connection
     */
    toIngressRuleJSON(): any;

    /**
     * Produce the egress rule JSON for the given connection
     */
    toEgressRuleJSON(): any;
}

/**
 * A connection to and from a given IP range
 */
export class CidrIp implements IConnectionPeer, IConnectable {
    public readonly canInlineRule = true;
    public readonly connections: Connections;

    constructor(private readonly cidrIp: string) {
        this.connections = new SecurityGrouplessConnections(this);
    }

    /**
     * Produce the ingress rule JSON for the given connection
     */
    public toIngressRuleJSON(): any {
        return { cidrIp: this.cidrIp };
    }
    /**
     * Produce the egress rule JSON for the given connection
     */
    public toEgressRuleJSON(): any {
        return { cidrIp: this.cidrIp };
    }
}

/**
 * Any IPv4 address
 */
export class AnyIPv4 extends CidrIp {
    constructor() {
        super("0.0.0.0/0");
    }
}

/**
 * A connection to a from a given IPv6 range
 */
export class CidrIpv6 implements IConnectionPeer, IConnectable {
    public readonly canInlineRule = true;
    public readonly connections: Connections;

    constructor(private readonly cidrIpv6: string) {
        this.connections = new SecurityGrouplessConnections(this);
    }

    /**
     * Produce the ingress rule JSON for the given connection
     */
    public toIngressRuleJSON(): any {
        return { cidrIpv6: this.cidrIpv6 };
    }
    /**
     * Produce the egress rule JSON for the given connection
     */
    public toEgressRuleJSON(): any {
        return { cidrIpv6: this.cidrIpv6 };
    }
}

/**
 * Any IPv6 address
 */
export class AnyIPv6 extends CidrIpv6 {
    constructor() {
        super("::0/0");
    }
}

/**
 * A prefix list
 *
 * Prefix lists are used to allow traffic to VPC-local service endpoints.
 *
 * For more information, see this page:
 *
 * https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-endpoints.html
 */
export class PrefixList implements IConnectionPeer, IConnectable {
    public readonly canInlineRule = true;
    public readonly connections: Connections;

    constructor(private readonly prefixListId: string) {
        this.connections = new SecurityGrouplessConnections(this);
    }

    public toIngressRuleJSON(): any {
        throw new Error('Prefix lists can only be used for egress rules');
    }

    public toEgressRuleJSON(): any {
        return { destinationPrefixListId: this.prefixListId };
    }
}

/**
 * Interface for classes that provide the connection-specification parts of a security group rule
 */
export interface IPortRange {
    readonly canInlineRule: boolean;

    /**
     * Produce the ingress/egress rule JSON for the given connection
     */
    toRuleJSON(): any;
}

/**
 * Protocol for use in Connection Rules
 */
export enum Protocol {
    All = '-1',
    Tcp = 'tcp',
    Udp = 'udp',
    Icmp = 'icmp',
    Icmpv6 = '58',
}

/**
 * A single TCP port
 */
export class TcpPort implements IPortRange {
    public readonly canInlineRule = true;

    constructor(private readonly port: number) {
    }

    public toRuleJSON(): any {
        return {
            ipProtocol: Protocol.Tcp,
            fromPort: this.port,
            toPort: this.port
        };
    }
}

/**
 * A single TCP port that is provided by a resource attribute
 */
export class TcpPortFromAttribute implements IPortRange {
    public readonly canInlineRule = false;

    constructor(private readonly port: Token) {
    }

    public toRuleJSON(): any {
        return {
            ipProtocol: Protocol.Tcp,
            fromPort: this.port,
            toPort: this.port
        };
    }
}

/**
 * A TCP port range
 */
export class TcpPortRange implements IPortRange {
    public readonly canInlineRule = true;

    constructor(private readonly startPort: number, private readonly endPort: number) {
    }

    public toRuleJSON(): any {
        return {
            ipProtocol: Protocol.Tcp,
            fromPort: this.startPort,
            toPort: this.endPort
        };
    }
}

/**
 * All TCP Ports
 */
export class TcpAllPorts implements IPortRange {
    public readonly canInlineRule = true;

    public toRuleJSON(): any {
        return {
            ipProtocol: Protocol.Tcp,
            fromPort: 0,
            toPort: 65535
        };
    }
}

/**
 * All TCP Ports
 */
export class AllConnections implements IPortRange {
    public readonly canInlineRule = true;

    public toRuleJSON(): any {
        return {
            ipProtocol: '-1',
            fromPort: -1,
            toPort: -1,
        };
    }
}
