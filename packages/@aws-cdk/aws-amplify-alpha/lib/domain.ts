import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Lazy, Resource, IResolvable, Token, ValidationError } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnDomain } from 'aws-cdk-lib/aws-amplify';
import { IApp } from './app';
import { IBranch } from './branch';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

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

  /**
   * Automatically create subdomains for connected branches
   *
   * @default false
   */
  readonly enableAutoSubdomain?: boolean;

  /**
   * Branches which should automatically create subdomains
   *
   * @default - all repository branches ['*', 'pr*']
   */
  readonly autoSubdomainCreationPatterns?: string[];

  /**
   * The type of SSL/TLS certificate to use for your custom domain
   *
   * @default - Amplify uses the default certificate that it provisions and manages for you
   */
  readonly customCertificate?: acm.ICertificate;
}

/**
 * Properties for a Domain
 */
export interface DomainProps extends DomainOptions {
  /**
   * The application to which the domain must be connected
   */
  readonly app: IApp;

  /**
   * The IAM role with access to Route53 when using enableAutoSubdomain
   * @default the IAM role from App.grantPrincipal
   */
  readonly autoSubDomainIamRole?: iam.IRole;
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

  /**
   * Branch patterns for the automatically created subdomain.
   *
   * @attribute
   */
  public readonly domainAutoSubDomainCreationPatterns: string[];

  /**
   * The IAM service role for the subdomain.
   *
   * @attribute
   */
  public readonly domainAutoSubDomainIamRole: string;

  /**
   * Specifies whether the automated creation of subdomains for branches is enabled.
   *
   * @attribute
   */
  public readonly domainEnableAutoSubDomain: IResolvable;

  private readonly subDomains: SubDomain[];

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.subDomains = props.subDomains || [];

    const domainName = props.domainName || id;
    if (!Token.isUnresolved(domainName) && domainName.length > 255) {
      throw new ValidationError(`Domain name must be 255 characters or less, got: ${domainName.length} characters.`, this);
    }
    if (!Token.isUnresolved(domainName) && !/^(((?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9])\.)+((?!-)[A-Za-z0-9-]{1,62}[A-Za-z0-9])(\.)?$/.test(domainName)) {
      throw new ValidationError(`Domain name must be a valid hostname, got: ${domainName}.`, this);
    }

    const domain = new CfnDomain(this, 'Resource', {
      appId: props.app.appId,
      domainName,
      subDomainSettings: Lazy.any({ produce: () => this.renderSubDomainSettings() }, { omitEmptyArray: true }),
      enableAutoSubDomain: !!props.enableAutoSubdomain,
      autoSubDomainCreationPatterns: props.autoSubdomainCreationPatterns || ['*', 'pr*'],
      autoSubDomainIamRole: props.autoSubDomainIamRole?.roleArn,
      certificateSettings: props.customCertificate ? {
        certificateType: 'CUSTOM',
        customCertificateArn: props.customCertificate.certificateArn,
      } : undefined,
    });

    this.arn = domain.attrArn;
    this.certificateRecord = domain.attrCertificateRecord;
    this.domainName = domain.attrDomainName;
    this.domainStatus = domain.attrDomainStatus;
    this.statusReason = domain.attrStatusReason;
    this.domainAutoSubDomainCreationPatterns = domain.attrAutoSubDomainCreationPatterns;
    this.domainAutoSubDomainIamRole = domain.attrAutoSubDomainIamRole;
    this.domainEnableAutoSubDomain = domain.attrEnableAutoSubDomain;

    this.node.addValidation({ validate: () => this.validateDomain() });
  }

  /**
   * Maps a branch to a sub domain
   *
   * @param branch The branch
   * @param prefix The prefix. Use '' to map to the root of the domain. Defaults to branch name.
   */
  @MethodMetadata()
  public mapSubDomain(branch: IBranch, prefix?: string) {
    this.subDomains.push({ branch, prefix });
    return this;
  }

  /**
   * Maps a branch to the domain root
   */
  @MethodMetadata()
  public mapRoot(branch: IBranch) {
    return this.mapSubDomain(branch, '');
  }

  private validateDomain() {
    if (this.subDomains.length === 0) {
      return ['The domain doesn\'t contain any subdomains'];
    }

    return [];
  }

  private renderSubDomainSettings() {
    return this.subDomains.map(s => ({
      branchName: s.branch.branchName,
      prefix: s.prefix ?? s.branch.branchName,
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
