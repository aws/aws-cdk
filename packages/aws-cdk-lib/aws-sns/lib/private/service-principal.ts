import { ServicePrincipal } from '../../../aws-iam';
import { ArnFormat, Stack, Token } from '../../../core';
import type { IResource } from '../../../core';
import { RegionInfo } from '../../../region-info';
import { Topic } from '../topic';
import type { ITopic } from '../topic-base';

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
 * Limitation: this can only regionalize the principal when both regions are known
 * at synthesis time. If either region is unresolved — e.g. an environment-agnostic
 * stack (no explicit `env`) or a topic imported from a tokenized ARN — the opt-in
 * fix cannot be applied and the global `sns.amazonaws.com` principal is used. In
 * that case, for a cross-region opt-in subscription to work, either give the stack
 * an explicit `env` or add the regionalized `sns.<region>.amazonaws.com` principal
 * to the resource policy manually.
 */
export function snsServicePrincipal(topic: ITopic, subscriber: IResource): ServicePrincipal {
  const topicRegion = resolveTopicRegion(topic, subscriber);
  const subscriberRegion = Stack.of(subscriber).region;

  if (!topicRegion || Token.isUnresolved(topicRegion) || Token.isUnresolved(subscriberRegion)) {
    return new ServicePrincipal('sns.amazonaws.com');
  }

  if (topicRegion === subscriberRegion) {
    return new ServicePrincipal('sns.amazonaws.com');
  }

  const isTopicOptIn = RegionInfo.get(topicRegion).isOptInRegion;
  const isSubscriberOptIn = RegionInfo.get(subscriberRegion).isOptInRegion;

  if (isSubscriberOptIn) {
    return ServicePrincipal.fromStaticServicePrincipleName(`sns.${subscriberRegion}.amazonaws.com`);
  }

  if (isTopicOptIn) {
    return ServicePrincipal.fromStaticServicePrincipleName(`sns.${topicRegion}.amazonaws.com`);
  }

  return new ServicePrincipal('sns.amazonaws.com');
}

function resolveTopicRegion(topic: ITopic, subscriber: IResource): string | undefined {
  if (topic instanceof Topic) {
    return Token.isUnresolved(topic.env.region) ? undefined : topic.env.region;
  }
  // For imported topics the region is derived from the ARN. If the ARN is a token
  // (e.g. passed via a CfnParameter) it cannot be split at synth time, and the region
  // extracted from a partial ARN may itself be an empty string or a token.
  if (Token.isUnresolved(topic.topicArn)) {
    return undefined;
  }
  const region = Stack.of(subscriber).splitArn(topic.topicArn, ArnFormat.SLASH_RESOURCE_NAME).region;
  return region && !Token.isUnresolved(region) ? region : undefined;
}
