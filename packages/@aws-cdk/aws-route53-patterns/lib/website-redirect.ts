import { DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontWebDistribution, OriginProtocolPolicy, PriceClass, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { ARecord, IHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket, RedirectProtocol } from '@aws-cdk/aws-s3';
import { Construct, Fn, RemovalPolicy } from '@aws-cdk/core';

export interface HTTPSRedirectProps {
  /**
   * HostedZone of the domain
   */
  readonly zone: IHostedZone;
  /**
   * The redirect target
   */
  readonly redirectTarget: string;
  /**
   * The domain name
   *
   * @default - the domain name of the zone
   */
  readonly domainName?: string;
  /**
   * The ARN of the certificate; Has to be in us-east-1
   *
   * @default - create a new certificate in us-east-1
   */
  readonly certificate?: ICertificate;
}

export class HTTPSRedirect extends Construct {
  constructor(scope: Construct, id: string, props: HTTPSRedirectProps) {
    super(scope, id);

    const domainName = props.domainName || props.zone.zoneName;

    const redirectCertArn = props.certificate ? props.certificate.certificateArn : new DnsValidatedCertificate(this, 'RedirectCertificate', {
      domainName,
      hostedZone: props.zone,
      region: 'us-east-1',
    }).certificateArn;

    const redirectBucket = new Bucket(this, 'RedirectBucket', {
      websiteRedirect: {
        hostName: props.redirectTarget,
        protocol: RedirectProtocol.HTTPS,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const redirectDist = new CloudFrontWebDistribution(this, 'RedirectDistribution', {
      originConfigs: [{
        behaviors: [{ isDefaultBehavior: true }],
        customOriginSource: {
          domainName: Fn.select(2, Fn.split('/', redirectBucket.bucketWebsiteUrl)),
          originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
        },
      }],
      aliasConfiguration: {
        acmCertRef: redirectCertArn,
        names: [domainName],
      },
      comment: `${domainName} Redirect to ${props.redirectTarget}`,
      priceClass: PriceClass.PRICE_CLASS_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    new ARecord(this, 'RedirectAliasRecord', {
      recordName: domainName,
      zone: props.zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(redirectDist)),
    });
  }
}