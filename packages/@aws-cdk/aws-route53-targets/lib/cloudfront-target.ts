import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import { Aws, CfnMapping, Stack } from '@aws-cdk/core';
import { IConstruct } from 'constructs';

/**
 * Use a CloudFront Distribution as an alias record target
 */
export class CloudFrontTarget implements route53.IAliasRecordTarget {
  /**
   * The hosted zone Id if using an alias record in Route53.
   * This value never changes.
   */
  public static readonly CLOUDFRONT_ZONE_ID = 'Z2FDTNDATAQYW2';

  /**
   * Get the hosted zone id for the current scope.
   *
   * @param scope - scope in which this resource is defined
   */
  public static getHostedZoneId(scope: IConstruct) {
    const mappingName = 'AWSCloudFrontPartitionHostedZoneIdMap';
    const scopeStack = Stack.of(scope);

    let mapping =
      (scopeStack.node.tryFindChild(mappingName) as CfnMapping) ??
      new CfnMapping(scopeStack, mappingName, {
        mapping: {
          ['aws']: {
            zoneId: 'Z2FDTNDATAQYW2', // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html
          },
          ['aws-cn']: {
            zoneId: 'Z3RFFRIM2A3IF5', // https://docs.amazonaws.cn/en_us/aws/latest/userguide/route53.html
          },
        },
      });

    return mapping.findInMap(Aws.PARTITION, 'zoneId');
  }

  constructor(private readonly distribution: cloudfront.IDistribution) {
  }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.distribution),
      dnsName: this.distribution.domainName,
    };
  }
}
