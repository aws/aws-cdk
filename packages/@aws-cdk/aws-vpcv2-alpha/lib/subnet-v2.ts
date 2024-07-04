/* eslint-disable @typescript-eslint/member-ordering */
// /* eslint-disable @typescript-eslint/member-ordering */
import { Resource, Names } from 'aws-cdk-lib';
import { CfnRouteTable, CfnSubnet, CfnSubnetRouteTableAssociation, INetworkAcl, IRouteTable, ISubnet, NetworkAcl, SubnetNetworkAclAssociation, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct, DependencyGroup, IDependable } from 'constructs';
import { IVpcV2 } from './vpc-v2-base';
import { CidrBlock, CidrBlockIpv6 } from './util';

export interface ICidr {
  readonly cidr: string;
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
  readonly vpc: IVpcV2;

  /**
   * ipv4 cidr to assign to this subnet.
   * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html#cfn-ec2-subnet-cidrblock
   */
  readonly cidrBlock: Ipv4Cidr;

  /**
   * Ipv6 CIDR Range for subnet
   */
  readonly ipv6CidrBlock?: Ipv6Cidr;

  /**
   * Custom AZ
   */
  readonly availabilityZone: string;

  /**
   * Custom Route for subnet
   */
  readonly routeTable?: IRouteTable;

  /**
   * The type of Subnet to configure.
   *
   * The Subnet type will control the ability to route and connect to the
   * Internet.
   *
   * TODO: Add validation check `subnetType` when adding resources (e.g. cannot add NatGateway to private)
   */
  readonly subnetType: SubnetType;

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
   * The variable name `internetConnectivityEstablished` does not reflect what it actually is.
   * The naming is enforced by ISubnet. We need to keep it to maintain compatibility.
   * It exposes the RouteTable-Subnet association so that other resources can depend on it.
   * E.g. Resources in a subnet, when being deleted, may need the RouteTable to exist in order to delete properly
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
  public readonly ipv6CidrBlock?: string;

  /**
   * The route table for this subnet
   */
  public readonly routeTable: IRouteTable;

  /**
   *
   */
  public readonly subnetType: SubnetType;

  /**
   *
   * @param scope
   * @param id
   * @param props
   */
  private _networkAcl: INetworkAcl;

  constructor(scope: Construct, id: string, props: SubnetPropsV2) {
    super(scope, id);

    const ipv4CidrBlock = props.cidrBlock.cidr;
    const ipv6CidrBlock = props.ipv6CidrBlock?.cidr;

    if (!checkCidrRanges(props.vpc, props.cidrBlock.cidr)) {
    if (!checkCidrRanges(props.vpc, props.cidrBlock.cidr)) {
      throw new Error('CIDR block should be in the same VPC');
    };

    let overlap: boolean = false;
    let overlapIpv6: boolean = false;
    try {
      overlap = validateOverlappingCidrRanges(props.vpc, props.cidrBlock.cidr);
    } catch (e) {
      'No Subnets in VPC';
    }

    //check whether VPC supports ipv6
    if (props.ipv6CidrBlock?.cidr) {
      validateSupportIpv6(props.vpc);
      try {
        overlapIpv6 = validateOverlappingCidrRangesipv6(props.vpc, props.ipv6CidrBlock?.cidr);
      } catch (e) {
        console.log('No subnets in VPC');
      }
    }

    if (overlap || overlapIpv6) {
      throw new Error('CIDR block should not overlap with existing subnet blocks');
    }

    const subnet = new CfnSubnet(this, 'Subnet', {
      vpcId: props.vpc.vpcId,
      cidrBlock: ipv4CidrBlock,
      ipv6CidrBlock: ipv6CidrBlock,
      availabilityZone: props.availabilityZone,
    });

    this.ipv4CidrBlock = props.cidrBlock.cidr;
    this.ipv6CidrBlock = props.ipv6CidrBlock?.cidr;
    this.subnetId = subnet.ref;
    this.availabilityZone = props.availabilityZone;

    this._networkAcl = NetworkAcl.fromNetworkAclId(this, 'Acl', subnet.attrNetworkAclAssociationId);

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
   * @param networkAcl The Network ACL to associate
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

  /**
   * Need to set explicit dependency as during stack deletion,
   * the cidr blocks may get deleted first and will fail as the subnets are still using the cidr blocks
   */
  for (const cidr of vpc.secondaryCidrBlock) {
    subnet.node.addDependency(cidr);
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
  if (vpc.secondaryCidrBlock.some((secondaryAddress) => secondaryAddress.amazonProvidedIpv6CidrBlock === true ||
  secondaryAddress.ipv6IpamPoolId != undefined)) {
    return true;
  } else {
    throw new Error('To use IPv6, the VPC must enable IPv6 support.');
  }
}

function checkCidrRanges(vpc: IVpcV2, cidrRange: string) {

  const vpcCidrBlock = [vpc.ipv4CidrBlock];

  for (const cidrs of vpc.secondaryCidrBlock) {
    if (cidrs.cidrBlock) {
      vpcCidrBlock.push(cidrs.cidrBlock);
    if (cidrs.cidrBlock) {
      vpcCidrBlock.push(cidrs.cidrBlock);
    }
  }

  const cidrs = vpcCidrBlock.map(cidr => new CidrBlock(cidr));

  const subnetCidrBlock = new CidrBlock(cidrRange);


  return cidrs.some(vpcCidrBlock => vpcCidrBlock.containsCidr(subnetCidrBlock));

}

function validateOverlappingCidrRanges(vpc: IVpcV2, ipv4CidrBlock: string): boolean {

  let allSubnets: ISubnet[] = vpc.selectSubnets().subnets;

  const ipMap: [string, string][] = new Array();

  const inputRange = new CidrBlock(ipv4CidrBlock);

  const inputIpMap: [string, string] = [inputRange.minIp(), inputRange.maxIp()];

  for (const subnet of allSubnets) {
  for (const subnet of allSubnets) {
    const cidrBlock = new CidrBlock(subnet.ipv4CidrBlock);
    ipMap.push([cidrBlock.minIp(), cidrBlock.maxIp()]);
  }

  for (const range of ipMap) {
  for (const range of ipMap) {
    if (inputRange.rangesOverlap(range, inputIpMap)) {
      return true;
    }
  }

  return false;
}

function validateOverlappingCidrRangesipv6(vpc: IVpcV2, ipv6CidrBlock: string): boolean {

  let allSubnets: ISubnet[] = vpc.selectSubnets().subnets;

  const ipv6Map: string[]= [];

  const inputRange = new CidrBlockIpv6(ipv6CidrBlock);

  let result : boolean = false;

  for (const subnet of allSubnets) {
    if(subnet.ipv6CidrBlock){
    console.log(subnet.ipv6CidrBlock);
    const cidrBlock = new CidrBlockIpv6(subnet.ipv6CidrBlock);
    ipv6Map.push(cidrBlock.cidr);
    }
  }

  for (const range of ipv6Map) {
    console.log(range, inputRange);
    if (inputRange.rangesOverlap(range, inputRange.cidr)) {
      console.log('overlaps');
      result = true;
    }
  }

  return result;
}

