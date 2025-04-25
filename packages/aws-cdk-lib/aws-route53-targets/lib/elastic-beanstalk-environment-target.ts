import { IAliasRecordTargetProps } from './shared';
import * as route53 from '../../aws-route53';
import * as cdk from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { RegionInfo } from '../../region-info';

/**
 * Properties for Beanstalk environment alias record target
 */
export interface IBeanstalkAliasRecordTargetProps extends IAliasRecordTargetProps {
  /**
   * Hosted zone ID of the target Beanstalk environment.
   * You can use `RegionInfo.get(yourRegion).ebsEnvEndpointHostedZoneId` to get this value
   *
   * @default - auto detected from stack region or Beanstalk environment endpoint
   */
  readonly hostedZoneId?: string;
}

/**
 * Use an Elastic Beanstalk environment URL as an alias record target.
 * E.g. mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com
 * or mycustomcnameprefix.us-east-1.elasticbeanstalk.com
 *
 * Only supports Elastic Beanstalk environments created after 2016 that have a regional endpoint.
 */
export class ElasticBeanstalkEnvironmentEndpointTarget implements route53.IAliasRecordTarget {
  private hostedZoneId?: string;

  constructor(private readonly environmentEndpoint: string, private readonly props?: IBeanstalkAliasRecordTargetProps) {
    this.hostedZoneId = props?.hostedZoneId;
  }

  public bind(record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    if (!this.hostedZoneId) {
      let { region } = cdk.Stack.of(record);

      if (!cdk.Token.isUnresolved(this.environmentEndpoint)) {
        const subDomains = cdk.Fn.split('.', this.environmentEndpoint);
        const regionSubdomainIndex = subDomains.length - 3;
        region = cdk.Fn.select(regionSubdomainIndex, subDomains);
      }

      this.hostedZoneId = RegionInfo.get(region).ebsEnvEndpointHostedZoneId;
    }

    if (!this.hostedZoneId) {
      throw new ValidationError('Cannot find Beanstalk `hostedZoneId`. You must specify either `hostedZoneId` using `RegionInfo.get(yourRegion).ebsEnvEndpointHostedZoneId` or Stack region or find correct EBS environment endpoint via AWS console. See Elastic Beanstalk developer guide: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customdomains.html', record);
    }

    return {
      hostedZoneId: this.hostedZoneId,
      dnsName: this.environmentEndpoint,
      evaluateTargetHealth: this.props?.evaluateTargetHealth,
    };
  }
}
