import { CloudFrontTarget } from './cloudfront-target';
import { GraphqlApi } from '../../aws-appsync';
import {
  AliasRecordTargetConfig,
  IAliasRecordTarget,
  IHostedZone,
  IRecordSet,
} from '../../aws-route53';

/**
 * Defines an AppSync Graphql API as the alias target. Requires that the domain
 * name will be defined through `GraphqlApiProps.domainName`.
 */
export class AppSyncTarget implements IAliasRecordTarget {
  constructor(private readonly graphqlApi: GraphqlApi) {}

  public bind(_record: IRecordSet, _zone?: IHostedZone): AliasRecordTargetConfig {
    return {
      dnsName: this.graphqlApi.appSyncDomainName,
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.graphqlApi),
    };
  }
}
