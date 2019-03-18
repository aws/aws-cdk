import cxapi = require('@aws-cdk/cx-api');
import { ElbV1Tag } from '@aws-cdk/cx-api';
import { Mode, SDK } from '../api';
import { debug } from '../logging';
import { ContextProviderPlugin } from './provider';

/**
 * Plugin to retrieve the Availability Zones for the current account
 */
export class ElbV1ContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SDK) {
  }

  public async getValue(args: cxapi.ElbV1ContextQuery) {
    const region = args.region;
    const account = args.account;

    debug(`Reading ElbV1s for ${account}/${region}`);
    const elb = await this.aws.elbv1(account, region, Mode.ForReading);
    const lbDescriptions = await this.getElbs(elb);

    const searchResults: string[] = [];
    for (const lbDescription of lbDescriptions) {
      const found = await this.runFilters(args.filter, lbDescription, elb);
      if (found && lbDescription.DNSName != null) {
        searchResults.push(lbDescription.DNSName);
      }
    }
    return searchResults;
  }

  /**
   * Get all of the elastic v1 load balancers
   * @param elb elb
   */
  private async getElbs(elb: AWS.ELB) {
    let lbDescriptionsArray: AWS.ELB.LoadBalancerDescription[] = [];

    let params: AWS.ELB.Types.DescribeAccessPointsInput = { LoadBalancerNames: [] };

    // Iterate through all of the pages
    do {
      const response = await elb.describeLoadBalancers(params).promise();
      lbDescriptionsArray = [...lbDescriptionsArray, ...response.LoadBalancerDescriptions || []];
      params = { Marker: response.NextMarker };
    } while (params.Marker != null && params.Marker !== "");

    return lbDescriptionsArray;
  }

  private async runFilters(filters: cxapi.ElbV1Filters,
                           lbDescription: AWS.ELB.LoadBalancerDescription,
                           elb: AWS.ELB) {
    if (filters.vpcId != null && lbDescription.VPCId !== filters.vpcId) {
      return false;
    }

    const tagsExists = filters.tags != null && filters.tags.length > 0;
    if (tagsExists && lbDescription.LoadBalancerName != null) {
      const tagDescriptionResponse = await elb.describeTags({ LoadBalancerNames: [lbDescription.LoadBalancerName] }).promise();

      // There are no tags at all when tags have been listed
      if (!tagDescriptionResponse.TagDescriptions) {
        return false;
      }

      const filteredResults = tagDescriptionResponse.TagDescriptions
        .map(tagDescription => tagDescription.Tags)
        .filter(tags => this.matchTagsWithSearchTags(tags, filters.tags));

      return filteredResults.length > 0;
    }

    return true;
  }

  private matchTagsWithSearchTags(tags: AWS.ELB.Tag[] | undefined, searchTags: ElbV1Tag[]) {
    if (tags != null) {
      const tagMatches = tags.filter(tag => this.matchIndividualTag(tag, searchTags));
      return tagMatches.length > 0;
    }
    return false;
  }

  private matchIndividualTag(tag: AWS.ELB.Tag, searchTags: ElbV1Tag[]) {
    const matches = searchTags.filter(searchTag => {
      const keyMatches = searchTag.key === tag.Key;
      const valueMatchesIfProvided = searchTag.value == null ||
        (searchTag.value != null && searchTag.value === tag.Value);
      return keyMatches && valueMatchesIfProvided;
    });
    return matches.length > 0;
  }
}

