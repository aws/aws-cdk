import cdk = require('@aws-cdk/cdk');
import { HostedZoneRefProps } from './hosted-zone-ref';

export interface HostedZoneProviderProps {
  domainName: string;
  privateZone?: boolean;
  vpcId?: string;
}

const HOSTED_ZONE_PROVIDER = 'hosted-zone';

const DEFAULT_HOSTED_ZONE: HostedZoneRefProps = {
  hostedZoneId: '/hostedzone/DUMMY',
  zoneName: 'example.com',
};

interface AwsHostedZone {
  Id: string;
  Name: string;
}

/**
 * Context provider that will lookup the Hosted Zone ID for the given arguments
 */
export class HostedZoneProvider {
  private provider: cdk.ContextProvider;
  constructor(context: cdk.Construct, props: HostedZoneProviderProps) {
    this.provider = new cdk.ContextProvider(context, HOSTED_ZONE_PROVIDER, props);
  }
  /**
   * Return the hosted zone meeting the filter
   */
  public findHostedZone(): HostedZoneRefProps {
    const zone =  this.provider.getValue(DEFAULT_HOSTED_ZONE);
    if (zone === DEFAULT_HOSTED_ZONE) {
      return zone;
    }
    if (!this.isAwsHostedZone(zone)) {
      throw new Error(`Expected an AWS Hosted Zone received ${JSON.stringify(zone)}`);
    } else {
      const actualZone = zone as AwsHostedZone;
      // CDK handles the '.' at the end, so remove it here
      if (actualZone.Name.endsWith('.')) {
        actualZone.Name = actualZone.Name.substring(0, actualZone.Name.length - 1);
      }
      return {
        hostedZoneId: actualZone.Id,
        zoneName: actualZone.Name,
      };
    }
  }

  private isAwsHostedZone(zone: AwsHostedZone | any): zone is AwsHostedZone {
    const candidateZone = zone as AwsHostedZone;
    return candidateZone.Name !== undefined && candidateZone.Id !== undefined;
  }
}
