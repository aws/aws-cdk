import { DnsValidatedCertificate, ICertificate, Certificate, CertificateValidation } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontWebDistribution, OriginProtocolPolicy, PriceClass, ViewerCertificate, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { ARecord, AaaaRecord, IHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { BlockPublicAccess, Bucket, RedirectProtocol } from '@aws-cdk/aws-s3';
import { ArnFormat, RemovalPolicy, Stack, Token, FeatureFlags } from '@aws-cdk/core';
import { md5hash } from '@aws-cdk/core/lib/helpers-internal';
import { ROUTE53_PATTERNS_USE_CERTIFICATE } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';

/**
 * Properties to configure an HTTPS Redirect
 */
export interface HttpsRedirectProps {
  /**
   * Hosted zone of the domain which will be used to create alias record(s) from
   * domain names in the hosted zone to the target domain. The hosted zone must
   * contain entries for the domain name(s) supplied through `recordNames` that
   * will redirect to the target domain.
   *
   * Domain names in the hosted zone can include a specific domain (example.com)
   * and its subdomains (acme.example.com, zenith.example.com).
   *
   */
  readonly zone: IHostedZone;

  /**
   * The redirect target fully qualified domain name (FQDN). An alias record
   * will be created that points to your CloudFront distribution. Root domain
   * or sub-domain can be supplied.
   */
  readonly targetDomain: string;

  /**
   * The domain names that will redirect to `targetDomain`
   *
   * @default - the domain name of the hosted zone
   */
  readonly recordNames?: string[];

  /**
   * The AWS Certificate Manager (ACM) certificate that will be associated with
   * the CloudFront distribution that will be created. If provided, the certificate must be
   * stored in us-east-1 (N. Virginia)
   *
   * @default - A new certificate is created in us-east-1 (N. Virginia)
   */
  readonly certificate?: ICertificate;
}

/**
 * Allows creating a domainA -> domainB redirect using CloudFront and S3.
 * You can specify multiple domains to be redirected.
 */
export class HttpsRedirect extends Construct {
  constructor(scope: Construct, id: string, props: HttpsRedirectProps) {
    super(scope, id);

    const domainNames = props.recordNames ?? [props.zone.zoneName];

    if (props.certificate) {
      const certificateRegion = Stack.of(this).splitArn(props.certificate.certificateArn, ArnFormat.SLASH_RESOURCE_NAME).region;
      if (!Token.isUnresolved(certificateRegion) && certificateRegion !== 'us-east-1') {
        throw new Error(`The certificate must be in the us-east-1 region and the certificate you provided is in ${certificateRegion}.`);
      }
    }
    const redirectCert = this.createCertificate(domainNames, props.zone, props.certificate);

    const redirectBucket = new Bucket(this, 'RedirectBucket', {
      websiteRedirect: {
        hostName: props.targetDomain,
        protocol: RedirectProtocol.HTTPS,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    const redirectDist = new CloudFrontWebDistribution(this, 'RedirectDistribution', {
      defaultRootObject: '',
      originConfigs: [{
        behaviors: [{ isDefaultBehavior: true }],
        customOriginSource: {
          domainName: redirectBucket.bucketWebsiteDomainName,
          originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
        },
      }],
      viewerCertificate: ViewerCertificate.fromAcmCertificate(redirectCert, {
        aliases: domainNames,
      }),
      comment: `Redirect to ${props.targetDomain} from ${domainNames.join(', ')}`,
      priceClass: PriceClass.PRICE_CLASS_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    domainNames.forEach((domainName) => {
      const hash = md5hash(domainName).slice(0, 6);
      const aliasProps = {
        recordName: domainName,
        zone: props.zone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(redirectDist)),
      };
      new ARecord(this, `RedirectAliasRecord${hash}`, aliasProps);
      new AaaaRecord(this, `RedirectAliasRecordSix${hash}`, aliasProps);
    });
  }

  /**
   * Gets the stack to use for creating the Certificate
   * If the current stack is not in `us-east-1` then this
   * will create a new `us-east-1` stack.
   */
  private get certificateScope(): Construct {
    const stack = Stack.of(this);
    const parent = stack.node.scope;
    if (!parent) {
      throw new Error(`Stack ${stack.stackId} must be created in the scope of an App or Stage`);
    }
    if (Token.isUnresolved(stack.region)) {
      throw new Error(`When ${ROUTE53_PATTERNS_USE_CERTIFICATE} is enabled, a region must be defined on the Stack`);
    }
    if (stack.region !== 'us-east-1') {
      const stackId = `certificate-redirect-stack-${stack.node.addr}`;
      const certStack = parent.node.tryFindChild(stackId) as Stack;
      return certStack ?? new Stack(parent, stackId, {
        env: { region: 'us-east-1', account: stack.account },
      });
    }
    return this;
  }

  /**
   * Creates a certificate.
   *
   * If the `ROUTE53_PATTERNS_USE_CERTIFICATE` feature flag is set then
   * this will use the `Certificate` class otherwise it will use the
   * `DnsValidatedCertificate` class
   *
   * This is also safe to upgrade since the new certificate will be created and updated
   * on the CloudFront distribution before the old one is deleted.
   */
  private createCertificate(domainNames: string[], zone: IHostedZone, certificate?: ICertificate): ICertificate {
    if (certificate) return certificate;
    const useCertificate = FeatureFlags.of(this).isEnabled(ROUTE53_PATTERNS_USE_CERTIFICATE);
    if (useCertificate) {
      const id = this.certificateScope === this ? 'RedirectCertificate' : 'RedirectCertificate'+this.node.addr;
      return new Certificate(this.certificateScope, id, {
        domainName: domainNames[0],
        subjectAlternativeNames: domainNames,
        validation: CertificateValidation.fromDns(zone),
      });
    } else {
      return new DnsValidatedCertificate(this, 'RedirectCertificate', {
        domainName: domainNames[0],
        subjectAlternativeNames: domainNames,
        hostedZone: zone,
        region: 'us-east-1',
      });
    }
  }
}
