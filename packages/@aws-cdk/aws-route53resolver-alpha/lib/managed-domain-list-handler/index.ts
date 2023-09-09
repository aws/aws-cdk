import { Route53ResolverClient, FirewallDomainListMetadata, ListFirewallDomainListsCommand } from '@aws-sdk/client-route53resolver';

const client = new Route53ResolverClient({});

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<AWSLambda.CloudFormationCustomResourceResponse> {
  const domainListName = event.ResourceProperties.DomainListName;

  try {
    const domainListId = await getDomainListId(domainListName);
    if (domainListId) {
      return {
        ...event,
        Status: 'SUCCESS',
        PhysicalResourceId: domainListName,
        Data: {
          DomainListId: domainListId,
        },
      };
    } else {
      return {
        ...event,
        Status: 'FAILED',
        Reason: `Domain list with the name ${domainListName} could not be found.`,
        PhysicalResourceId: domainListName,
      };
    }
  } catch (e: any) {
    return {
      ...event,
      Status: 'FAILED',
      Reason: e.message,
      PhysicalResourceId: domainListName,
    };
  }
}

/**
 * Get ID of the managed domain list with a certain name
 */
async function getDomainListId(domainListName: string): Promise<string | undefined> {
  const domainLists = await listDomainLists();
  return domainLists.find((domainList) =>
    domainList.ManagedOwnerName === 'Route 53 Resolver DNS Firewall'
    && domainList.Name === domainListName,
  )?.Id ?? undefined;
}

/**
 * Get all domain lists recursively
 */
async function listDomainLists(nextToken? :string): Promise<FirewallDomainListMetadata[]> {
  const command = new ListFirewallDomainListsCommand({ NextToken: nextToken });
  const result = await client.send(command);
  const domainLists: FirewallDomainListMetadata[] = result.FirewallDomainLists ?? [];
  if (result.NextToken) {
    return domainLists.concat(await listDomainLists(result.NextToken));
  } else {
    return domainLists;
  }
}