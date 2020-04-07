import * as cfn from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import { CertificateProps, ICertificate } from './certificate';

/**
 * @experimental
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
   * Route53 is not been offically launched in China, it is only available for AWS
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
}

/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 *
 * @resource AWS::CertificateManager::Certificate
 * @experimental
 */
export class DnsValidatedCertificate extends cdk.Resource implements ICertificate {
  public readonly certificateArn: string;
  private normalizedZoneName: string;
  private hostedZoneId: string;
  private domainName: string;

  constructor(scope: cdk.Construct, id: string, props: DnsValidatedCertificateProps) {
    super(scope, id);

    this.domainName = props.domainName;
    this.normalizedZoneName = props.hostedZone.zoneName;
    // Remove trailing `.` from zone name
    if (this.normalizedZoneName.endsWith('.')) {
      this.normalizedZoneName = this.normalizedZoneName.substring(0, this.normalizedZoneName.length - 1);
    }

    // Remove any `/hostedzone/` prefix from the Hosted Zone ID
    this.hostedZoneId = props.hostedZone.hostedZoneId.replace(/^\/hostedzone\//, '');

    const requestorFunction = new lambda.Function(this, 'CertificateRequestorFunction', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'lambda-packages', 'dns_validated_certificate_handler', 'lib')),
      handler: 'index.certificateRequestHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: cdk.Duration.minutes(15),
      role: props.customResourceRole
    });
    requestorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['acm:RequestCertificate', 'acm:DescribeCertificate', 'acm:DeleteCertificate'],
      resources: ['*'],
    }));
    requestorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['route53:GetChange'],
      resources: ['*'],
    }));
    requestorFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['route53:changeResourceRecordSets'],
      resources: [`arn:${cdk.Stack.of(requestorFunction).partition}:route53:::hostedzone/${this.hostedZoneId}`],
    }));

    const certificate = new cfn.CustomResource(this, 'CertificateRequestorResource', {
      provider: cfn.CustomResourceProvider.lambda(requestorFunction),
      properties: {
        DomainName: props.domainName,
        SubjectAlternativeNames: cdk.Lazy.listValue({ produce: () => props.subjectAlternativeNames }, { omitEmpty: true }),
        HostedZoneId: this.hostedZoneId,
        Region: props.region,
        Route53Endpoint: props.route53Endpoint,
      }
    });

    this.certificateArn = certificate.getAtt('Arn').toString();
  }

  protected validate(): string[] {
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
