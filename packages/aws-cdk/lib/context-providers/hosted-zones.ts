import { Mode, SDK } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

export interface HostedZoneProviderProps {
  /**
   * The domain name e.g. example.com to lookup
   */
  domainName: string;

  /**
   * True if the zone you want to find is a private hosted zone
   */
  privateZone?: boolean;

  /**
   * The VPC ID to that the private zone must be associated with
   *
   * If you provide VPC ID and privateZone is false, this will return no results
   * and raise an error.
   */
  vpcId?: string;
}

export class HostedZoneContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: SDK) {
  }

  public async getValue(args: {[key: string]: any}) {
    const account = args.account;
    const region = args.region;
    if (!this.isHostedZoneProps(args)) {
      throw new Error(`HostedZoneProvider requires domainName property to be set in ${args}`);
    }
    const domainName = args.domainName;
    debug(`Reading hosted zone ${account}:${region}:${domainName}`);
    const r53 = await this.aws.route53(account, region, Mode.ForReading);
    const response = await r53.listHostedZonesByName({ DNSName: domainName }).promise();
    if (!response.HostedZones) {
      throw new Error(`Hosted Zone not found in account ${account}, region ${region}: ${domainName}`);
    }
    const candidateZones = await this.filterZones(r53, response.HostedZones, args);
    if (candidateZones.length !== 1) {
      const filteProps = `dns:${domainName}, privateZone:${args.privateZone}, vpcId:${args.vpcId}`;
      throw new Error(`Found zones: ${JSON.stringify(candidateZones)} for ${filteProps}, but wanted exactly 1 zone`);
    }
    return candidateZones[0];
  }

  private async filterZones(
    r53: AWS.Route53, zones: AWS.Route53.HostedZone[],
    props: HostedZoneProviderProps): Promise<AWS.Route53.HostedZone[]> {

      let candidates: AWS.Route53.HostedZone[] = [];
      const domainName = props.domainName.endsWith('.') ? props.domainName : `${props.domainName}.`;
      debug(`Found the following zones ${JSON.stringify(zones)}`);
      candidates = zones.filter( zone => zone.Name === domainName);
      debug(`Found the following matched name zones ${JSON.stringify(candidates)}`);
      if (props.privateZone) {
        candidates = candidates.filter(zone => zone.Config && zone.Config.PrivateZone);
      } else {
        candidates = candidates.filter(zone => !zone.Config || !zone.Config.PrivateZone);
      }
      if (props.vpcId) {
        const vpcZones: AWS.Route53.HostedZone[] = [];
        for (const zone of candidates) {
          const data = await r53.getHostedZone({ Id: zone. Id }).promise();
          if (!data.VPCs) {
            debug(`Expected VPC for private zone but no VPC found ${zone.Id}`);
            continue;
          }
          if (data.VPCs.map(vpc => vpc.VPCId).includes(props.vpcId)) {
            vpcZones.push(zone);
          }
        }
        return vpcZones;
      }
      return candidates;
    }

  private isHostedZoneProps(props: HostedZoneProviderProps | any): props is HostedZoneProviderProps {
    return (props as HostedZoneProviderProps).domainName !== undefined;
  }
}