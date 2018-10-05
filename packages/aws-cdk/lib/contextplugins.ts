import cxapi = require('@aws-cdk/cx-api');
import { Mode, SDK } from './api';
import { debug } from './logging';
import { Settings } from './settings';

export interface ContextProviderPlugin {
  getValue(filter: cxapi.ContextProviderProps): Promise<any>;
}

export type ProviderMap = {[name: string]: ContextProviderPlugin};

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class AZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(props: cxapi.ContextProviderProps) {
    const region = props.region;
    const account = props.account;
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

  public async getValue(filter: cxapi.ContextProviderProps) {
    const region = filter.region;
    const account = filter.account;
    if (!('parameterName' in filter.props)) {
        throw new Error('parameterName must be provided in props for SSMContextProviderPlugin');
    }
    const parameterName = filter.props.parameterName;
    debug(`Reading SSM parameter ${account}:${region}:${parameterName}`);

    const ssm = await this.aws.ssm(account, region, Mode.ForReading);
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    if (!response.Parameter || response.Parameter.Value === undefined) {
      throw new Error(`SSM parameter not availble in account ${account}, region ${region}: ${parameterName}`);
    }
    return response.Parameter.Value;
  }
}

export class HostedZoneContextProviderPlugin implements ContextProviderPlugin {

  constructor(private readonly aws: SDK) {
  }

  public async getValue(filter: cxapi.ContextProviderProps) {
    const account = filter.account;
    const region = filter.region;
    if (!this.isHostedZoneProps(filter.props)) {
      throw new Error(`HostedZoneProvider requires domainName property to be set in ${filter.props}`);
    }
    const props: cxapi.HostedZoneProviderProps = filter.props;
    const domainName = props.domainName;
    const privateZone: boolean = !!props.privateZone;
    const vpcId =
    debug(`Reading hosted zone ${account}:${region}:${domainName}`);
    const r53 = await this.aws.route53(account, region, Mode.ForReading);
    const response = await r53.listHostedZonesByName({ DNSName: domainName }).promise();
    if (!response.HostedZones) {
      throw new Error(`Hosted Zone not found in account ${account}, region ${region}: ${domainName}`);
    }
    const candidateZones = this.filterZones(r53, response.HostedZones,
      !!props.privateZone, props.vpcId);
    if (candidateZones.length > 1) {
      const filteProps = `dns:${domainName}, privateZone:${privateZone}, vpcId:${vpcId}`;
      throw new Error(`Found more than one matching HostedZone ${candidateZones} for ${filteProps}`);
    }
    return candidateZones[0];
  }

  private filterZones(r53: AWS.Route53, zones: AWS.Route53.HostedZone[], privateZone: boolean, vpcId: string | undefined): AWS.Route53.HostedZone[] {

      let candidates: AWS.Route53.HostedZone[] = [];
      if (privateZone) {
        candidates = zones.filter(zone => zone.Config && zone.Config.PrivateZone);
      } else {
        candidates = zones.filter(zone => !zone.Config || !zone.Config.PrivateZone);
      }
      if (vpcId) {
        const vpcZones: AWS.Route53.HostedZone[] = [];
        for (const zone of candidates) {
          r53.getHostedZone({Id: zone.Id}, (err, data) => {
            if (err) {
              throw new Error(err.message);
            }
            if (!data.VPCs) {
              debug(`Expected VPC for private zone but no VPC found ${zone.Id}`);
              return;
            }
            if (data.VPCs.map(vpc => vpc.VPCId).includes(vpcId)) {
              vpcZones.push(zone);
            }
          });
        }
        return vpcZones;
      }
      return candidates;
    }

  private isHostedZoneProps(props: cxapi.HostedZoneProviderProps | any): props is cxapi.HostedZoneProviderProps {
    return (props as cxapi.HostedZoneProviderProps).domainName !== undefined;
  }
}
/**
 * Iterate over the list of missing context values and invoke the appropriate providers from the map to retrieve them
 */
export async function provideContextValues(
  missingValues: { [key: string]: cxapi.ContextProviderProps },
  projectConfig: Settings,
  availableContextProviders: ProviderMap) {
  for (const key of Object.keys(missingValues)) {
    const props = missingValues[key];

    const provider = availableContextProviders[props.provider];
    if (!provider) {
      throw new Error(`Unrecognized context provider name: ${props.provider}`);
    }

    const value = await provider.getValue(props);
    projectConfig.set(['context', key], value);
  }
}
