import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import { HostedZone } from './hosted-zone';
import { HostedZoneImportProps, IHostedZone } from './hosted-zone-ref';

/**
 * Zone properties for looking up the Hosted Zone
 */
export interface HostedZoneProviderProps {
  /**
   * The zone domain e.g. example.com
   */
  readonly domainName: string;

  /**
   * Is this a private zone
   */
  readonly privateZone?: boolean;

  /**
   * If this is a private zone which VPC is assocaitated
   */
  readonly vpcId?: string;
}

const DEFAULT_HOSTED_ZONE: HostedZoneContextResponse = {
  Id: '/hostedzone/DUMMY',
  Name: 'example.com',
};

/**
 * Context provider that will lookup the Hosted Zone ID for the given arguments
 */
export class HostedZoneProvider {
  private provider: cdk.ContextProvider;
  constructor(context: cdk.Construct, props: HostedZoneProviderProps) {
    this.provider = new cdk.ContextProvider(context, cxapi.HOSTED_ZONE_PROVIDER, props);
  }

  /**
   * This method calls `findHostedZone` and returns the imported hosted zone
   */
  public findAndImport(scope: cdk.Construct, id: string): IHostedZone {
    return HostedZone.import(scope, id, this.findHostedZone());
  }
  /**
   * Return the hosted zone meeting the filter
   */
  public findHostedZone(): HostedZoneImportProps {
    const zone = this.provider.getValue(DEFAULT_HOSTED_ZONE) as HostedZoneContextResponse;
    // CDK handles the '.' at the end, so remove it here
    if (zone.Name.endsWith('.')) {
      zone.Name = zone.Name.substring(0, zone.Name.length - 1);
    }
    return {
      hostedZoneId: zone.Id,
      zoneName: zone.Name,
    };
  }
}

/**
 * A mirror of the definition in cxapi, but can use the capital letters
 * since it doesn't need to be published via JSII.
 */
interface HostedZoneContextResponse {
  Id: string;
  Name: string;
}