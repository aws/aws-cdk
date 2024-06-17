/* eslint-disable @typescript-eslint/member-ordering */
// /* eslint-disable @typescript-eslint/member-ordering */
import { Resource, Names } from 'aws-cdk-lib';
import { CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, INetworkAcl, IRouteTable, ISubnet, NetworkAcl, SubnetNetworkAclAssociation, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct, DependencyGroup, IDependable } from 'constructs';
import { IVpcV2 } from './vpc-v2-base';

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
  constructor(props: string ) {
    this.cidr = props;
  }
}

export interface SubnetPropsV2 {
/**
 * VPC Prop
 */
  vpc: IVpcV2;

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

  /**
   * A tag applied to the subnet for grouping purposes.
   *
   * This grouping allows users to do things such as
   * find all subnets with subnetGroupNameTag `subnetGroupA` for example.
   */
  subnetGroupNameTag?: string;

  /**
   * The type of Subnet to configure.
   *
   * The Subnet type will control the ability to route and connect to the
   * Internet.
   */
  subnetType: SubnetType;

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
   */
  public subnetType: SubnetType;

  /**
   *
   * @param scope
   * @param id
   * @param props
   */
  private _networkAcl: INetworkAcl;

  constructor(scope: Construct, id: string, props: SubnetPropsV2) {
    super(scope, id);

    let ipv4CidrBlock: string = '';
    let ipv6CidrBlock: string = '';
    if (props.cidrBlock instanceof Ipv4Cidr) {
      ipv4CidrBlock = props.cidrBlock.cidr;
    } else if (props.cidrBlock instanceof Ipv6Cidr) {
      if (validateSupportIpv6(props.vpc)) {
        ipv6CidrBlock = props.cidrBlock.cidr;
      }
    }
    const subnet = new CfnSubnet(this, 'Subnet', {
      vpcId: props.vpc.vpcId,
      cidrBlock: ipv4CidrBlock,
      ipv6CidrBlock: ipv6CidrBlock,
      availabilityZone: props.availabilityZone,
    });

    this.ipv4CidrBlock = subnet.attrCidrBlock;
    this.ipv6CidrBlock = subnet.attrIpv6CidrBlocks;
    this.subnetId = subnet.ref;
    this.availabilityZone = props.availabilityZone;

    this._networkAcl = NetworkAcl.fromNetworkAclId(this, 'Acl', subnet.attrNetworkAclAssociationId);

    /**
     * seems to be the main default one
     */
    if (props.routeTable) {
      this.routeTable = props.routeTable;
    } else {
      const defaultTable = new CfnRouteTable(this, 'RouteTable', {
        vpcId: props.vpc.vpcId,
      });
      this.routeTable = { routeTableId: defaultTable.ref };
    }

    const routeAssoc = new CfnSubnetRouteTableAssociation(this, 'RouteTableAssociation', {
      subnetId: this.subnetId,
      routeTableId: this.routeTable.routeTableId,
    });
    this._internetConnectivityEstablished.add(routeAssoc);
    this.internetConnectivityEstablished = this._internetConnectivityEstablished;

    this.subnetType = props.subnetType;
    storeSubnetToVpcByType(props.vpc, this, props.subnetType);
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

function storeSubnetToVpcByType(vpc: IVpcV2, subnet: SubnetV2, type: SubnetType) {
  const findFunctionType = subnetTypeMap[type];
  if (findFunctionType) {
    findFunctionType(vpc, subnet);
  } else {
    throw new Error(`Unsupported subnet type: ${type}`);
  }
}

const subnetTypeMap = {
  [SubnetType.PRIVATE_ISOLATED]: (vpc: IVpcV2, subnet: SubnetV2) => vpc.isolatedSubnets.push(subnet),
  [SubnetType.PUBLIC]: (vpc: IVpcV2, subnet: SubnetV2) => vpc.publicSubnets.push(subnet),
  [SubnetType.PRIVATE_WITH_EGRESS]: (vpc: IVpcV2, subnet: SubnetV2) => vpc.privateSubnets.push(subnet),
  [SubnetType.ISOLATED]: (vpc: IVpcV2, subnet: SubnetV2) => vpc.isolatedSubnets.push(subnet),
  [SubnetType.PRIVATE]: (vpc: IVpcV2, subnet: SubnetV2) => vpc.privateSubnets.push(subnet),
  [SubnetType.PRIVATE_WITH_NAT]: (vpc: IVpcV2, subnet: SubnetV2) => vpc.privateSubnets.push(subnet),
};

/**
 * currently checking for amazon provided Ipv6 only which we plan to release
 */

function validateSupportIpv6(vpc: IVpcV2) {
  if (vpc.secondaryCidrBlock.some((secondaryAddress) => secondaryAddress.amazonProvidedIpv6CidrBlock === true)) {
    return true;
  } else {
    throw new Error('To use IPv6, the VPC must enable IPv6 support.');
  }
}