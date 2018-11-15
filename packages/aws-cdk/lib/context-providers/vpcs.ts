import cxapi = require('@aws-cdk/cx-api');
import AWS = require('aws-sdk');
import { Mode, SDK } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

export class VpcNetworkContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: SDK) {
  }

  public async getValue(args: cxapi.VpcContextQuery) {
    const account: string = args.account!;
    const region: string = args.region!;

    const ec2 = await this.aws.ec2(account, region, Mode.ForReading);

    const vpcId = await this.findVpc(ec2, args);

    return await this.readVpcProps(ec2, vpcId);
  }

  private async findVpc(ec2: AWS.EC2, args: cxapi.VpcContextQuery): Promise<string> {
    // Build request filter (map { Name -> Value } to list of [{ Name, Values }])
    const filters: AWS.EC2.Filter[] = Object.entries(args.filter).map(x => ({ Name: x[0], Values: [x[1]] }));

    debug(`Listing VPCs in ${args.account}:${args.region}`);
    const response = await ec2.describeVpcs({ Filters: filters }).promise();

    const vpcs = response.Vpcs || [];
    if (vpcs.length === 0) {
      throw new Error(`Could not find any VPCs matching ${JSON.stringify(args)}`);
    }
    if (vpcs.length > 1) {
      throw new Error(`Found ${vpcs.length} VPCs matching ${JSON.stringify(args)}; please narrow the search criteria`);
    }

    return vpcs[0].VpcId!;
  }

  private async readVpcProps(ec2: AWS.EC2, vpcId: string): Promise<cxapi.VpcContextResponse> {
    debug(`Describing VPC ${vpcId}`);

    const response = await ec2.describeSubnets({ Filters: [{ Name: 'vpc-id', Values: [vpcId] }] }).promise();
    const listedSubnets = response.Subnets || [];

    // Now comes our job to separate these subnets out into AZs and subnet groups (Public, Private, Isolated)
    // We have the following attributes to go on:
    // - Type tag, we tag subnets with their type. In absence of this tag, we
    //   fall back to MapPublicIpOnLaunch => must be a Public subnet, anything
    //   else is considered Priate.
    // - Name tag, we tag subnets with their subnet group name. In absence of this tag,
    //   we use the type as the name.

    const azs = Array.from(new Set<string>(listedSubnets.map(s => s.AvailabilityZone!)));
    azs.sort();

    const subnets: Subnet[] = listedSubnets.map(subnet => {
      let type = getTag('aws-cdk:subnet-type', subnet.Tags);
      if (type === undefined) {
        type = subnet.MapPublicIpOnLaunch ? 'Public' : 'Private';
      }

      const name = getTag('aws-cdk:subnet-name', subnet.Tags) || type;

      return { az: subnet.AvailabilityZone!, type: type as SubnetType, name, subnetId: subnet.SubnetId! };
    });

    const grouped = groupSubnets(subnets);

    return {
      vpcId,
      availabilityZones: grouped.azs,
      isolatedSubnetIds: collapse(flatMap(findGroups(SubnetType.Isolated, grouped), group => group.subnets.map(s => s.subnetId))),
      isolatedSubnetNames: collapse(flatMap(findGroups(SubnetType.Isolated, grouped), group => group.name ? [group.name] : [])),
      privateSubnetIds: collapse(flatMap(findGroups(SubnetType.Private, grouped), group => group.subnets.map(s => s.subnetId))),
      privateSubnetNames: collapse(flatMap(findGroups(SubnetType.Private, grouped), group => group.name ? [group.name] : [])),
      publicSubnetIds: collapse(flatMap(findGroups(SubnetType.Public, grouped), group => group.subnets.map(s => s.subnetId))),
      publicSubnetNames: collapse(flatMap(findGroups(SubnetType.Public, grouped), group => group.name ? [group.name] : [])),
    };
  }
}

/**
 * Return the value of a tag from a set of tags
 */
function getTag(name: string, tags?: AWS.EC2.Tag[]): string | undefined {
  for (const tag of tags || []) {
    if (tag.Key === name) {
      return tag.Value;
    }
  }
  return undefined;
}

/**
 * Group subnets of the same type together, and order by AZ
 */
function groupSubnets(subnets: Subnet[]): SubnetGroups {
  const grouping: {[key: string]: Subnet[]} = {};
  for (const subnet of subnets) {
    const key = [subnet.type, subnet.name].toString();
    if (!(key in grouping)) { grouping[key] = []; }
    grouping[key].push(subnet);
  }

  const groups = Object.values(grouping).map(sns => {
    sns.sort((a: Subnet, b: Subnet) => a.az.localeCompare(b.az));
    return {
      type: sns[0].type,
      name: sns[0].name,
      subnets: sns,
    };
  });

  const azs = groups[0].subnets.map(s => s.az);

  for (const group of groups) {
    const groupAZs = group.subnets.map(s => s.az);
    if (!arraysEqual(groupAZs, azs)) {
      throw new Error(`Not all subnets in VPC have the same AZs: ${groupAZs} vs ${azs}`);
    }
  }

  return { azs, groups };
}

enum SubnetType {
  Public = 'Public',
  Private = 'Private',
  Isolated = 'Isolated'
}

interface Subnet {
  az: string;
  type: SubnetType;
  name?: string;
  subnetId: string;
}

interface SubnetGroup {
  type: SubnetType;
  name?: string;
  subnets: Subnet[];
}

interface SubnetGroups {
  azs: string[];
  groups: SubnetGroup[];
}

function arraysEqual(as: string[], bs: string[]): boolean {
  if (as.length !== bs.length) { return false; }

  for (let i = 0; i < as.length; i++) {
    if (as[i] !== bs[i]) {
      return false;
    }
  }

  return true;
}

function findGroups(type: SubnetType, groups: SubnetGroups): SubnetGroup[] {
  return groups.groups.filter(g => g.type === type);
}

function flatMap<T, U>(xs: T[], fn: (x: T) => U[]): U[] {
  const ret = new Array<U>();
  for (const x of xs) {
    ret.push(...fn(x));
  }
  return ret;
}

function collapse<T>(xs: T[]): T[] | undefined {
  if (xs.length > 0) { return xs; }
  return undefined;

}
