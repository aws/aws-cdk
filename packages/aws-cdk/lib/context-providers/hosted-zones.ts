import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import {
  GetHostedZoneCommand,
  HostedZone,
  ListHostedZonesByNameCommand,
  Route53Client,
} from '@aws-sdk/client-route-53';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin, Mode } from '../api/plugin';
import { debug } from '../logging';

export class HostedZoneContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: cxschema.HostedZoneContextQuery): Promise<object> {
    const account = args.account;
    const region = args.region;
    if (!this.isHostedZoneQuery(args)) {
      throw new Error(`HostedZoneProvider requires domainName property to be set in ${args}`);
    }
    const domainName = args.domainName;
    debug(`Reading hosted zone ${account}:${region}:${domainName}`);
    const options = { assumeRoleArn: args.lookupRoleArn };
    const r53 = (
      await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, options)
    ).route53();
    const command = new ListHostedZonesByNameCommand({ DNSName: domainName });
    const response = await r53.send(command);
    if (!response.HostedZones) {
      throw new Error(`Hosted Zone not found in account ${account}, region ${region}: ${domainName}`);
    }
    const candidateZones = await this.filterZones(r53, response.HostedZones, args);
    if (candidateZones.length !== 1) {
      const filteProps = `dns:${domainName}, privateZone:${args.privateZone}, vpcId:${args.vpcId}`;
      throw new Error(`Found zones: ${JSON.stringify(candidateZones)} for ${filteProps}, but wanted exactly 1 zone`);
    }

    return {
      Id: candidateZones[0].Id,
      Name: candidateZones[0].Name,
    };
  }

  private async filterZones(
    r53: Route53Client,
    zones: HostedZone[],
    props: cxschema.HostedZoneContextQuery,
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
        const command = new GetHostedZoneCommand({ Id: zone.Id });
        const data = await r53.send(command);
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

  private isHostedZoneQuery(props: cxschema.HostedZoneContextQuery | any): props is cxschema.HostedZoneContextQuery {
    return (props as cxschema.HostedZoneContextQuery).domainName !== undefined;
  }
}
