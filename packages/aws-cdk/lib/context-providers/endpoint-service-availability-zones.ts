import * as cxapi from '@aws-cdk/cx-api';
import { Mode, SdkProvider } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

/**
 * Plugin to retrieve the Availability Zones for an endpoint service
 */
export class EndpointServiceAZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: {[key: string]: any}) {
    const region = args.region;
    const account = args.account;
    const serviceName = args.serviceName;
    debug(`Reading AZs for ${account}:${region}:${serviceName}`);
    const ec2 = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading)).ec2();
    const response = await ec2.describeVpcEndpointServices({ ServiceNames: [serviceName] }).promise();

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
