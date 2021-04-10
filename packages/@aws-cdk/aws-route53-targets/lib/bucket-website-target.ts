import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack, Token } from '@aws-cdk/core';
import { RegionInfo } from '@aws-cdk/region-info';

/**
 * Use a S3 as an alias record target
 */
export class BucketWebsiteTarget implements route53.IAliasRecordTarget {
  constructor(private readonly bucket: s3.IBucket) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    const { region } = Stack.of(this.bucket.stack);

    if (Token.isUnresolved(region)) {
      throw new Error([
        'Cannot use an S3 record alias in region-agnostic stacks.',
        'You must specify a specific region when you define the stack',
        '(see https://docs.aws.amazon.com/cdk/latest/guide/environments.html)',
      ].join(' '));
    }

    const { s3StaticWebsiteHostedZoneId: hostedZoneId, s3StaticWebsiteEndpoint: dnsName } = RegionInfo.get(region);

    if (!hostedZoneId || !dnsName) {
      throw new Error(`Bucket website target is not supported for the "${region}" region`);
    }

    return { hostedZoneId, dnsName };
  }
}
