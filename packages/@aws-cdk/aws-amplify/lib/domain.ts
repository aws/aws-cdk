import { Construct, Lazy, Resource } from '@aws-cdk/core';
import { CfnDomain } from './amplify.generated';
import { IApp } from './app';
import { IBranch } from './branch';

/**
 * Options to add a domain to an application
 */
export interface DomainOptions {
  /**
   * The name of the domain
   *
   * @default - the construct's id
   */
  readonly domainName?: string;

  /**
   * Subdomains
   *
   * @default - use `addSubDomain()` to add subdomains
   */
  readonly subDomains?: SubDomain[];
}

/**
 * Properties for a Domain
 */
export interface DomainProps extends DomainOptions {
  /**
   * The application to which the domain must be connected
   */
  readonly app: IApp;
}

/**
 * An Amplify Console domain
 */
export class Domain extends Resource {

  /**
   * The ARN of the domain
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * The DNS Record for certificate verification
   *
   * @attribute
   */
  public readonly certificateRecord: string;

  /**
   * The name of the domain
   *
   * @attribute
   */
  public readonly domainName: string;

  /**
   * The status of the domain association
   *
   * @attribute
   */
  public readonly domainStatus: string;

  /**
   * The reason for the current status of the domain
   *
   * @attribute
   */
  public readonly statusReason: string;

  private readonly subDomains: SubDomain[];

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);

    this.subDomains = props.subDomains || [];

    const domainName = props.domainName || id;
    const domain = new CfnDomain(this, 'Resource', {
      appId: props.app.appId,
      domainName,
      subDomainSettings: Lazy.anyValue({ produce: () => this.renderSubDomainSettings() }, { omitEmptyArray: true }),
    });

    this.arn = domain.attrArn;
    this.certificateRecord = domain.attrCertificateRecord;
    this.domainName = domain.attrDomainName;
    this.domainStatus = domain.attrDomainStatus;
    this.statusReason = domain.attrStatusReason;
  }

  /**
   * Maps a branch to a sub domain
   *
   * @param branch The branch
   * @param prefix The prefix. Use '' to map to the root of the domain. Defaults to branch name.
   */
  public mapSubDomain(branch: IBranch, prefix?: string) {
    this.subDomains.push({ branch, prefix });
    return this;
  }

  /**
   * Maps a branch to the domain root
   */
  public mapRoot(branch: IBranch) {
    return this.mapSubDomain(branch, '');
  }

  protected validate() {
    if (this.subDomains.length === 0) {
      return ['The domain doesn\'t contain any subdomains'];
    }

    return [];
  }

  private renderSubDomainSettings() {
    return this.subDomains.map(s => ({
      branchName: s.branch.branchName,
      prefix: s.prefix === undefined ? s.branch.branchName : s.prefix,
    }));
  }
}

/**
 * Sub domain settings
 */
export interface SubDomain {
  /**
   * The branch
   */
  readonly branch: IBranch;

  /**
   * The prefix. Use '' to map to the root of the domain
   *
   * @default - the branch name
   */
  readonly prefix?: string;
}
