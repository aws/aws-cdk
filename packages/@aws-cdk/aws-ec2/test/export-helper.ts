import { CfnOutput, Construct, StringListCfnOutput } from '@aws-cdk/cdk';
import { ISubnet, SubnetType, Vpc } from '../lib';
import { defaultSubnetName, range, subnetName } from '../lib/util';

export function exportVpc(vpc: Vpc) {
  const pub = new ExportSubnetGroup(vpc, 'PublicSubnetIDs', vpc.publicSubnets, SubnetType.PUBLIC, vpc.availabilityZones.length);
  const priv = new ExportSubnetGroup(vpc, 'PrivateSubnetIDs', vpc.privateSubnets, SubnetType.PRIVATE, vpc.availabilityZones.length);
  const iso = new ExportSubnetGroup(vpc, 'IsolatedSubnetIDs', vpc.isolatedSubnets, SubnetType.ISOLATED, vpc.availabilityZones.length);

  const vpnGatewayId = vpc.vpnGatewayId
    ? new CfnOutput(vpc, 'VpnGatewayId', { value: vpc.vpnGatewayId }).makeImportValue().toString()
    : undefined;

  return {
    vpcId: new CfnOutput(vpc, 'VpcId', { value: vpc.vpcId }).makeImportValue().toString(),
    vpnGatewayId,
    availabilityZones: vpc.availabilityZones,
    publicSubnetIds: pub.ids,
    publicSubnetNames: pub.names,
    privateSubnetIds: priv.ids,
    privateSubnetNames: priv.names,
    isolatedSubnetIds: iso.ids,
    isolatedSubnetNames: iso.names,
  };
}

/**
 * Helper class to export/import groups of subnets
 */
export class ExportSubnetGroup {
  public readonly ids?: string[];
  public readonly names?: string[];

  private readonly groups: number;

  constructor(
      scope: Construct,
      exportName: string,
      private readonly subnets: ISubnet[],
      private readonly type: SubnetType,
      private readonly azs: number) {

    this.groups = subnets.length / azs;

    // ASSERTION
    if (Math.floor(this.groups) !== this.groups) {
      throw new Error(`Number of subnets (${subnets.length}) must be a multiple of number of availability zones (${azs})`);
    }

    this.ids = this.exportIds(scope, exportName);
    this.names = this.exportNames();
  }

  private exportIds(scope: Construct, name: string): string[] | undefined {
    if (this.subnets.length === 0) { return undefined; }
    return new StringListCfnOutput(scope, name, { values: this.subnets.map(s => s.subnetId) }).makeImportValues().map(x => x.toString());
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
    if (groupNames.length === 1 && groupNames[0] === defaultSubnetName(this.type)) { return undefined; }

    return groupNames;
  }
}
