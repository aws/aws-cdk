import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { Mode } from '../api/aws-auth/credentials';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';

/**
 * Provides load balancer context information.
 */
export class LoadBalancerContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(query: cxschema.LoadBalancerContextQuery): Promise<cxapi.LoadBalancerContextResponse> {
    const options = { assumeRoleArn: query.lookupRoleArn };
    const elbv2 = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(query.account, query.region), Mode.ForReading, options)).sdk.elbv2();

    if (!query.loadBalancerArn && !query.loadBalancerTags) {
      throw new Error('The load balancer lookup query must specify either `loadBalancerArn` or `loadBalancerTags`');
    }

    const loadBalancers = await findLoadBalancers(elbv2, query);

    if (loadBalancers.length === 0) {
      throw new Error(`No load balancers found matching ${JSON.stringify(query)}`);
    }

    if (loadBalancers.length > 1) {
      throw new Error(`Multiple load balancers found matching ${JSON.stringify(query)} - please provide more specific criteria`);
    }

    const loadBalancer = loadBalancers[0];

    const ipAddressType = loadBalancer.IpAddressType === 'ipv4'
      ? cxapi.LoadBalancerIpAddressType.IPV4
      : cxapi.LoadBalancerIpAddressType.DUAL_STACK;

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

// Decreases line length
type LoadBalancerListenerQuery = cxschema.LoadBalancerListenerContextQuery;
type LoadBalancerListenerResponse = cxapi.LoadBalancerListenerContextResponse;

/**
 * Provides load balancer listener context information
 */
export class LoadBalancerListenerContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(query: LoadBalancerListenerQuery): Promise<LoadBalancerListenerResponse> {
    const options = { assumeRoleArn: query.lookupRoleArn };
    const elbv2 = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(query.account, query.region), Mode.ForReading, options)).sdk.elbv2();

    if (!query.listenerArn && !query.loadBalancerArn && !query.loadBalancerTags) {
      throw new Error('The load balancer listener query must specify at least one of: `listenerArn`, `loadBalancerArn` or `loadBalancerTags`');
    }

    return query.listenerArn ? this.getListenerByArn(elbv2, query) : this.getListenerByFilteringLoadBalancers(elbv2, query);
  }

  /**
   * Look up a listener by querying listeners for query's listener arn and then
   * resolve its load balancer for the security group information.
   */
  private async getListenerByArn(elbv2: AWS.ELBv2, query: LoadBalancerListenerQuery) {
    const listenerArn = query.listenerArn!;
    const listenerResults = await elbv2.describeListeners({ ListenerArns: [listenerArn] }).promise();
    const listeners = (listenerResults.Listeners ?? []);

    if (listeners.length === 0) {
      throw new Error(`No load balancer listeners found matching arn ${listenerArn}`);
    }

    const listener = listeners[0];

    const loadBalancers = await findLoadBalancers(elbv2, {
      ...query,
      loadBalancerArn: listener.LoadBalancerArn!,
    });

    if (loadBalancers.length === 0) {
      throw new Error(`No associated load balancer found for listener arn ${listenerArn}`);
    }

    const loadBalancer = loadBalancers[0];

    return {
      listenerArn: listener.ListenerArn!,
      listenerPort: listener.Port!,
      securityGroupIds: loadBalancer.SecurityGroups ?? [],
    };
  }

  /**
   * Look up a listener by starting from load balancers, filtering out
   * unmatching load balancers, and then by querying the listeners of each load
   * balancer and filtering out unmatching listeners.
   */
  private async getListenerByFilteringLoadBalancers(elbv2: AWS.ELBv2, args: LoadBalancerListenerQuery) {
    // Find matching load balancers
    const loadBalancers = await findLoadBalancers(elbv2, args);

    if (loadBalancers.length === 0) {
      throw new Error(`No associated load balancers found for load balancer listener query ${JSON.stringify(args)}`);
    }

    return this.findMatchingListener(elbv2, loadBalancers, args);
  }

  /**
   * Finds the matching listener from the list of load balancers. This will
   * error unless there is exactly one match so that the user is prompted to
   * provide more specific criteria rather than us providing a nondeterministic
   * result.
   */
  private async findMatchingListener(elbv2: AWS.ELBv2, loadBalancers: AWS.ELBv2.LoadBalancers, query: LoadBalancerListenerQuery) {
    const loadBalancersByArn = indexLoadBalancersByArn(loadBalancers);
    const loadBalancerArns = Object.keys(loadBalancersByArn);

    const matches = Array<cxapi.LoadBalancerListenerContextResponse>();

    for await (const listener of describeListenersByLoadBalancerArn(elbv2, loadBalancerArns)) {
      const loadBalancer = loadBalancersByArn[listener.LoadBalancerArn!];
      if (listenerMatchesQueryFilter(listener, query) && loadBalancer) {
        matches.push({
          listenerArn: listener.ListenerArn!,
          listenerPort: listener.Port!,
          securityGroupIds: loadBalancer.SecurityGroups ?? [],
        });
      }
    }

    if (matches.length === 0) {
      throw new Error(`No load balancer listeners found matching ${JSON.stringify(query)}`);
    }

    if (matches.length > 1) {
      throw new Error(`Multiple load balancer listeners found matching ${JSON.stringify(query)} - please provide more specific criteria`);
    }

    return matches[0];
  }
}

