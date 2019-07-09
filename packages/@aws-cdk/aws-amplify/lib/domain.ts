import { Certificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResolvable, IResolveContext, IResource, Resource, ResourceProps } from '@aws-cdk/core';
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

  private readonly subdomainSettingsResolver: SubdomainSettingsResolver = new SubdomainSettingsResolver();

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id, props);

    if (props.subdomainSettings) {
      this.subdomainSettingsResolver.addSubdomains(...props.subdomainSettings);
    }

    const resource = new CfnDomain(scope, 'Domain', {
      appId: props.app.appId,
      domainName: props.domainName,
      subDomainSettings: this.subdomainSettingsResolver
    });

    this.arn = resource.attrArn;
    this.certificateRecord = Certificate.fromCertificateArn(this, 'certificate', resource.attrCertificateRecord);
    this.domainName = resource.attrDomainName;
    this.domainStatus = resource.attrDomainStatus;
    this.statusReason = resource.attrStatusReason;
  }

  public addSubdomainSettings(prefix: string, branchName: string) {
    this.subdomainSettingsResolver.addSubdomains({
      prefix,
      branchName
    });
  }

  public validate(): string[] {
    const errors: string[] = [];

    if (this.subdomainSettingsResolver.isEmpty()) {
      errors.push(`You must specify subdomain settings`);
    }

    return errors;
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
   *
   * @default Empty
   */
  readonly subdomainSettings?: SubdomainSettings[];
}

/**
 * Subdomain Settings
 */
export interface SubdomainSettings {
  readonly branchName: string;
  readonly prefix: string;
}

/**
 * Domain Interface
 */
export interface IDomain extends IResource {
  /**
   * Arn
   *
   * @attribute
   */
  readonly arn: string;
}

class SubdomainSettingsResolver implements IResolvable {
  public readonly creationStack: string[];
  private readonly subdomainSettings: SubdomainSettings[] = new Array<SubdomainSettings>();

  public resolve(_context: IResolveContext): any {
    return this.subdomainSettings;
  }

  public addSubdomains(...subdomain: SubdomainSettings[]) {
    this.subdomainSettings.push(...subdomain);
  }

  public count(): number {
    return this.subdomainSettings.length;
  }

  public isEmpty(): boolean {
    return this.subdomainSettings.length === 0;
  }
}