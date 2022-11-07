import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Statistic } from '@aws-cdk/aws-cloudwatch';
import { Duration, Resource } from '@aws-cdk/core';
import { ICertificate } from './certificate';

/**
 * Shared properties for certificates
 *
 * @internal
 */
export interface BaseCertificateProps {
  /**
   * Fully-qualified domain name to request a certificate for.
   *
   * May contain wildcards, such as ``*.domain.com``.
   */
  readonly domainName: string;

  /**
   * Alternative domain names on your certificate.
   *
   * Use this to register alternative domain names that represent the same site.
   *
   * @default - No additional FQDNs will be included as alternative domain names.
   */
  readonly subjectAlternativeNames?: string[];

  /**
   * Enable or disable transparency logging for this certificate
   *
   * Once a certificate has been logged, it cannot be removed from the log.
   * Opting out at that point will have no effect. If you opt out of logging
   * when you request a certificate and then choose later to opt back in,
   * your certificate will not be logged until it is renewed.
   * If you want the certificate to be logged immediately, we recommend that you issue a new one.
   *
   * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-bestpractices.html#best-practices-transparency
   *
   * @default true
   */
  readonly transparencyLoggingEnabled?: boolean;

  /**
   * The Certifcate name.
   *
   * Since the Certifcate resource doesn't support providing a physical name, the value provided here will be recorded in the `Name` tag
   *
   * @default the full, absolute path of this construct
   */
  readonly certificateName?: string
}

/**
 * Shared implementation details of ICertificate implementations.
 *
 * @internal
 */
export abstract class CertificateBase extends Resource implements ICertificate {
  public abstract readonly certificateArn: string;

  /**
    * If the certificate is provisionned in a different region than the
    * containing stack, this should be the region in which the certificate lives
    * so we can correctly create `Metric` instances.
    */
  protected readonly region?: string;

  public metricDaysToExpiry(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      period: Duration.days(1),
      ...props,
      dimensionsMap: { CertificateArn: this.certificateArn },
      metricName: 'DaysToExpiry',
      namespace: 'AWS/CertificateManager',
      region: this.region,
      statistic: Statistic.MINIMUM,
    });
  }
}