/**
 * Find load balancers by the given filter args.
 */
async function findLoadBalancers(elbv2: AWS.ELBv2, args: cxschema.LoadBalancerFilter) {
  // List load balancers
  let loadBalancers = await describeLoadBalancers(elbv2, {
    LoadBalancerArns: args.loadBalancerArn ? [args.loadBalancerArn] : undefined,
  });

  // Filter by load balancer type
  loadBalancers = loadBalancers.filter(lb => lb.Type === args.loadBalancerType);

  // Filter by load balancer tags
  if (args.loadBalancerTags) {
    loadBalancers = await filterLoadBalancersByTags(elbv2, loadBalancers, args.loadBalancerTags);
  }

  return loadBalancers;
}

/**
 * Helper to paginate over describeLoadBalancers
 * @internal
 */
export async function describeLoadBalancers(elbv2: AWS.ELBv2, request: AWS.ELBv2.DescribeLoadBalancersInput) {
  const loadBalancers = Array<AWS.ELBv2.LoadBalancer>();
  let page: AWS.ELBv2.DescribeLoadBalancersOutput | undefined;
  do {
    page = await elbv2.describeLoadBalancers({
      ...request,
      Marker: page?.NextMarker,
    }).promise();

    loadBalancers.push(...Array.from(page.LoadBalancers ?? []));
  } while (page.NextMarker);

  return loadBalancers;
}

/**
 * Describes the tags of each load balancer and returns the load balancers that
 * match the given tags.
 */
async function filterLoadBalancersByTags(elbv2: AWS.ELBv2, loadBalancers: AWS.ELBv2.LoadBalancers, loadBalancerTags: cxschema.Tag[]) {
  const loadBalancersByArn = indexLoadBalancersByArn(loadBalancers);
  const loadBalancerArns = Object.keys(loadBalancersByArn);
  const matchingLoadBalancers = Array<AWS.ELBv2.LoadBalancer>();

  // Consume the items of async generator.
  for await (const tags of describeTags(elbv2, loadBalancerArns)) {
    if (tagsMatch(tags, loadBalancerTags) && loadBalancersByArn[tags.ResourceArn!]) {
      matchingLoadBalancers.push(loadBalancersByArn[tags.ResourceArn!]);
    }
  }

  return matchingLoadBalancers;
}

/**
 * Generator function that yields `TagDescriptions`. The API doesn't support
 * pagination, so this generator breaks the resource list into chunks and issues
 * the appropriate requests, yielding each tag description as it receives it.
 * @internal
 */
export async function* describeTags(elbv2: AWS.ELBv2, resourceArns: string[]) {
  // Max of 20 resource arns per request.
  const chunkSize = 20;
  for (let i = 0; i < resourceArns.length; i += chunkSize) {
    const chunk = resourceArns.slice(i, Math.min(i + chunkSize, resourceArns.length));
    const chunkTags = await elbv2.describeTags({
      ResourceArns: chunk,
    }).promise();

    for (const tag of chunkTags.TagDescriptions ?? []) {
      yield tag;
    }
  }
}

/**
 * Determines if the given TagDescription matches the required tags.
 * @internal
 */
export function tagsMatch(tagDescription: AWS.ELBv2.TagDescription, requiredTags: cxschema.Tag[]) {
  const tagsByName: Record<string, string | undefined> = {};
  for (const tag of tagDescription.Tags ?? []) {
    tagsByName[tag.Key!] = tag.Value;
  }

  for (const tag of requiredTags) {
    if (tagsByName[tag.key] !== tag.value) {
      return false;
    }
  }

  return true;
}

/**
 * Async generator that produces listener descriptions by traversing the
 * pagination. Because describeListeners only lets you search by one load
 * balancer arn at a time, we request them individually and yield the listeners
 * as they come in.
 * @internal
 */
export async function* describeListenersByLoadBalancerArn(elbv2: AWS.ELBv2, loadBalancerArns: string[]) {
  for (const loadBalancerArn of loadBalancerArns) {
    let page: AWS.ELBv2.DescribeListenersOutput | undefined;
    do {
      page = await elbv2.describeListeners({
        LoadBalancerArn: loadBalancerArn,
        Marker: page?.NextMarker,
      }).promise();

      for (const listener of page.Listeners ?? []) {
        yield listener;
      }
    } while (page.NextMarker);
  }
}

/**
 * Determines if a listener matches the query filters.
 */
function listenerMatchesQueryFilter(listener: AWS.ELBv2.Listener, args: cxschema.LoadBalancerListenerContextQuery): boolean {
  if (args.listenerPort && listener.Port !== args.listenerPort) {
    // No match.
    return false;
  }

  if (args.listenerProtocol && listener.Protocol !== args.listenerProtocol) {
    // No match.
    return false;
  }

  return true;
}

/**
 * Returns a record of load balancers indexed by their arns
 */
function indexLoadBalancersByArn(loadBalancers: AWS.ELBv2.LoadBalancer[]): Record<string, AWS.ELBv2.LoadBalancer> {
  const loadBalancersByArn: Record<string, AWS.ELBv2.LoadBalancer> = {};

  for (const loadBalancer of loadBalancers) {
    loadBalancersByArn[loadBalancer.LoadBalancerArn!] = loadBalancer;
  }

  return loadBalancersByArn;
}
