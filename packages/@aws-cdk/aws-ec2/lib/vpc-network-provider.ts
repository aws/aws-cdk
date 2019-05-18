import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import { VpcAttributes } from './vpc';

/**
 * Properties for looking up an existing VPC.
 *
 * The combination of properties must specify filter down to exactly one
 * non-default VPC, otherwise an error is raised.
 */
export interface VpcLookupOptions {
  /**
   * The ID of the VPC
   *
   * If given, will import exactly this VPC.
   *
   * @default Don't filter on vpcId
   */
  readonly vpcId?: string;

  /**
   * The name of the VPC
   *
   * If given, will import the VPC with this name.
   *
   * @default Don't filter on vpcName
   */
  readonly vpcName?: string;

  /**
   * Tags on the VPC
   *
   * The VPC must have all of these tags
   *
   * @default Don't filter on tags
   */
  readonly tags?: {[key: string]: string};

  /**
   * Whether to match the default VPC
   *
   * @default Don't care whether we return the default VPC
   */
  readonly isDefault?: boolean;
}

/**
 * Context provider to discover and import existing VPCs
 */
export class VpcNetworkProvider {
  private provider: cdk.ContextProvider;

  constructor(context: cdk.Construct, options: VpcLookupOptions) {
    const filter: {[key: string]: string} = options.tags || {};

    // We give special treatment to some tags
    if (options.vpcId) { filter['vpc-id'] = options.vpcId; }
    if (options.vpcName) { filter['tag:Name'] = options.vpcName; }
    if (options.isDefault !== undefined) {
      filter.isDefault = options.isDefault ? 'true' : 'false';
    }

    this.provider = new cdk.ContextProvider(context, cxapi.VPC_PROVIDER, { filter } as cxapi.VpcContextQuery);
  }

  /**
   * Return the VPC import props matching the filter
   */
  public get vpcProps(): VpcAttributes {
    const ret: cxapi.VpcContextResponse = this.provider.getValue(DUMMY_VPC_PROPS);
    return ret;
  }
}

/**
 * There are returned when the provider has not supplied props yet
 *
 * It's only used for testing and on the first run-through.
 */
const DUMMY_VPC_PROPS: cxapi.VpcContextResponse = {
  availabilityZones: ['dummy-1a', 'dummy-1b'],
  vpcId: 'vpc-12345',
  publicSubnetIds: ['s-12345', 's-67890'],
  privateSubnetIds: ['p-12345', 'p-67890'],
};
