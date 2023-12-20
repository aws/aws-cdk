import { Construct } from 'constructs';
import { CertificateProps, ICertificate } from './certificate';
import { CertificateBase } from './certificate-base';
import * as iam from '../../aws-iam';
import * as route53 from '../../aws-route53';
import * as cdk from '../../core';
import { Token } from '../../core';
import { CertificateRequestCertificateRequestFunction } from '../../custom-resource-handlers/dist/aws-certificatemanager/certificate-request-provider.generated';

/**
 * Properties to create a DNS validated certificate managed by AWS Certificate Manager
 *
 */
export interface DnsValidatedCertificateProps extends CertificateProps {
  /**
   * Route 53 Hosted Zone used to perform DNS validation of the request.  The zone
   * must be authoritative for the domain name specified in the Certificate Request.
   */
  readonly hostedZone: route53.IHostedZone;
  /**
   * AWS region that will host the certificate. This is needed especially
   * for certificates used for CloudFront distributions, which require the region
   * to be us-east-1.
   *
   * @default the region the stack is deployed in.
   */
  readonly region?: string;

  /**
   * An endpoint of Route53 service, which is not necessary as AWS SDK could figure
   * out the right endpoints for most regions, but for some regions such as those in
   * aws-cn partition, the default endpoint is not working now, hence the right endpoint
   * need to be specified through this prop.
   *
   * Route53 is not been officially launched in China, it is only available for AWS
   * internal accounts now. To make DnsValidatedCertificate work for internal accounts
   * now, a special endpoint needs to be provided.
   *
   * @default - The AWS SDK will determine the Route53 endpoint to use based on region
   */
  readonly route53Endpoint?: string;

  /**
   * Role to use for the custom resource that creates the validated certificate
   *
   * @default - A new role will be created
   */
  readonly customResourceRole?: iam.IRole;

  /**
   * When set to true, when the DnsValidatedCertificate is deleted,
   * the associated Route53 validation records are removed.
   *
   * CAUTION: If multiple certificates share the same domains (and same validation records),
   * this can cause the other certificates to fail renewal and/or not validate.
   * Not recommended for production use.
   *
   * @default false
   */
  readonly cleanupRoute53Records?: boolean;
}

/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 *
 * @resource AWS::CertificateManager::Certificate
 * @deprecated use {@link Certificate} instead
 */
export class DnsValidatedCertificate extends CertificateBase implements ICertificate, cdk.ITaggable {
  public readonly certificateArn: string;

  /**
  * Resource Tags.
  * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-tags
  */

  public readonly tags: cdk.TagManager;
  protected readonly region?: string;
  private normalizedZoneName: string;
  private hostedZoneId: string;
  private domainName: string;
  private _removalPolicy?: cdk.RemovalPolicy;

  constructor(scope: Construct, id: string, props: DnsValidatedCertificateProps) {
    super(scope, id);

    this.region = props.region;
    this.domainName = props.domainName;
    // check if domain name is 64 characters or less
    if (!Token.isUnresolved(props.domainName) && props.domainName.length > 64) {
      throw new Error('Domain name must be 64 characters or less');
    }
    this.normalizedZoneName = props.hostedZone.zoneName;
    // Remove trailing `.` from zone name
    if (this.normalizedZoneName.endsWith('.')) {
      this.normalizedZoneName = this.normalizedZoneName.substring(0, this.normalizedZoneName.length - 1);
    }
    // Remove any `/hostedzone/` prefix from the Hosted Zone ID
    this.hostedZoneId = props.hostedZone.hostedZoneId.replace(/^\/hostedzone\//, '');
    this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::CertificateManager::Certificate');

    let certificateTransparencyLoggingPreference: string | undefined;
    if (props.transparencyLoggingEnabled !== undefined) {
      certificateTransparencyLoggingPreference = props.transparencyLoggingEnabled ? 'ENABLED' : 'DISABLED';
    }

    const requestorFunction = new CertificateRequestCertificateRequestFunction(this, 'CertificateRequestorFunction', {
      timeout: cdk.Duration.minutes(15),
      role: props.customResourceRole,
    });
    requestorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['acm:RequestCertificate', 'acm:DescribeCertificate', 'acm:DeleteCertificate', 'acm:AddTagsToCertificate'],
      resources: ['*'],
    }));
    requestorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['route53:GetChange'],
      resources: ['*'],
    }));
    requestorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['route53:changeResourceRecordSets'],
      resources: [`arn:${cdk.Stack.of(requestorFunction).partition}:route53:::hostedzone/${this.hostedZoneId}`],
      conditions: {
        'ForAllValues:StringEquals': {
          'route53:ChangeResourceRecordSetsRecordTypes': ['CNAME'],
          'route53:ChangeResourceRecordSetsActions': props.cleanupRoute53Records ? ['UPSERT', 'DELETE'] : ['UPSERT'],
        },
        'ForAllValues:StringLike': {
          'route53:ChangeResourceRecordSetsNormalizedRecordNames': [
            addWildcard(props.domainName),
            ...(props.subjectAlternativeNames ?? []).map(d => addWildcard(d)),
          ],
        },
      },
    }));

    const certificate = new cdk.CustomResource(this, 'CertificateRequestorResource', {
      serviceToken: requestorFunction.functionArn,
      properties: {
        DomainName: props.domainName,
        SubjectAlternativeNames: cdk.Lazy.list({ produce: () => props.subjectAlternativeNames }, { omitEmpty: true }),
        CertificateTransparencyLoggingPreference: certificateTransparencyLoggingPreference,
        HostedZoneId: this.hostedZoneId,
        Region: props.region,
        Route53Endpoint: props.route53Endpoint,
        RemovalPolicy: cdk.Lazy.any({ produce: () => this._removalPolicy }),
        // Custom resources properties are always converted to strings; might as well be explict here.
        CleanupRecords: props.cleanupRoute53Records ? 'true' : undefined,
        Tags: cdk.Lazy.list({ produce: () => this.tags.renderTags() }),
      },
    });

    this.certificateArn = certificate.getAtt('Arn').toString();

    this.node.addValidation({ validate: () => this.validateDnsValidatedCertificate() });
  }

  public applyRemovalPolicy(policy: cdk.RemovalPolicy): void {
    this._removalPolicy = policy;
  }

  private validateDnsValidatedCertificate(): string[] {
    const errors: string[] = [];
    // Ensure the zone name is a parent zone of the certificate domain name
    if (!cdk.Token.isUnresolved(this.normalizedZoneName) &&
      this.domainName !== this.normalizedZoneName &&
      !this.domainName.endsWith('.' + this.normalizedZoneName)) {
      errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${this.domainName}`);
    }
    return errors;
  }
}

// https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html
function addWildcard(domainName: string) {
  if (domainName.startsWith('*.')) {
    return domainName;
  }
  return `*.${domainName}`;
}
