import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { RegionInfo } from '@aws-cdk/region-info';

/**
 * Use an Elastic Beanstalk environment URL as an alias record target.
 * E.g. mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com
 * or mycustomcnameprefix.us-east-1.elasticbeanstalk.com
 *
 * Only supports Elastic Beanstalk environments created after 2016 that have a regional endpoint.
 */
export class ElasticBeanstalkEnvironmentEndpointTarget implements route53.IAliasRecordTarget {
  constructor(private readonly environmentEndpoint: string) {
  }

  public bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    if (cdk.Token.isUnresolved(this.environmentEndpoint)) {
      throw new Error('Cannot use an EBS alias as `environmentEndpoint`. You must find your EBS environment endpoint via the AWS console. See the Elastic Beanstalk developer guide: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customdomains.html');
    }

    const dnsName = this.environmentEndpoint;
    const subDomains = cdk.Fn.split('.', dnsName);
    const regionSubdomainIndex = subDomains.length - 3;
    const region = cdk.Fn.select(regionSubdomainIndex, subDomains);
    const { ebsEnvEndpointHostedZoneId: hostedZoneId } = RegionInfo.get(region);

    if (!hostedZoneId || !dnsName) {
      throw new Error(`Elastic Beanstalk environment target is not supported for the "${region}" region.`);
    }

    return {
      hostedZoneId,
      dnsName,
    };
  }
}
