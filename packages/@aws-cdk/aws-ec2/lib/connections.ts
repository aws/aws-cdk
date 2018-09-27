import { SecurityGroupRef } from "./security-group";
import { AnyIPv4, IPortRange, ISecurityGroupRule } from "./security-group-rule";

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
  securityGroupRule?: ISecurityGroupRule;

  /**
   * What securityGroup this object is managing connections for
   *
   * @default No security
   */
  securityGroup?: SecurityGroupRef;

  /**
   * Default port range for initiating connections to and from this object
   *
   * @default No default port range
   */
  defaultPortRange?: IPortRange;
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
 */
export class Connections {
  /**
   * Underlying securityGroup for this Connections object, if present
   *
   * May be empty if this Connections object is not managing a SecurityGroup,
   * but simply representing a Connectable peer.
   */
  public readonly securityGroup?: SecurityGroupRef;

  /**
   * The rule that defines how to represent this peer in a security group
   */
  public readonly securityGroupRule: ISecurityGroupRule;

  /**
   * The default port configured for this connection peer, if available
   */
  public readonly defaultPortRange?: IPortRange;

  constructor(props: ConnectionsProps) {
    if (!props.securityGroupRule && !props.securityGroup) {
      throw new Error('Connections: require one of securityGroupRule or securityGroup');
    }

    this.securityGroupRule = props.securityGroupRule || props.securityGroup!;
    this.securityGroup = props.securityGroup;
    this.defaultPortRange = props.defaultPortRange;
  }

  /**
   * Allow connections to the peer on the given port
   */
  public allowTo(other: IConnectable, portRange: IPortRange, description?: string) {
    if (this.securityGroup) {
      this.securityGroup.addEgressRule(other.connections.securityGroupRule, portRange, description);
    }
    if (other.connections.securityGroup) {
      other.connections.securityGroup.addIngressRule(this.securityGroupRule, portRange, description);

    }
  }

  /**
   * Allow connections from the peer on the given port
   */
  public allowFrom(other: IConnectable, portRange: IPortRange, description?: string) {
    if (this.securityGroup) {
      this.securityGroup.addIngressRule(other.connections.securityGroupRule, portRange, description);
    }
    if (other.connections.securityGroup) {
      other.connections.securityGroup.addEgressRule(this.securityGroupRule, portRange, description);
    }
  }

  /**
   * Allow hosts inside the security group to connect to each other on the given port
   */
  public allowInternally(portRange: IPortRange, description?: string) {
    if (this.securityGroup) {
      this.securityGroup.addIngressRule(this.securityGroupRule, portRange, description);
    }
  }

  /**
   * Allow to all IPv4 ranges
   */
  public allowToAnyIPv4(portRange: IPortRange, description?: string) {
    this.allowTo(new AnyIPv4(), portRange, description);
  }

  /**
   * Allow from any IPv4 ranges
   */
  public allowFromAnyIPv4(portRange: IPortRange, description?: string) {
    this.allowFrom(new AnyIPv4(), portRange, description);
  }

  /**
   * Allow connections from the peer on our default port
   *
   * Even if the peer has a default port, we will always use our default port.
   */
  public allowDefaultPortFrom(other: IConnectable, description?: string) {
    if (!this.defaultPortRange) {
      throw new Error('Cannot call allowDefaultPortFrom(): this resource has no default port');
    }
    this.allowFrom(other, this.defaultPortRange, description);
  }

  /**
   * Allow hosts inside the security group to connect to each other
   */
  public allowDefaultPortInternally(description?: string) {
    if (!this.defaultPortRange) {
      throw new Error('Cannot call allowDefaultPortInternally(): this resource has no default port');
    }
    this.allowInternally(this.defaultPortRange, description);
  }

  /**
   * Allow default connections from all IPv4 ranges
   */
  public allowDefaultPortFromAnyIpv4(description?: string) {
    if (!this.defaultPortRange) {
      throw new Error('Cannot call allowDefaultPortFromAnyIpv4(): this resource has no default port');
    }
    this.allowFromAnyIPv4(this.defaultPortRange, description);
  }

  /**
   * Allow connections to the security group on their default port
   */
  public allowToDefaultPort(other: IConnectable, description?: string) {
    if (other.connections.defaultPortRange === undefined) {
      throw new Error('Cannot call alloToDefaultPort(): other resource has no default port');
    }

    this.allowTo(other, other.connections.defaultPortRange, description);
  }

  /**
   * Allow connections from the peer on our default port
   *
   * Even if the peer has a default port, we will always use our default port.
   */
  public allowDefaultPortTo(other: IConnectable, description?: string) {
    if (!this.defaultPortRange) {
      throw new Error('Cannot call allowDefaultPortTo(): this resource has no default port');
    }
    this.allowTo(other, this.defaultPortRange, description);
  }
}
