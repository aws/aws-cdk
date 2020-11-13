import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Mode, SdkProvider } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class AZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.AvailabilityZonesContextQuery) {
    const region = args.region;
    const account = args.account;
    debug(`Reading AZs for ${account}:${region}`);
    const ec2 = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading)).ec2();
    const response = await ec2.describeAvailabilityZones().promise();
    if (!response.AvailabilityZones) { return []; }
    const azs = response.AvailabilityZones.filter(zone => zone.State === 'available').map(zone => zone.ZoneName);
    return azs;
  }
}
