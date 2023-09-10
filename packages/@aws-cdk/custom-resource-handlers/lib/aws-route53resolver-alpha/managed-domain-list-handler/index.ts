import { Route53Resolver, FirewallDomainListMetadata } from '@aws-sdk/client-route53resolver';
import { makeHandler, HandlerResponse } from '../../nodejs-entrypoint';

const route53resolver = new Route53Resolver({});

export const handler = makeHandler(managedDomainListHandler);

export async function managedDomainListHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      const domainListName = event.ResourceProperties?.DomainListName;
      const result = await onCreateAndUpdate(domainListName);
      return result;
    case 'Delete':
      return;
  }
}

/**
 * Get ID of the managed domain list which has the provided name
 */
export async function onCreateAndUpdate(domainListName: string): Promise<HandlerResponse> {
  const domainLists = await listDomainLists();
  const domainListId = domainLists.find((domainList) =>
    domainList.ManagedOwnerName === 'Route 53 Resolver DNS Firewall'
    && domainList.Name === domainListName,
  )?.Id ?? undefined;

  if (!domainListId) {
    throw new Error(`Domain list with the name ${domainListName} could not be found.`);
  }
  return {
    Data: {
      DomainListId: domainListId,
    },
  };
}

/**
 * Get all domain lists recursively
 */
async function listDomainLists(nextToken? :string): Promise<FirewallDomainListMetadata[]> {
  const result = await route53resolver.listFirewallDomainLists({ NextToken: nextToken });
  const domainLists: FirewallDomainListMetadata[] = result.FirewallDomainLists ?? [];
  if (result.NextToken) {
    return domainLists.concat(await listDomainLists(result.NextToken));
  } else {
    return domainLists;
  }
}