import { Fn } from '@aws-cdk/core';

export { undefinedIfAllValuesAreEmpty } from '@aws-cdk/core/lib/util';

export function parseRuleName(topicRuleArn: string): string {
  return Fn.select(1, Fn.split('rule/', topicRuleArn));
}
