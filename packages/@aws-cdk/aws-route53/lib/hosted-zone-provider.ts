import cdk = require('@aws-cdk/cdk');
import { HostedZoneRef, HostedZoneRefProps } from './hosted-zone-ref';

/**
 * Zone properties for looking up the Hosted Zone
 */
export interface HostedZoneProviderProps {
  /**
   * The zone domain e.g. example.com
   */
  domainName: string;

  /**
   * Is this a private zone
   */
  privateZone?: boolean;

  /**
   * If this is a private zone which VPC is assocaitated
   */
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
   * This method calls `findHostedZone` and returns the imported `HostedZoneRef`
   */
  public findAndImport(parent: cdk.Construct, id: string): HostedZoneRef {
    return HostedZoneRef.import(parent, id, this.findHostedZone());
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
