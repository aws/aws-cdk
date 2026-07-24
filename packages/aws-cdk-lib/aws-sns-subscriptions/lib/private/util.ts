import * as iam from '../../../aws-iam';
import * as sns from '../../../aws-sns';
import type { IResource } from '../../../core';
import { ArnFormat, Token, Stack } from '../../../core';
import { RegionInfo } from '../../../region-info';

export function regionFromArn(topic: sns.ITopic, resource: IResource): string | undefined {
  // no need to specify `region` for topics defined within the same stack.
  if (topic instanceof sns.Topic) {
    if (topic.stack !== resource.stack) {
      // only if we know the region, will not work for
      // env agnostic stacks
      if (!Token.isUnresolved(topic.env.region) && topic.env.region !== resource.env.region) {
        return topic.env.region;
      }
    }
    return undefined;
  }
  return Stack.of(topic).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
}

/**
 * Determine the correct SNS service principal for cross-region subscriptions
 * involving opt-in regions.
 *
 * Per https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html:
 * - Default region → opt-in region: sns.<subscriber-region>.amazonaws.com
 * - Opt-in region → default region: sns.<topic-region>.amazonaws.com
 * - Opt-in region → opt-in region: sns.<subscriber-region>.amazonaws.com
 * - Default region → default region: sns.amazonaws.com (global)
 *
 * When regions cannot be determined at synth time (tokens), falls back to the
 * global principal.
 */
export function snsServicePrincipal(topic: sns.ITopic, subscriber: IResource): iam.ServicePrincipal {
  const topicRegion = resolveTopicRegion(topic, subscriber);
  const subscriberRegion = Stack.of(subscriber).region;

  if (!topicRegion || Token.isUnresolved(topicRegion) || Token.isUnresolved(subscriberRegion)) {
    return new iam.ServicePrincipal('sns.amazonaws.com');
  }

  if (topicRegion === subscriberRegion) {
    return new iam.ServicePrincipal('sns.amazonaws.com');
  }

  const isTopicOptIn = RegionInfo.get(topicRegion).isOptInRegion;
  const isSubscriberOptIn = RegionInfo.get(subscriberRegion).isOptInRegion;

  if (isSubscriberOptIn) {
    return iam.ServicePrincipal.fromStaticServicePrincipleName(`sns.${subscriberRegion}.amazonaws.com`);
  }

  if (isTopicOptIn) {
    return iam.ServicePrincipal.fromStaticServicePrincipleName(`sns.${topicRegion}.amazonaws.com`);
  }

  return new iam.ServicePrincipal('sns.amazonaws.com');
}

function resolveTopicRegion(topic: sns.ITopic, subscriber: IResource): string | undefined {
  if (topic instanceof sns.Topic) {
    if (!Token.isUnresolved(topic.env.region)) {
      return topic.env.region;
    }
    return undefined;
  }
  return Stack.of(subscriber).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
}
