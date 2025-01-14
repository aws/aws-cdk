import { LoadBalancerContextQuery, LoadBalancerListenerContextQuery } from '@aws-cdk/cloud-assembly-schema';
import {
  LoadBalancerContextResponse,
  LoadBalancerIpAddressType,
  LoadBalancerListenerContextResponse,
} from '@aws-cdk/cx-api';
import { type Listener, LoadBalancer, type TagDescription } from '@aws-sdk/client-elastic-load-balancing-v2';
import type { IElasticLoadBalancingV2Client } from '../api';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';

/**
 * Provides load balancer context information.
 */
export class LoadBalancerContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  async getValue(query: LoadBalancerContextQuery): Promise<LoadBalancerContextResponse> {
    if (!query.loadBalancerArn && !query.loadBalancerTags) {
      throw new Error('The load balancer lookup query must specify either `loadBalancerArn` or `loadBalancerTags`');
    }

    const loadBalancer = await (await LoadBalancerProvider.getClient(this.aws, query)).getLoadBalancer();

    const ipAddressType =
      loadBalancer.IpAddressType === 'ipv4' ? LoadBalancerIpAddressType.IPV4 : LoadBalancerIpAddressType.DUAL_STACK;

    return {
      loadBalancerArn: loadBalancer.LoadBalancerArn!,
      loadBalancerCanonicalHostedZoneId: loadBalancer.CanonicalHostedZoneId!,
      loadBalancerDnsName: loadBalancer.DNSName!,
      vpcId: loadBalancer.VpcId!,
      securityGroupIds: loadBalancer.SecurityGroups ?? [],
      ipAddressType: ipAddressType,
    };
  }
}

/**
 * Provides load balancer listener context information
 */
export class LoadBalancerListenerContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  async getValue(query: LoadBalancerListenerContextQuery): Promise<LoadBalancerListenerContextResponse> {
    if (!query.listenerArn && !query.loadBalancerArn && !query.loadBalancerTags) {
      throw new Error(
        'The load balancer listener query must specify at least one of: `listenerArn`, `loadBalancerArn` or `loadBalancerTags`',
      );
    }

    return (await LoadBalancerProvider.getClient(this.aws, query)).getListener();
  }
}

class LoadBalancerProvider {
  public static async getClient(
    aws: SdkProvider,
    query: LoadBalancerListenerContextQuery,
  ): Promise<LoadBalancerProvider> {
    const client = (await initContextProviderSdk(aws, query)).elbv2();

    try {
      const listener = query.listenerArn
        ? // Assert we're sure there's at least one so it throws if not
        (await client.describeListeners({ ListenerArns: [query.listenerArn] })).Listeners![0]!
        : undefined;
      return new LoadBalancerProvider(
        client,
        { ...query, loadBalancerArn: listener?.LoadBalancerArn || query.loadBalancerArn },
        listener,
      );
    } catch (err) {
      throw new Error(`No load balancer listeners found matching arn ${query.listenerArn}`);
    }
  }

  constructor(
    private readonly client: IElasticLoadBalancingV2Client,
    private readonly filter: LoadBalancerListenerContextQuery,
    private readonly listener?: Listener,
  ) {}

  public async getLoadBalancer(): Promise<LoadBalancer> {
    const loadBalancers = await this.getLoadBalancers();

    if (loadBalancers.length === 0) {
      throw new Error(`No load balancers found matching ${JSON.stringify(this.filter)}`);
    }

    if (loadBalancers.length > 1) {
      throw new Error(
        `Multiple load balancers found matching ${JSON.stringify(this.filter)} - please provide more specific criteria`,
      );
    }

    return loadBalancers[0];
  }

  public async getListener(): Promise<LoadBalancerListenerContextResponse> {
    if (this.listener) {
      try {
        const loadBalancer = await this.getLoadBalancer();
        return {
          listenerArn: this.listener.ListenerArn!,
          listenerPort: this.listener.Port!,
          securityGroupIds: loadBalancer.SecurityGroups || [],
        };
      } catch (err) {
        throw new Error(`No associated load balancer found for listener arn ${this.filter.listenerArn}`);
      }
    }

    const loadBalancers = await this.getLoadBalancers();
    if (loadBalancers.length === 0) {
      throw new Error(
        `No associated load balancers found for load balancer listener query ${JSON.stringify(this.filter)}`,
      );
    }

    const listeners = (await this.getListenersForLoadBalancers(loadBalancers)).filter((listener) => {
      return (
        (!this.filter.listenerPort || listener.Port === this.filter.listenerPort) &&
        (!this.filter.listenerProtocol || listener.Protocol === this.filter.listenerProtocol)
      );
    });

    if (listeners.length === 0) {
      throw new Error(`No load balancer listeners found matching ${JSON.stringify(this.filter)}`);
    }

    if (listeners.length > 1) {
      throw new Error(
        `Multiple load balancer listeners found matching ${JSON.stringify(this.filter)} - please provide more specific criteria`,
      );
    }

    return {
      listenerArn: listeners[0].ListenerArn!,
      listenerPort: listeners[0].Port!,
      securityGroupIds:
        loadBalancers.find((lb) => listeners[0].LoadBalancerArn === lb.LoadBalancerArn)?.SecurityGroups || [],
    };
  }

  private async getLoadBalancers() {
    const loadBalancerArns = this.filter.loadBalancerArn ? [this.filter.loadBalancerArn] : undefined;
    const loadBalancers = (
      await this.client.paginateDescribeLoadBalancers({
        LoadBalancerArns: loadBalancerArns,
      })
    ).filter((lb) => lb.Type === this.filter.loadBalancerType);

    return this.filterByTags(loadBalancers);
  }

  private async filterByTags(loadBalancers: LoadBalancer[]): Promise<LoadBalancer[]> {
    if (!this.filter.loadBalancerTags) {
      return loadBalancers;
    }
    return (await this.describeTags(loadBalancers.map((lb) => lb.LoadBalancerArn!)))
      .filter((tagDescription) => {
        // For every tag in the filter, there is some tag in the LB that matches it.
        // In other words, the set of tags in the filter is a subset of the set of tags in the LB.
        return this.filter.loadBalancerTags!.every((filter) => {
          return tagDescription.Tags?.some((tag) =>
            filter.key === tag.Key && filter.value === tag.Value);
        });
      })
      .flatMap((tag) => loadBalancers.filter((loadBalancer) => tag.ResourceArn === loadBalancer.LoadBalancerArn));
  }

  /**
   * Returns tag descriptions associated with the resources. The API doesn't support
   * pagination, so this function breaks the resource list into chunks and issues
   * the appropriate requests.
   */
  private async describeTags(resourceArns: string[]): Promise<TagDescription[]> {
    // Max of 20 resource arns per request.
    const chunkSize = 20;
    const tags = Array<TagDescription>();
    for (let i = 0; i < resourceArns.length; i += chunkSize) {
      const chunk = resourceArns.slice(i, Math.min(i + chunkSize, resourceArns.length));
      const chunkTags = await this.client.describeTags({
        ResourceArns: chunk,
      });

      tags.push(...(chunkTags.TagDescriptions || []));
    }
    return tags;
  }

  private async getListenersForLoadBalancers(loadBalancers: LoadBalancer[]): Promise<Listener[]> {
    const listeners: Listener[] = [];
    for (const loadBalancer of loadBalancers.map((lb) => lb.LoadBalancerArn)) {
      listeners.push(...(await this.client.paginateDescribeListeners({ LoadBalancerArn: loadBalancer })));
    }
    return listeners;
  }
}
