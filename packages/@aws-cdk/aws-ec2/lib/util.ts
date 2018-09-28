import cdk = require('@aws-cdk/cdk');
import { SubnetType, VpcSubnetRef } from "./vpc-ref";

/**
 * Turn an arbitrary string into one that can be used as a CloudFormation identifier by stripping special characters
 *
 * (At the moment, no efforts are taken to prevent collissions, but we can add that later when it becomes necessary).
 */
export function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * The default names for every subnet type
 */
export const DEFAULT_SUBNET_NAME = {
  [SubnetType.Public]: 'Public',
  [SubnetType.Private]: 'Private',
  [SubnetType.Isolated]: 'Isolated',
};

/**
 * Return a subnet name from its construct ID
 *
 * All subnet names look like NAME <> "Subnet" <> INDEX
 */
export function subnetName(subnet: VpcSubnetRef) {
  return subnet.id.replace(/Subnet\d+$/, '');
}

/**
 * Make the subnet construct ID from a name and number
 */
export function subnetId(name: string, i: number) {
  return `${name}Subnet${i + 1}`;
}

/**
 * Helper class to export/import groups of subnets
 */
export class ExportSubnetGroup {
  public readonly ids?: string[];
  public readonly names?: string[];

  private readonly groups: number;

  constructor(
      parent: cdk.Construct,
      exportName: string,
      private readonly subnets: VpcSubnetRef[],
      private readonly type: SubnetType,
      private readonly azs: number) {

    this.groups = subnets.length / azs;

    // ASSERTION
    if (Math.floor(this.groups) !== this.groups) {
      throw new Error(`Number of subnets (${subnets.length}) must be a multiple of number of availability zones (${azs})`);
    }

    this.ids = this.exportIds(parent, exportName);
    this.names = this.exportNames();
  }

  private exportIds(parent: cdk.Construct, name: string): string[] | undefined {
    if (this.subnets.length === 0) { return undefined; }
    return new cdk.StringListOutput(parent, name, { values: this.subnets.map(s => s.subnetId) }).makeImportValues().map(x => x.toString());
  }

  /**
   * Return the list of subnet names if they're not equal to the default
   */
  private exportNames(): string[] | undefined {
    if (this.subnets.length === 0) { return undefined; }
    const netNames = this.subnets.map(subnetName);

    // Do some assertion that the 'netNames' array is laid out like this:
    //
    // [ INGRESS, INGRESS, INGRESS, EGRESS, EGRESS, EGRESS, ... ]
    for (let i = 0; i < netNames.length; i++) {
      const k = Math.floor(i / this.azs);
      if (netNames[i] !== netNames[k * this.azs]) {
        throw new Error(`Subnets must be grouped by name, got: ${JSON.stringify(netNames)}`);
      }
    }

    // Splat down to [ INGRESS, EGRESS, ... ]
    const groupNames = range(this.groups).map(i => netNames[i * this.azs]);
    if (groupNames.length === 1 && groupNames[0] === DEFAULT_SUBNET_NAME[this.type]) { return undefined; }

    return groupNames;
  }
}

export class ImportSubnetGroup {
  private readonly subnetIds: string[];
  private readonly names: string[];
  private readonly groups: number;

  constructor(
      subnetIds: string[] | undefined,
      names: string[] | undefined,
      type: SubnetType,
      private readonly availabilityZones: string[],
      idField: string,
      nameField: string) {

    this.subnetIds = subnetIds || [];
    this.groups = this.subnetIds.length / this.availabilityZones.length;

    if (Math.floor(this.groups) !== this.groups) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Amount of ${idField} (${this.subnetIds.length}) must be a multiple of availability zones (${this.availabilityZones.length}).`);
    }

    this.names = this.normalizeNames(names, DEFAULT_SUBNET_NAME[type], nameField);
  }

  public import(parent: cdk.Construct): VpcSubnetRef[] {
    return range(this.subnetIds.length).map(i => {
      const k = Math.floor(i / this.availabilityZones.length);
      return VpcSubnetRef.import(parent, subnetId(this.names[k], i), {
        availabilityZone: this.pickAZ(i),
        subnetId: this.subnetIds[i]
      });
    });
  }

  /**
   * Return a list with a name for every subnet
   */
  private normalizeNames(names: string[] | undefined, defaultName: string, fieldName: string) {
    // If not given, return default
    if (names === undefined || names.length === 0) {
      return [defaultName];
    }

    // If given, must match given subnets
    if (names.length !== this.groups) {
      throw new Error(`${fieldName} must have an entry for every corresponding subnet group, got: ${JSON.stringify(names)}`);
    }

    return names;
  }

  /**
   * Return the i'th AZ
   */
  private pickAZ(i: number) {
    return this.availabilityZones[i % this.availabilityZones.length];
  }
}

/**
 * Generate the list of numbers of [0..n)
 */
export function range(n: number): number[] {
  const ret: number[] = [];
  for (let i = 0; i < n; i++) {
    ret.push(i);
  }
  return ret;
}
