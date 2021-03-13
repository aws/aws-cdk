import { Fn } from '@aws-cdk/core';

export function parseRuleName(topicRuleArn: string): string {
  return Fn.select(1, Fn.split('rule/', topicRuleArn));
}
