import type { EndpointServiceAvailabilityZonesContextQuery } from '@aws-cdk/cloud-assembly-schema';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';

/**
 * Plugin to retrieve the Availability Zones for an endpoint service
 */
export class EndpointServiceAZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: EndpointServiceAvailabilityZonesContextQuery) {
    const region = args.region;
    const account = args.account;
    const serviceName = args.serviceName;
    debug(`Reading AZs for ${account}:${region}:${serviceName}`);
    const ec2 = (await initContextProviderSdk(this.aws, args)).ec2();
    const response = await ec2.describeVpcEndpointServices({
      ServiceNames: [serviceName],
    });

    // expect a service in the response
    if (!response.ServiceDetails || response.ServiceDetails.length === 0) {
      debug(`Could not retrieve service details for ${account}:${region}:${serviceName}`);
      return [];
    }
    const azs = response.ServiceDetails[0].AvailabilityZones;
    debug(`Endpoint service ${account}:${region}:${serviceName} is available in availability zones ${azs}`);
    return azs;
  }
}
