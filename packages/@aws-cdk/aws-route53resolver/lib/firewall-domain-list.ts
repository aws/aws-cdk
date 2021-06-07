import { IResource, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnFirewallDomainList } from './route53resolver.generated';

/**
 * A Firewall Domain List
 */
export interface IFirewallDomainList extends IResource {
  /**
   * The ID of the domain list
   *
   * @attribute
   */
  readonly firewallDomainListId: string;
}

/**
 * Properties for a Firewall Domain List
 */
export interface FirewallDomainListProps {
  /**
   * A name for the domain list
   *
   * @default - a CloudFormation generated name
   */
  readonly name?: string;

  /**
   * A list of domains
   */
  readonly domains: FirewallDomains;
}

/**
 * A list of domains
 */
export abstract class FirewallDomains {
  /**
   * Firewall domains created from a list
   *
   * @param list the list of domains
   */
  public static fromList(list: string[]): FirewallDomains {
    return { list };
  }

  /**
   * Firewall domains created from a file stored in Amazon S3.
   * The file must be a text file and must contain a single domain per line.
   *
   * @param s3Uri S3 bucket uri (s3://bucket/prefix/objet).
   */
  public static fromS3Uri(s3Uri: string): FirewallDomains {
    if (!Token.isUnresolved(s3Uri) && !s3Uri.startsWith('s3://')) {
      throw new Error(`The S3 URI must start with s3://, got ${s3Uri}`);
    }

    return { s3Uri };
  }

  /** S3 bucket URI of text file with domain list */
  public abstract s3Uri?: string;

  /** List of domains */
  public abstract readonly list?: string[];
}

/**
 * A Firewall Domain List
 */
export class FirewallDomainList extends Resource implements IFirewallDomainList {
  /**
   * Import an existing Firewall Rule Group
   */
  public static fromFirewallDomainListId(scope: Construct, id: string, firewallDomainListId: string): IFirewallDomainList {
    class Import extends Resource implements IFirewallDomainList {
      public readonly firewallDomainListId = firewallDomainListId;
    }
    return new Import(scope, id);
  }

  public readonly firewallDomainListId: string;

  /**
   * The ARN (Amazon Resource Name) of the domain list
   * @attribute
   */
  public readonly firewallDomainListArn: string;

  /**
    * The date and time that the domain list was created
    * @attribute
    */
  public readonly firewallDomainListCreationTime: string;

  /**
    * The creator request ID
    * @attribute
    */
  public readonly firewallDomainListCreatorRequestId: string;

  /**
    * The number of domains in the list
    * @attribute
    */
  public readonly firewallDomainListDomainCount: number;

  /**
    * The owner of the list, used only for lists that are not managed by you.
    * For example, the managed domain list `AWSManagedDomainsMalwareDomainList`
    * has the managed owner name `Route 53 Resolver DNS Firewall`.
    * @attribute
    */
  public readonly firewallDomainListManagedOwnerName: string;

  /**
    * The date and time that the domain list was last modified
    * @attribute
    */
  public readonly firewallDomainListModificationTime: string;

  /**
    * The status of the domain list
    * @attribute
    */
  public readonly firewallDomainListStatus: string;

  /**
    * Additional information about the status of the rule group
    * @attribute
    */
  public readonly firewallDomainListStatusMessage: string;

  constructor(scope: Construct, id: string, props: FirewallDomainListProps) {
    super(scope, id);

    const domainList = new CfnFirewallDomainList(this, 'Resource', {
      name: props.name,
      domainFileUrl: props.domains.s3Uri,
      domains: props.domains.list,
    });

    this.firewallDomainListId = domainList.attrId;
    this.firewallDomainListArn = domainList.attrArn;
    this.firewallDomainListCreationTime = domainList.attrCreationTime;
    this.firewallDomainListCreatorRequestId = domainList.attrCreatorRequestId;
    this.firewallDomainListDomainCount = domainList.attrDomainCount;
    this.firewallDomainListManagedOwnerName = domainList.attrManagedOwnerName;
    this.firewallDomainListModificationTime = domainList.attrModificationTime;
    this.firewallDomainListStatus = domainList.attrStatus;
    this.firewallDomainListStatusMessage = domainList.attrStatusMessage;
  }
}