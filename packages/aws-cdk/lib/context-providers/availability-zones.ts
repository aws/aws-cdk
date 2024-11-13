import type { AvailabilityZonesContextQuery } from '@aws-cdk/cloud-assembly-schema';
import type { AvailabilityZone } from '@aws-sdk/client-ec2';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class AZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: AvailabilityZonesContextQuery) {
    const region = args.region;
    const account = args.account;
    debug(`Reading AZs for ${account}:${region}`);
    const ec2 = (await initContextProviderSdk(this.aws, args)).ec2();
    const response = await ec2.describeAvailabilityZones({});
    if (!response.AvailabilityZones) {
      return [];
    }
    const azs = response.AvailabilityZones.filter((zone: AvailabilityZone) => zone.State === 'available').map(
      (zone: AvailabilityZone) => zone.ZoneName,
    );
    return azs;
  }
}
