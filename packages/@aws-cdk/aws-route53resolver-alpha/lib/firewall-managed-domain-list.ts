import * as path from 'path';
import { Resource, CustomResourceProvider, CustomResource, CustomResourceProviderRuntime } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IFirewallDomainList } from './firewall-domain-list';

/**
 * Properties for a Firewall Managed Domain List
 */
export interface FirewallManagedDomainListProps {
  /**
   * The managed domain list
   */
  readonly managedDomainList: ManagedDomain;
}

/**
 * A Firewall Managed Domain List
 */
export class FirewallManagedDomainList extends Resource implements IFirewallDomainList {
  public readonly firewallDomainListId: string;

  constructor(scope: Construct, id: string, props: FirewallManagedDomainListProps) {
    super(scope, id);

    const GET_MANAGED_DOMAIN_LIST_TYPE = 'Custom::Route53ResolverManagedDomainList';
    const provider = CustomResourceProvider.getOrCreateProvider(this, GET_MANAGED_DOMAIN_LIST_TYPE, {
      codeDirectory: path.join(__dirname, '..', '..',
        'custom-resource-handlers', 'dist', 'aws-route53resolver-alpha', 'managed-domain-list-handler'),
      useCfnResponseWrapper: false,
      runtime: CustomResourceProviderRuntime.NODEJS_18_X,
      description: 'Lambda function for getting route 53 resolver managed domain list ID',
      policyStatements: [{
        Effect: 'Allow',
        Action: ['route53resolver:ListFirewallDomainLists'],
        Resource: '*',
      }],
    });

    const result = new CustomResource(this, 'GetDomainListCustomResource', {
      resourceType: GET_MANAGED_DOMAIN_LIST_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        DomainListName: props.managedDomainList,
      },
    });

    this.firewallDomainListId = result.getAttString('DomainListId');
  }
}

/**
 * Managed Domain Lists
 *
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-dns-firewall-managed-domain-lists.html
 */
export enum ManagedDomain {
  /**
   * Domains associated with multiple DNS threat categories including malware, ransomware, botnet, spyware,
   * and DNS tunneling to help block multiple types of threats.
   * Includes the `AmazonGuardDutyThreatList.`
   */
  AGGREGATE_THREAT_LIST = 'AWSManagedDomainsAggregateThreatList',

  /**
   * Domains associated with Amazon GuardDuty DNS security findings.
   * The domains are sourced from the GuardDuty's threat intelligence systems only,
   * and do not contain domains sourced from external third-party sources.
   */
  AMAZON_GUARDDUTY_THREAT_LIST = 'AWSManagedDomainsAmazonGuardDutyThreatList',

  /**
   * Domains associated with controlling networks of computers that are infected with spamming malware.
   */
  BOTNET_COMMANDAND_CONTROL = 'AWSManagedDomainsBotnetCommandandControl',

  /**
   * Domains associated with sending malware, hosting malware, or distributing malware.
   */
  MALWARE_DOMAIN_LIST = 'AWSManagedDomainsMalwareDomainList',
}
