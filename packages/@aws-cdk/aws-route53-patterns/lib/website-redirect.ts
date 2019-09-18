import { DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontWebDistribution, OriginProtocolPolicy, PriceClass, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { ARecord, IHostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket, RedirectProtocol } from '@aws-cdk/aws-s3';
import { Construct, RemovalPolicy } from '@aws-cdk/core';
import * as crypto from 'crypto';

export interface HttpsRedirectProps {
  /**
   * HostedZone of the domain
   */
  readonly zone: IHostedZone;
  /**
   * The redirect target domain
   */
  readonly targetDomain: string;
  /**
   * The domain names to create that will redirect to `targetDomain`
   *
   * @default - the domain name of the zone
   */
  readonly recordNames?: string[];
  /**
   * The ACM certificate; Has to be in us-east-1
   *
   * @default - create a new certificate in us-east-1
   */
  readonly certificate?: ICertificate;
}

export class HttpsRedirect extends Construct {
  constructor(scope: Construct, id: string, props: HttpsRedirectProps) {
    super(scope, id);

    const domainNames = props.recordNames || [props.zone.zoneName];

    const redirectCertArn = props.certificate ? props.certificate.certificateArn : new DnsValidatedCertificate(this, 'RedirectCertificate', {
      domainName: domainNames[0],
      subjectAlternativeNames: domainNames,
      hostedZone: props.zone,
      region: 'us-east-1',
    }).certificateArn;

    const redirectBucket = new Bucket(this, 'RedirectBucket', {
      websiteRedirect: {
        hostName: props.targetDomain,
        protocol: RedirectProtocol.HTTPS,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const redirectDist = new CloudFrontWebDistribution(this, 'RedirectDistribution', {
      originConfigs: [{
        behaviors: [{ isDefaultBehavior: true }],
        customOriginSource: {
          domainName: redirectBucket.bucketWebsiteDomainName,
          originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
        },
      }],
      aliasConfiguration: {
        acmCertRef: redirectCertArn,
        names: domainNames,
      },
      comment: `Redirect to ${props.targetDomain} from ${domainNames.join(', ')}`,
      priceClass: PriceClass.PRICE_CLASS_ALL,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    domainNames.forEach((domainName) => {
      const hash = crypto.createHash('md5').update(domainName).digest("hex").substr(0, 6);
      new ARecord(this, `RedirectAliasRecord${hash}`, {
        recordName: domainName,
        zone: props.zone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(redirectDist)),
      });
    });

  }
}