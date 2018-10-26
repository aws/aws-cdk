import cxapi = require('@aws-cdk/cx-api');
import { Mode, SDK } from './api';
import { debug } from './logging';
import { Settings } from './settings';

export interface ContextProviderPlugin {
  getValue(args: {[key: string]: any}): Promise<any>;
}

export type ProviderMap = {[name: string]: ContextProviderPlugin};

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class AZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(args: {[key: string]: any}) {
    const region = args.region;
    const account = args.account;
    debug(`Reading AZs for ${account}:${region}`);
    const ec2 = await this.aws.ec2(account, region, Mode.ForReading);
    const response = await ec2.describeAvailabilityZones().promise();
    if (!response.AvailabilityZones) { return []; }
    const azs = response.AvailabilityZones.filter(zone => zone.State === 'available').map(zone => zone.ZoneName);
    return azs;
  }
}

/**
 * Plugin to read arbitrary SSM parameter names
 */
export class SSMContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(args: {[key: string]: any}) {
    const region = args.region;
    const account = args.account;
    if (!('parameterName' in args)) {
        throw new Error('parameterName must be provided in props for SSMContextProviderPlugin');
    }
    const parameterName = args.parameterName;
    debug(`Reading SSM parameter ${account}:${region}:${parameterName}`);

    const ssm = await this.aws.ssm(account, region, Mode.ForReading);
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    if (!response.Parameter || response.Parameter.Value === undefined) {
      throw new Error(`SSM parameter not available in account ${account}, region ${region}: ${parameterName}`);
    }
    return response.Parameter.Value;
  }
}

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
      throw new Error(`HostedZoneProvider requires domainName property to be set in ${args.props}`);
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
/**
 * Iterate over the list of missing context values and invoke the appropriate providers from the map to retrieve them
 */
export async function provideContextValues(
  missingValues: { [key: string]: cxapi.MissingContext },
  projectConfig: Settings,
  availableContextProviders: ProviderMap) {
  for (const key of Object.keys(missingValues)) {
    const missingContext = missingValues[key];

    const provider = availableContextProviders[missingContext.provider];
    if (!provider) {
      throw new Error(`Unrecognized context provider name: ${missingContext.provider}`);
    }

    const value = await provider.getValue(missingContext.props);
    projectConfig.set(['context', key], value);
    debug(`Setting "${key}" context to ${JSON.stringify(value)}`);
  }
}
