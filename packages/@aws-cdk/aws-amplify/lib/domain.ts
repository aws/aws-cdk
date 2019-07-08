import { Certificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource, ResourceProps } from '@aws-cdk/core';
import { CfnDomain } from './amplify.generated';
import { IApp } from './app';

/**
 * Domain
 */
export class Domain extends Resource implements IDomain {
  /**
   * Arn
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * Certificate Record
   *
   * @attribute
   */
  public readonly certificateRecord: ICertificate;

  /**
   * Domain Name
   *
   * @attribute
   */
  public readonly domainName: string;

  /**
   * Domain Status
   *
   * @attribute
   */
  public readonly domainStatus: string;

  /**
   * Status Reason
   *
   * @attribute
   */
  public readonly statusReason: string;

  /**
   * Resource
   */
  private resource: CfnDomain;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id, props);

    const resource = new CfnDomain(scope, 'Domain', {
      appId: props.app.appId,
      domainName: props.domainName,
      subDomainSettings: props.subdomainSettings
    });

    this.arn = resource.attrArn;
    // return as ACM cert?
    this.certificateRecord = Certificate.fromCertificateArn(this, 'certificate', resource.attrCertificateRecord);
    this.domainName = resource.attrDomainName;
    this.domainStatus = resource.attrDomainStatus;
    this.statusReason = resource.attrStatusReason;

    this.resource = resource;
  }

  public addSubdomainSettings(prefix: string, branchName: string) {
    // do thing
  }
}

/**
 * Domain Properties
 */
export interface DomainProps extends ResourceProps {
  /**
   * App
   */
  readonly app: IApp;

  /**
   * Domain Name
   */
  readonly domainName: string;

  /**
   * Subdomain Settings
   */
  readonly subdomainSettings: SubdomainSettings[];
}

/**
 * Subdomain Settings
 */
export interface SubdomainSettings {
  readonly branchName: string;
  readonly prefix: string;
}

export interface IDomain extends IResource {}