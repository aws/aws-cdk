import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { DescribeAvailabilityZonesCommand } from '@aws-sdk/client-ec2';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin, Mode } from '../api/plugin';
import { debug } from '../logging';

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class AZContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  public async getValue(args: cxschema.AvailabilityZonesContextQuery) {
    const region = args.region;
    const account = args.account;
    debug(`Reading AZs for ${account}:${region}`);
    const options = { assumeRoleArn: args.lookupRoleArn };
    const ec2 = (
      await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(account, region), Mode.ForReading, options)
    ).ec2();
    const command = new DescribeAvailabilityZonesCommand();
    const response = await ec2.send(command);
    if (!response.AvailabilityZones) {
      return [];
    }
    const azs = response.AvailabilityZones.filter((zone) => zone.State === 'available').map((zone) => zone.ZoneName);
    return azs;
  }
}
