import { HostedZoneContextQuery } from '@aws-cdk/cloud-assembly-schema';
import type { HostedZone } from '@aws-sdk/client-route-53';
import type { IRoute53Client } from '../api';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';
import { ContextProviderError } from '../toolkit/error';

export class HostedZoneContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: HostedZoneContextQuery): Promise<object> {
    const account = args.account;
    const region = args.region;
    if (!this.isHostedZoneQuery(args)) {
      throw new ContextProviderError(`HostedZoneProvider requires domainName property to be set in ${args}`);
    }
    const domainName = args.domainName;
    debug(`Reading hosted zone ${account}:${region}:${domainName}`);
    const r53 = (await initContextProviderSdk(this.aws, args)).route53();
    const response = await r53.listHostedZonesByName({ DNSName: domainName });
    if (!response.HostedZones) {
      throw new ContextProviderError(`Hosted Zone not found in account ${account}, region ${region}: ${domainName}`);
    }
    const candidateZones = await this.filterZones(r53, response.HostedZones, args);
    if (candidateZones.length !== 1) {
      const filteProps = `dns:${domainName}, privateZone:${args.privateZone}, vpcId:${args.vpcId}`;
      throw new ContextProviderError(`Found zones: ${JSON.stringify(candidateZones)} for ${filteProps}, but wanted exactly 1 zone`);
    }

    return {
      Id: candidateZones[0].Id,
      Name: candidateZones[0].Name,
    };
  }

  private async filterZones(
    r53: IRoute53Client,
    zones: HostedZone[],
    props: HostedZoneContextQuery,
  ): Promise<HostedZone[]> {
    let candidates: HostedZone[] = [];
    const domainName = props.domainName.endsWith('.') ? props.domainName : `${props.domainName}.`;
    debug(`Found the following zones ${JSON.stringify(zones)}`);
    candidates = zones.filter((zone) => zone.Name === domainName);
    debug(`Found the following matched name zones ${JSON.stringify(candidates)}`);
    if (props.privateZone) {
      candidates = candidates.filter((zone) => zone.Config && zone.Config.PrivateZone);
    } else {
      candidates = candidates.filter((zone) => !zone.Config || !zone.Config.PrivateZone);
    }
    if (props.vpcId) {
      const vpcZones: HostedZone[] = [];
      for (const zone of candidates) {
        const data = await r53.getHostedZone({ Id: zone.Id });
        if (!data.VPCs) {
          debug(`Expected VPC for private zone but no VPC found ${zone.Id}`);
          continue;
        }
        if (data.VPCs.map((vpc) => vpc.VPCId).includes(props.vpcId)) {
          vpcZones.push(zone);
        }
      }
      return vpcZones;
    }
    return candidates;
  }

  private isHostedZoneQuery(props: HostedZoneContextQuery | any): props is HostedZoneContextQuery {
    return (props as HostedZoneContextQuery).domainName !== undefined;
  }
}
