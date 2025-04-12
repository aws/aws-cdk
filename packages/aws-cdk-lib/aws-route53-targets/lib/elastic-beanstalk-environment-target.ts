import { IAliasRecordTargetProps } from './shared';
import * as route53 from '../../aws-route53';
import * as cdk from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { RegionInfo } from '../../region-info';

/**
 * Use an Elastic Beanstalk environment URL as an alias record target.
 * E.g. mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com
 * or mycustomcnameprefix.us-east-1.elasticbeanstalk.com
 *
 * Only supports Elastic Beanstalk environments created after 2016 that have a regional endpoint.
 */
export class ElasticBeanstalkEnvironmentEndpointTarget implements route53.IAliasRecordTarget {
  constructor( private readonly environmentEndpoint: string, private readonly props?: IAliasRecordTargetProps) {}

  public bind(record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    let hostedZoneId: string | undefined;

    let { region } = cdk.Stack.of(record);

    if (!cdk.Token.isUnresolved(this.environmentEndpoint)) {
      const subDomains = cdk.Fn.split('.', this.environmentEndpoint);
      const regionSubdomainIndex = subDomains.length - 3;
      region = cdk.Fn.select(regionSubdomainIndex, subDomains);
    }

    hostedZoneId = RegionInfo.get(region).ebsEnvEndpointHostedZoneId;

    if (!hostedZoneId) {
      throw new ValidationError(`Elastic Beanstalk environment target is not supported for "${region}" region. You must specify Stack region or find EBS environment endpoint via AWS console. See Elastic Beanstalk developer guide: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customdomains.html`, record);
    }

    return {
      hostedZoneId,
      dnsName: this.environmentEndpoint,
      evaluateTargetHealth: this.props?.evaluateTargetHealth,
    };
  }
}
