import { ISubnet } from './vpc';

/**
 * Contains logic which chooses a set of subnets from a larger list, in conjunction
 * with SubnetSelection, to determine where to place AWS resources such as VPC
 * endpoints, EC2 instances, etc.
 */
export interface ISubnetSelector {

  /**
   * Executes the subnet filtering logic, returning a filtered set of subnets.
   */
  selectSubnets(subnets: ISubnet[]): ISubnet[];
}

/**
 * Chooses subnets which are in one of the given availability zones.
 */
export class AvailabilityZoneSubnetSelector implements ISubnetSelector {

  private readonly availabilityZones: string[];

  constructor(availabilityZones: string[]) {
    this.availabilityZones = availabilityZones;
  }

  /**
   * Executes the subnet filtering logic.
   */
  public selectSubnets(subnets: ISubnet[]): ISubnet[] {
    return subnets.filter(s => this.availabilityZones.includes(s.availabilityZone));
  }
}

/**
 * Chooses subnets such that there is at most one per availability zone.
 */
export class OnePerAZSubnetSelector implements ISubnetSelector {

  constructor() {}

  /**
   * Executes the subnet filtering logic.
   */
  public selectSubnets(subnets: ISubnet[]): ISubnet[] {
    return this.retainOnePerAz(subnets);
  }

  private retainOnePerAz(subnets: ISubnet[]): ISubnet[] {
    const azsSeen = new Set<string>();
    return subnets.filter(subnet => {
      if (azsSeen.has(subnet.availabilityZone)) { return false; }
      azsSeen.add(subnet.availabilityZone);
      return true;
    });
  }
}
