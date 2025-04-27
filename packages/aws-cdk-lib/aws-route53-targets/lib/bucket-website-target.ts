import { IAliasRecordTargetProps } from './shared';
import * as route53 from '../../aws-route53';
import * as s3 from '../../aws-s3';
import { Stack, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { RegionInfo } from '../../region-info';

/**
 * Use a S3 as an alias record target
 */
export class BucketWebsiteTarget implements route53.IAliasRecordTarget {
  constructor(private readonly bucket: s3.IBucket, private readonly props?: IAliasRecordTargetProps) {}

  public bind(record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    const { region } = Stack.of(this.bucket.stack);

    if (Token.isUnresolved(region)) {
      throw new ValidationError([
        'Cannot use an S3 record alias in region-agnostic stacks.',
        'You must specify a specific region when you define the stack',
        '(see https://docs.aws.amazon.com/cdk/latest/guide/environments.html)',
      ].join(' '), record);
    }

    const { s3StaticWebsiteHostedZoneId: hostedZoneId, s3StaticWebsiteEndpoint: dnsName } = RegionInfo.get(region);

    if (!hostedZoneId || !dnsName) {
      throw new ValidationError(`Bucket website target is not supported for the "${region}" region`, record);
    }

    return { hostedZoneId, dnsName, evaluateTargetHealth: this.props?.evaluateTargetHealth };
  }
}
