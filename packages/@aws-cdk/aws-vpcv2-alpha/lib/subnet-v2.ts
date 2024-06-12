/* eslint-disable @typescript-eslint/member-ordering */
// /* eslint-disable @typescript-eslint/member-ordering */
import { Resource, Names } from 'aws-cdk-lib';
import { CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, INetworkAcl, IRouteTable, ISubnet, IVpc, NetworkAcl, SubnetNetworkAclAssociation } from 'aws-cdk-lib/aws-ec2';
import { Construct, DependencyGroup, IDependable } from 'constructs';

export interface ICidr {
  readonly cidr: string;
}

export interface cidrBlockProps {
  readonly cidrBlock: string;
}

export class Ipv4Cidr implements ICidr {

  public readonly cidr: string;
  constructor(props: string ) {
    this.cidr = props;
  }
}

export class Ipv6Cidr implements ICidr {

  public readonly cidr: string;
  constructor(props: cidrBlockProps ) {
    this.cidr = props.cidrBlock;
  }
}

export interface SubnetPropsV2 {
/**
 * VPC Prop
 */
  vpc: IVpc;

  /**
   * custom CIDR range
   * TODO: modify to Ipv4cidr class
   */
  cidrBlock: ICidr;

  /**
   * Custom AZ
   */
  availabilityZone: string;

  /**
   * Custom Route for subnet
   */
  routeTable?: IRouteTable;

}

export class SubnetV2 extends Resource implements ISubnet {

  /**
   * The Availability Zone the subnet is located in
   */
  public readonly availabilityZone: string;

  /**
   * The subnetId for this particular subnet
   * @attribute
   */
  public readonly subnetId: string;

  /**
   * Dependable that can be depended upon to force internet connectivity established on the VPC
   */
  public readonly internetConnectivityEstablished: IDependable;

  private readonly _internetConnectivityEstablished = new DependencyGroup();

  /**
   * The IPv4 CIDR block for this subnet
   */
  public readonly ipv4CidrBlock: string;

  /**
   * The IPv6 CIDR Block for this subnet
   */
  public readonly ipv6CidrBlock: string[];

  /**
   * The route table for this subnet
   */
  public readonly routeTable: IRouteTable;

  /**
   *
   * @param scope
   * @param id
   * @param props
   */
  private _networkAcl: INetworkAcl;

  /**
   * Isolated subnet or not
   * @default true
   */
  private isIsolated?: Boolean;

  constructor(scope: Construct, id: string, props: SubnetPropsV2) {
    super(scope, id);

    let ipv4cidr: string = '';
    //let ipv6cidr: string = '';
    if (props.cidrBlock instanceof Ipv4Cidr) {
      ipv4cidr = props.cidrBlock.cidr;
    }
    // } else if (props.cidrBlock instanceof Ipv6Cidr) {
    //   ipv6cidr = props.cidrBlock.cidr;
    // }
    const subnet = new CfnSubnet(this, 'Subnet', {
      vpcId: props.vpc.vpcId,
      cidrBlock: ipv4cidr,
      //ipv6CidrBlock: ipv6cidr,
      availabilityZone: props.availabilityZone,
    });

    this.ipv4CidrBlock = subnet.attrCidrBlock;
    this.ipv6CidrBlock = subnet.attrIpv6CidrBlocks;
    this.subnetId = subnet.ref;
    const table = new CfnRouteTable(this, 'RouteTable', {
      vpcId: props.vpc.vpcId,
    });
    this.routeTable = { routeTableId: table.ref };
    this.availabilityZone = props.availabilityZone;

    this._networkAcl = NetworkAcl.fromNetworkAclId(this, 'Acl', subnet.attrNetworkAclAssociationId);

    const routeAssoc = new CfnSubnetRouteTableAssociation(this, 'RouteTableAssociation', {
      subnetId: this.subnetId,
      routeTableId: table.ref,
    });
    this._internetConnectivityEstablished.add(routeAssoc);

    this.internetConnectivityEstablished = this._internetConnectivityEstablished;

    if (props.routeTable) {
      this.isIsolated = false;
      new CfnSubnetRouteTableAssociation(this, 'CustomRouteTableAssociation', {
        subnetId: this.subnetId,
        routeTableId: props.routeTable.routeTableId,
      });
    }

    if (!this.isIsolated) {
      pushIsolatedSubnet(props.vpc, this);
    } //isolated by default
  }
  /**
   * Associate a Network ACL with this subnet
   *
   * @param acl The Network ACL to associate
   */
  public associateNetworkAcl(id: string, networkAcl: INetworkAcl) {
    this._networkAcl = networkAcl;

    const scope = networkAcl instanceof Construct ? networkAcl : this;
    const other = networkAcl instanceof Construct ? this : networkAcl;
    new SubnetNetworkAclAssociation(scope, id + Names.nodeUniqueId(other.node), {
      networkAcl,
      subnet: this,
    });
  }

  public get networkAcl(): INetworkAcl {
    return this._networkAcl;
  }

}

function pushIsolatedSubnet(vpc: IVpc, subnet: SubnetV2) {
  vpc.isolatedSubnets.push(subnet);
}