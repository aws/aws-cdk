import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');

export interface ElbV1ProviderProps {
  /**
   * Query account
   */
  account?: string;
  /**
   * Query region
   */
  region?: string;
  /**
   * Custom filter logic
   */
  filter: ElbV1Filters;
}

export interface ElbV1Filters {
  vpcId: string,
  tags: ElbV1Tag[]
}

export interface ElbV1Tag {
  key: string,
  value: string
}

const DEFAULT_HOSTED_ZONE = {
  Id: '/hostedzone/DUMMY',
  Name: 'example.com',
};

/**
 * Context provider that will lookup the Hosted Zone ID for the given arguments
 */
export class LoadBalancerV1Provider {
  private provider: cdk.ContextProvider;
  constructor(context: cdk.Construct, props: ElbV1ProviderProps) {
    this.provider = new cdk.ContextProvider(context, cxapi.ELBV1_PROVIDER, props);
  }

  /**
   * Return the hosted zone meeting the filter
   */
  public findLoadBalancers() {
    const values = this.provider.getValue(DEFAULT_HOSTED_ZONE) as string[];
    return values;
  }
}

