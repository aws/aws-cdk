import { Construct, IResolvable, IResolveContext, IResource, Resource } from '@aws-cdk/core';
import { CfnDomain } from './amplify.generated';
import { IApp } from './app';

/**
 * Domain resource allows you to connect a custom domain to your app.
 */
export class Domain extends Resource implements IDomain {
  /**
   * ARN for the Domain Association.
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * DNS Record for certificate verification.
   *
   * @attribute
   */
  public readonly certificateRecord: string;

  /**
   * Name of the domain
   *
   * @attribute
   */
  public readonly domainName: string;

  /**
   * Status fo the Domain Association.
   *
   * @attribute
   */
  public readonly domainStatus: string;

  /**
   * Reason for the current status of the domain.
   *
   * @attribute
   */
  public readonly statusReason: string;

  private readonly subdomainSettingsResolver: SubdomainSettingsResolver = new SubdomainSettingsResolver();

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id, {
      physicalName: props.domainName
    });

    if (props.subdomainSettings) {
      this.subdomainSettingsResolver.addSubdomains(...props.subdomainSettings);
    }

    const resource = new CfnDomain(this, 'Domain', {
      appId: props.app.appId,
      domainName: this.physicalName,
      subDomainSettings: this.subdomainSettingsResolver
    });

    this.arn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'amplify',
      resource: 'apps',
      resourceName: `${props.app.appId}/domains/${this.domainName}`
    });

    this.certificateRecord = resource.attrCertificateRecord;
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
export interface DomainProps extends DomainBaseProps {
  /**
   * Amplify App
   */
  readonly app: IApp;
}

/**
 * Domain Properties
 */
export interface DomainBaseProps {
  /**
   * Domain name for the Domain Association.
   */
  readonly domainName: string;

  /**
   * Setting structure for the Subdomain.
   *
   * @default - No subdomain settings
   */
  readonly subdomainSettings?: SubdomainSettings[];
}

/**
 * The SubDomainSetting property type allows you to connect a subdomain (e.g. foo.yourdomain.com) to a specific branch.
 */
export interface SubdomainSettings {
  /**
   * Branch name setting for the Subdomain.
   */
  readonly branchName: string;

  /**
   * Prefix setting for the Subdomain.
   */
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

export class SubdomainSettingsResolver implements IResolvable {
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